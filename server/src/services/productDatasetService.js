import fs from "fs/promises";
import path from "path";

const HUGGING_FACE_ROWS_URL = "https://datasets-server.huggingface.co/rows";
const AMAZON_PRODUCTS_DATASET = "gatech-scheller-ai-in-business/amazon-products";
const PKR_EXCHANGE_RATE = 278;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_PRODUCTS = 10000;
const DATASET_PAGE_SIZE = 100;

const marketplaceChannels = [
  {
    platform: "Amazon",
    sourceDataset: "Amazon Products Sample Dataset",
    priceMultiplier: 1,
    urlFor: (row) => (row.parent_asin ? `https://www.amazon.com/dp/${row.parent_asin}` : "https://www.amazon.com/"),
  },
  {
    platform: "eBay",
    sourceDataset: "eBay-style electronics marketplace normalization",
    priceMultiplier: 0.92,
    urlFor: (row) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(row.title || "electronics")}`,
  },
  {
    platform: "AliExpress",
    sourceDataset: "AliExpress-style electronics marketplace normalization",
    priceMultiplier: 0.78,
    urlFor: (row) => `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(row.title || "electronics")}`,
  },
  {
    platform: "Shopify",
    sourceDataset: "Shopify public products feed style normalization",
    priceMultiplier: 1.08,
    urlFor: (row) => `https://www.google.com/search?q=${encodeURIComponent(`${row.title || "electronics"} Shopify store`)}`,
  },
  {
    platform: "Alibaba",
    sourceDataset: "Alibaba supplier catalog style normalization",
    priceMultiplier: 0.7,
    urlFor: (row) => `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(row.title || "electronics")}`,
  },
  {
    platform: "Daraz",
    sourceDataset: "Daraz regional electronics style normalization",
    priceMultiplier: 0.96,
    urlFor: (row) => `https://www.daraz.pk/catalog/?q=${encodeURIComponent(row.title || "electronics")}`,
  },
];

let cachedProducts = null;
let cachedAt = 0;
let cachedSource = "cache";

const fallbackProducts = [
  {
    id: "daraz-smartphone-demo",
    name: "Android Smartphone 8GB RAM 128GB Storage",
    price: 58999,
    originalPrice: 64999,
    currency: "PKR",
    rating: 4.4,
    reviewCount: 1180,
    sentiment: { positive: 82, neutral: 12, negative: 6 },
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
    platform: "Daraz",
    category: "Smartphones",
    sourceDataset: "Daraz SmartPhone Web Data Scrape",
    productUrl: "https://www.kaggle.com/datasets/akibuddinnayan/daraz-smartphone-web-data-scrape/data",
    description: "Regional smartphone sample normalized to Review Lens schema.",
    brand: "Example Mobile",
    specifications: { ram: "8GB", storage: "128GB", display: "6.7 inch" },
    priceHistory: [
      { date: "2026-01", price: 64999 },
      { date: "2026-02", price: 61999 },
      { date: "2026-03", price: 58999 },
    ],
    reviews: [
      {
        author: "Daraz buyer",
        rating: 4,
        text: "Camera is good and delivery was quick.",
        sentiment: "positive",
        helpfulVotes: 5,
        timestamp: "2026-03-18T12:45:00Z",
      },
    ],
  },
  {
    id: "amazon-headphones-demo",
    name: "Wireless Noise Cancelling Headphones",
    price: 29990,
    originalPrice: 34990,
    currency: "PKR",
    rating: 4.7,
    reviewCount: 2520,
    sentiment: { positive: 86, neutral: 10, negative: 4 },
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    platform: "Amazon",
    category: "Audio",
    sourceDataset: "McAuley-Lab/Amazon-Reviews-2023",
    productUrl: "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023",
    description: "Bluetooth headphones with active noise cancellation and long battery life.",
    brand: "Example Audio",
    specifications: { connectivity: "Bluetooth", battery_life: "30 hours", color: "Black" },
    priceHistory: [
      { date: "2026-01", price: 34990 },
      { date: "2026-02", price: 32990 },
      { date: "2026-03", price: 29990 },
    ],
    reviews: [
      {
        author: "Amazon reviewer",
        rating: 5,
        text: "Excellent sound quality and battery life.",
        sentiment: "positive",
        helpfulVotes: 12,
        timestamp: "2026-03-14T10:15:00Z",
      },
    ],
  },
];

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const pickFirstImage = (images) => {
  if (!images) return "";

  const candidates = [
    ...(images.hi_res || []),
    ...(images.large || []),
    ...(images.thumb || []),
  ].filter(Boolean);

  return candidates[0] || "";
};

const classifyCategory = (row) => {
  const categoryText = [...(row.categories || []), row.main_category, row.title]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (categoryText.includes("phone") || categoryText.includes("mobile")) return "Smartphones";
  if (categoryText.includes("laptop") || categoryText.includes("macbook") || categoryText.includes("computer")) return "Laptops";
  if (categoryText.includes("headphone") || categoryText.includes("speaker") || categoryText.includes("audio")) return "Audio";
  if (categoryText.includes("watch") || categoryText.includes("wearable")) return "Accessories";
  if (categoryText.includes("memory") || categoryText.includes("card") || categoryText.includes("peripheral")) return "Accessories";

  return "Electronics";
};

const sentimentFromRating = (rating) => {
  const positive = Math.min(95, Math.max(45, Math.round(rating * 18)));
  const negative = Math.max(3, Math.round((5 - rating) * 6));
  const neutral = Math.max(2, 100 - positive - negative);

  return { positive, neutral, negative };
};

const makePriceHistory = (price) => {
  const safePrice = safeNumber(price, 0);
  return [
    { date: "2026-01", price: Math.round(safePrice * 1.18) },
    { date: "2026-02", price: Math.round(safePrice * 1.1) },
    { date: "2026-03", price: Math.round(safePrice * 1.04) },
    { date: "2026-04", price: Math.round(safePrice) },
  ];
};

const normalizeAmazonProduct = (row, rowIndex) => {
  const channel = marketplaceChannels[rowIndex % marketplaceChannels.length];
  const usdPrice = safeNumber(row.price_numeric || row.price, 0);
  const pkrPrice = Math.max(1, Math.round(usdPrice * PKR_EXCHANGE_RATE * channel.priceMultiplier));
  const originalPrice = Math.round(pkrPrice * 1.12);
  const rating = safeNumber(row.average_rating, 4.2);

  return {
    id: `${channel.platform.toLowerCase()}-${row.parent_asin || `products-${rowIndex}`}`,
    name: row.title || "Untitled Amazon electronics product",
    price: pkrPrice,
    originalPrice,
    currency: "PKR",
    rating,
    reviewCount: safeNumber(row.rating_number, 0),
    sentiment: sentimentFromRating(rating),
    image: pickFirstImage(row.images) || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
    platform: channel.platform,
    category: classifyCategory(row),
    brand: row.store || "Amazon seller",
    sourceDataset: channel.sourceDataset,
    productUrl: channel.urlFor(row),
    description: Array.isArray(row.description) ? row.description.join(" ") : row.description || "",
    specifications: {
      features: row.features || [],
      categories: row.categories || [],
      main_category: row.main_category || "",
      original_usd_price: usdPrice,
      source_dataset: "gatech-scheller-ai-in-business/amazon-products",
    },
    priceHistory: makePriceHistory(pkrPrice),
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: Math.round(rating),
        text: `${row.rating_number || 0} public ratings from the source dataset with an average score of ${rating}.`,
        sentiment: rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "negative",
        helpfulVotes: Math.round(safeNumber(row.rating_number, 0) * 0.08),
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  };
};

const normalizeLocalSample = (record, index) => {
  const currentPrice = safeNumber(record.pricing?.current_price, 0);
  const originalPrice = safeNumber(record.pricing?.original_price, currentPrice * 1.1);
  const rating =
    record.reviews?.length > 0
      ? record.reviews.reduce((sum, review) => sum + safeNumber(review.rating, 0), 0) / record.reviews.length
      : 4.2;
  const positiveReviews = record.reviews?.filter((review) => review.sentiment === "positive").length || 0;
  const reviewCount = record.reviews?.length || 1;
  const positive = Math.round((positiveReviews / reviewCount) * 80 + 15);
  const sampleImage = record.images?.[0] || "";
  const normalizedImage = sampleImage || "/placeholder.svg";

  return {
    id: record.product_id || `local-sample-${index}`,
    name: record.title,
    price: currentPrice,
    originalPrice,
    currency: record.pricing?.currency || "PKR",
    rating: Number(rating.toFixed(1)),
    reviewCount,
    sentiment: {
      positive,
      neutral: Math.max(5, 100 - positive - 8),
      negative: 8,
    },
    image: normalizedImage,
    platform: record.source_platform || "Dataset",
    category: record.category?.split(">").pop()?.trim() || "Electronics",
    brand: record.brand,
    sourceDataset: record.source_dataset,
    productUrl: record.product_url || record.source_url,
    description: record.description,
    specifications: record.specifications || {},
    priceHistory: (record.pricing?.history || []).map((point) => ({
      date: String(point.date).slice(0, 7),
      price: safeNumber(point.price, currentPrice),
    })),
    reviews: (record.reviews || []).map((review) => ({
      author: review.reviewer_name || "Dataset reviewer",
      rating: safeNumber(review.rating, 0),
      text: review.review_text || "",
      sentiment: review.sentiment || "neutral",
      helpfulVotes: safeNumber(review.helpful_votes, 0),
      timestamp: review.timestamp,
    })),
  };
};

const readLocalDatasetSamples = async () => {
  try {
    const samplePath = path.resolve("data/samples/review_lens_products_sample.json");
    const content = await fs.readFile(samplePath, "utf-8");
    return JSON.parse(content).map(normalizeLocalSample);
  } catch (error) {
    console.warn("Could not read local dataset sample products", error.message);
    return fallbackProducts;
  }
};

const paginateProducts = (products, offset, limit) => {
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), MAX_PRODUCTS);

  return {
    safeOffset,
    safeLimit,
    page: products.slice(safeOffset, safeOffset + safeLimit),
  };
};

const fetchAmazonDatasetPage = async (length, offset) => {
  const url = new URL(HUGGING_FACE_ROWS_URL);
  url.searchParams.set("dataset", AMAZON_PRODUCTS_DATASET);
  url.searchParams.set("config", "default");
  url.searchParams.set("split", "train");
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("length", String(length));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face dataset API responded with ${response.status}`);
  }

  const payload = await response.json();
  return (payload.rows || [])
    .map((entry, index) => normalizeAmazonProduct(entry.row, offset + index))
    .filter((product) => product.name && product.price > 0);
};

const fetchAmazonDatasetProducts = async (limit = 24, offset = 0) => {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_PRODUCTS);
  const pageOffsets = Array.from(
    { length: Math.ceil(safeLimit / DATASET_PAGE_SIZE) },
    (_, index) => offset + index * DATASET_PAGE_SIZE,
  );

  const pages = await Promise.all(
    pageOffsets.map((pageOffset, index) => {
      const remaining = safeLimit - index * DATASET_PAGE_SIZE;
      return fetchAmazonDatasetPage(Math.min(DATASET_PAGE_SIZE, remaining), pageOffset);
    }),
  );

  return pages.flat().slice(0, safeLimit);
};

export const getDatasetProducts = async ({ limit = 24, offset = 0, refresh = false } = {}) => {
  const now = Date.now();
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), MAX_PRODUCTS);

  if (!refresh && cachedProducts && now - cachedAt < CACHE_TTL_MS) {
    const { page } = paginateProducts(cachedProducts, safeOffset, safeLimit);
    return {
      products: page,
      source: cachedSource,
      total: cachedProducts.length,
    };
  }

  const localProducts = await readLocalDatasetSamples();

  if (safeOffset < localProducts.length) {
    const { page } = paginateProducts(localProducts, safeOffset, safeLimit);
    cachedProducts = localProducts;
    cachedAt = now;
    cachedSource = "local-normalized-samples";

    return {
      products: page,
      source: cachedSource,
      total: localProducts.length,
    };
  }

  try {
    const missingProductsCount = Math.max(safeOffset + safeLimit - localProducts.length, 0);
    const remoteProducts = missingProductsCount
      ? await fetchAmazonDatasetProducts(missingProductsCount, 0)
      : [];
    const combinedProducts = [...localProducts, ...remoteProducts];
    const { page } = paginateProducts(combinedProducts, safeOffset, safeLimit);
    cachedProducts = combinedProducts;
    cachedAt = now;
    cachedSource = "local-plus-huggingface-products";

    return {
      products: page,
      source: cachedSource,
      total: combinedProducts.length,
    };
  } catch (error) {
    console.warn("Using local dataset product fallback", error.message);
    const combinedProducts = [...localProducts, ...fallbackProducts];
    const { page } = paginateProducts(combinedProducts, safeOffset, safeLimit);
    cachedProducts = combinedProducts;
    cachedAt = now;
    cachedSource = "local-normalized-samples";

    return {
      products: page,
      source: cachedSource,
      total: combinedProducts.length,
      warning: "Live Hugging Face dataset fetch failed, so local normalized dataset samples were used.",
    };
  }
};
