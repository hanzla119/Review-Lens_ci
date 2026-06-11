import { ChatMessage } from "../models/ChatMessage.js";
import { getDatasetProducts } from "../services/productDatasetService.js";
import { env } from "../config/env.js";

// Helper to search products locally in case Gemini fails or key is missing
const fallbackLocalSearch = (message, products) => {
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const queryText = normalize(message);
  
  // Extract potential budget
  let maxPrice = Infinity;
  const kMatch = queryText.match(/(?:under|below|less than|max(?:imum)?|up to)\s+(?:pkr\s+)?(\d+)\s*k?/i);
  const rawMatch = queryText.match(/(?:under|below|less than|max(?:imum)?|up to)\s+(?:pkr\s+)?(\d+)(?!\s*k)/i);
  if (kMatch) {
    maxPrice = Number(kMatch[1]) * 1000;
  } else if (rawMatch) {
    maxPrice = Number(rawMatch[1]);
  }

  // Extract minimum sentiment threshold if mentioned
  let minSentiment = 0;
  if (/\b(highly positive|excellent|great|best|top|5 star|5-star)\b/.test(queryText)) {
    minSentiment = 80;
  } else if (/\b(positive|good|solid|strong|recommended)\b/.test(queryText)) {
    minSentiment = 70;
  }

  const stopwords = [
    "find", "me", "show", "a", "the", "under", "pkr", "with", "and", "or", "is", "are", "be", "get",
    "good", "best", "high", "positive", "review", "reviews", "price", "budget", "my", "for", "in", "of", "please",
    "from", "on", "that", "this", "now", "today", "want", "wanting", "need", "search", "searching", "amazon", "ebay", "daraz", "shopify", "aliexpress"
  ];

  const keywords = queryText
    .replace(/\d+k?/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopwords.includes(word))
    .map((word) => word.replace(/s$/, ""));

  const synonyms = {
    headphone: ["headset", "earphone", "audio", "earbud"],
    headphones: ["headset", "earphone", "audio", "earbud"],
    phone: ["smartphone", "mobile", "cellphone"],
    smartphones: ["phone", "mobile", "cellphone"],
    laptop: ["notebook", "computer"],
    watch: ["wearable", "smartwatch"],
  };

  const matchKeywords = (keyword, text) => {
    if (text.includes(keyword)) return true;
    const synonymsForKey = synonyms[keyword];
    if (synonymsForKey) {
      return synonymsForKey.some((synonym) => text.includes(synonym));
    }
    return false;
  };

  const matched = products
    .map((product) => {
      const productText = normalize(
        [
          product.name,
          product.category,
          product.brand || "",
          product.description || "",
          product.platform,
          product.sourceDataset || ""
        ].join(" ")
      );

      const matchCount = keywords.reduce((count, keyword) =>
        matchKeywords(keyword, productText) ? count + 1 : count,
      0);

      const exactNameMatch = keywords.some((keyword) => product.name.toLowerCase().includes(keyword));
      const score = matchCount * 10 + (exactNameMatch ? 20 : 0);

      return { product, score, matchCount };
    })
    .filter(({ product, score }) => {
      const priceMatch = product.price <= maxPrice;
      const sentimentMatch = !minSentiment || (product.sentiment && product.sentiment.positive >= minSentiment);
      return score > 0 && priceMatch && sentimentMatch;
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const sentimentDiff = (b.product.sentiment?.positive || 0) - (a.product.sentiment?.positive || 0);
      if (sentimentDiff !== 0) return sentimentDiff;
      return a.product.price - b.product.price;
    })
    .slice(0, 6)
    .map(({ product }) => product);

  let content = `I searched our catalog for: "${message}".`;
  if (matched.length > 0) {
    content += ` Here are ${matched.length} product${matched.length > 1 ? "s" : ""} matching your criteria:`;
  } else {
    content += ` I couldn't find any direct matches within those criteria. Here are a couple of featured items from our database.`;
  }

  return {
    content,
    productIds: matched.length > 0 ? matched.map((p) => p.id) : products.slice(0, 2).map((p) => p.id),
  };
};

export const listChatHistory = async (req, res, next) => {
  try {
    const history = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json({ history });
  } catch (error) {
    next(error);
  }
};

export const sendChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Save user message to database
    await ChatMessage.create({
      userId: req.user._id,
      role: "user",
      content: message,
    });

    // Fetch the available products in catalog
    const { products } = await getDatasetProducts({ limit: 1000 });
    
    let chatbotResponse = null;

    if (env.geminiApiKey) {
      try {
        const productCatalog = products.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand || "",
          category: p.category,
          platform: p.platform,
          price: `${p.currency || 'PKR'} ${p.price}`,
          originalPrice: p.originalPrice ? `${p.currency || 'PKR'} ${p.originalPrice}` : undefined,
          rating: p.rating,
          reviewCount: p.reviewCount,
          sentiment_positive: `${p.sentiment?.positive}%`,
          description: p.description || "",
        }));

        const systemInstruction = `You are the Review Lens shopping assistant. Below is the list of products currently available in our marketplace catalog.

Marketplace Products:
${JSON.stringify(productCatalog, null, 2)}

Analyze the user query. Recommend the best matching products from the list. Explain why you recommended them based on price, category, rating, and review sentiment.
Be polite, helpful, and naturally conversational.
Format your response strictly as a JSON object matching this schema:
{
  "content": "natural-language markdown response text...",
  "productIds": ["matching-product-id-1", "matching-product-id-2"]
}`;

        const payload = {
          contents: [
            {
              role: "user",
              parts: [{ text: systemInstruction + `\n\nUser prompt: "${message}"` }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(12000)
        });

        if (response.ok) {
          const responseData = await response.json();
          const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
          chatbotResponse = JSON.parse(text);
        } else {
          console.warn("Gemini API call failed, falling back to local search.");
        }
      } catch (geminiError) {
        console.warn("Error calling Gemini API:", geminiError.message);
      }
    }

    // Fallback if Gemini failed or is not configured
    if (!chatbotResponse) {
      chatbotResponse = fallbackLocalSearch(message, products);
    }

    // Fetch the actual full product objects for matched IDs
    const matchedProducts = products.filter(p => chatbotResponse.productIds.includes(p.id));

    // Save assistant message to database
    const assistantMessage = await ChatMessage.create({
      userId: req.user._id,
      role: "assistant",
      content: chatbotResponse.content,
      products: matchedProducts,
    });

    res.json({ message: assistantMessage });
  } catch (error) {
    next(error);
  }
};
