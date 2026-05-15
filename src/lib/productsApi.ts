import type { Product } from "@/data/mockData";

export interface ProductsResponse {
  products: Product[];
  source: string;
  total: number;
  warning?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const HF_ROWS_URL = "https://datasets-server.huggingface.co/rows";
const HF_DATASET = "gatech-scheller-ai-in-business/amazon-products";
const PKR_EXCHANGE_RATE = 278;
const MAX_PRODUCTS = 500;
const DATASET_PAGE_SIZE = 100;

interface HuggingFaceRow {
  parent_asin?: string;
  title?: string;
  description?: string[];
  price?: string;
  price_numeric?: number;
  average_rating?: number;
  rating_number?: number;
  features?: string[];
  categories?: string[];
  store?: string;
  images?: {
    hi_res?: string[];
    large?: string[];
    thumb?: string[];
  };
  main_category?: string;
}

const bundledDatasetProducts: Product[] = [
  {
    id: "hf-bundled-pny-1tb",
    name: "PNY 1TB PRO Elite Class 10 U3 V30 microSDXC Flash Memory Card",
    price: 30577,
    originalPrice: 34246,
    currency: "PKR",
    rating: 4.7,
    reviewCount: 3380,
    sentiment: { positive: 85, neutral: 10, negative: 5 },
    image: "https://m.media-amazon.com/images/I/61jajvgWBzL._AC_SL1000_.jpg",
    platform: "Amazon",
    category: "Accessories",
    brand: "PNY",
    sourceDataset: "Amazon Products Sample Dataset",
    productUrl: "https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products",
    description: "High-speed microSDXC memory card for smartphones, tablets, drones, cameras, and gaming consoles.",
    specifications: {
      storage: "1TB",
      speed_class: "Class 10, U3, V30, A2",
      source: "Hugging Face Amazon Products Sample",
    },
    priceHistory: [
      { date: "2026-01", price: 36080 },
      { date: "2026-02", price: 33635 },
      { date: "2026-03", price: 31800 },
      { date: "2026-04", price: 30577 },
    ],
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: 5,
        text: "3380 public ratings with an average score of 4.7 in the Amazon Products dataset.",
        sentiment: "positive",
        helpfulVotes: 270,
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  },
  {
    id: "hf-bundled-jbl-flip5",
    name: "JBL Flip 5 Waterproof Portable Bluetooth Speaker",
    price: 22212,
    originalPrice: 24877,
    currency: "PKR",
    rating: 4.7,
    reviewCount: 762,
    sentiment: { positive: 85, neutral: 10, negative: 5 },
    image: "https://m.media-amazon.com/images/I/71RV1kbpNwL._AC_SL1500_.jpg",
    platform: "Amazon",
    category: "Audio",
    brand: "Amazon Renewed",
    sourceDataset: "Amazon Products Sample Dataset",
    productUrl: "https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products",
    description: "Waterproof portable Bluetooth speaker with strong outdoor sound and long playtime.",
    specifications: {
      connectivity: "Bluetooth",
      water_resistance: "IPX7",
      source: "Hugging Face Amazon Products Sample",
    },
    priceHistory: [
      { date: "2026-01", price: 26210 },
      { date: "2026-02", price: 24433 },
      { date: "2026-03", price: 23100 },
      { date: "2026-04", price: 22212 },
    ],
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: 5,
        text: "762 public ratings with an average score of 4.7 in the Amazon Products dataset.",
        sentiment: "positive",
        helpfulVotes: 61,
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  },
  {
    id: "hf-bundled-macbook-case",
    name: "May Chen Compatible with MacBook Pro 16 inch Hard Shell Case",
    price: 7503,
    originalPrice: 8403,
    currency: "PKR",
    rating: 4.5,
    reviewCount: 649,
    sentiment: { positive: 81, neutral: 13, negative: 6 },
    image: "https://m.media-amazon.com/images/I/71q8TyANDOL._AC_SL1200_.jpg",
    platform: "Amazon",
    category: "Laptops",
    brand: "May Chen",
    sourceDataset: "Amazon Products Sample Dataset",
    productUrl: "https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products",
    description: "Protective hard shell case with keyboard cover and screen protector for MacBook Pro 16 inch.",
    specifications: {
      compatible_model: "MacBook Pro 16 inch A2141",
      material: "Plastic hard shell",
      source: "Hugging Face Amazon Products Sample",
    },
    priceHistory: [
      { date: "2026-01", price: 8854 },
      { date: "2026-02", price: 8253 },
      { date: "2026-03", price: 7803 },
      { date: "2026-04", price: 7503 },
    ],
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: 5,
        text: "649 public ratings with an average score of 4.5 in the Amazon Products dataset.",
        sentiment: "positive",
        helpfulVotes: 52,
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  },
  {
    id: "hf-bundled-garmin-band",
    name: "QGHXO Soft Silicone Replacement Watch Band for Garmin Vivofit 4",
    price: 4139,
    originalPrice: 4636,
    currency: "PKR",
    rating: 4.4,
    reviewCount: 707,
    sentiment: { positive: 79, neutral: 14, negative: 7 },
    image: "https://m.media-amazon.com/images/I/61J-V53DqJL._AC_SL1000_.jpg",
    platform: "Amazon",
    category: "Accessories",
    brand: "QGHXO",
    sourceDataset: "Amazon Products Sample Dataset",
    productUrl: "https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products",
    description: "Soft silicone replacement wrist bands for Garmin Vivofit 4 activity trackers.",
    specifications: {
      material: "Silicone",
      device: "Garmin Vivofit 4",
      source: "Hugging Face Amazon Products Sample",
    },
    priceHistory: [
      { date: "2026-01", price: 4884 },
      { date: "2026-02", price: 4553 },
      { date: "2026-03", price: 4305 },
      { date: "2026-04", price: 4139 },
    ],
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: 4,
        text: "707 public ratings with an average score of 4.4 in the Amazon Products dataset.",
        sentiment: "positive",
        helpfulVotes: 57,
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  },
  {
    id: "hf-bundled-ear-hooks",
    name: "10-Pack Replacement Bluetooth Ear Hook Loop Clip Set",
    price: 970,
    originalPrice: 1086,
    currency: "PKR",
    rating: 3.6,
    reviewCount: 798,
    sentiment: { positive: 65, neutral: 22, negative: 13 },
    image: "https://m.media-amazon.com/images/I/41Q4BZCw3eL._AC_.jpg",
    platform: "Amazon",
    category: "Audio",
    brand: "Tricon",
    sourceDataset: "Amazon Products Sample Dataset",
    productUrl: "https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products",
    description: "Replacement ear hooks and clips for Bluetooth headsets from Samsung, Motorola, LG, and other brands.",
    specifications: {
      pack_size: "10 pieces",
      accessory_type: "Bluetooth headset ear hooks",
      source: "Hugging Face Amazon Products Sample",
    },
    priceHistory: [
      { date: "2026-01", price: 1145 },
      { date: "2026-02", price: 1067 },
      { date: "2026-03", price: 1009 },
      { date: "2026-04", price: 970 },
    ],
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: 4,
        text: "798 public ratings with an average score of 3.6 in the Amazon Products dataset.",
        sentiment: "neutral",
        helpfulVotes: 64,
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  },
  {
    id: "daraz-bundled-smartphone",
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
    brand: "Example Mobile",
    sourceDataset: "Daraz SmartPhone Web Data Scrape",
    productUrl: "https://www.kaggle.com/datasets/akibuddinnayan/daraz-smartphone-web-data-scrape/data",
    description: "Regional smartphone sample normalized from Daraz-style product fields.",
    specifications: {
      ram: "8GB",
      storage: "128GB",
      display: "6.7 inch",
      source: "Daraz smartphone dataset sample",
    },
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
];

const marketplaceChannels = [
  {
    platform: "Amazon",
    sourceDataset: "Amazon Products Sample Dataset",
    priceMultiplier: 1,
    urlFor: (row: HuggingFaceRow) => row.parent_asin ? `https://www.amazon.com/dp/${row.parent_asin}` : "https://www.amazon.com/",
  },
  {
    platform: "eBay",
    sourceDataset: "eBay-style electronics marketplace normalization",
    priceMultiplier: 0.92,
    urlFor: (row: HuggingFaceRow) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(row.title || "electronics")}`,
  },
  {
    platform: "AliExpress",
    sourceDataset: "AliExpress-style electronics marketplace normalization",
    priceMultiplier: 0.78,
    urlFor: (row: HuggingFaceRow) => `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(row.title || "electronics")}`,
  },
  {
    platform: "Shopify",
    sourceDataset: "Shopify public products feed style normalization",
    priceMultiplier: 1.08,
    urlFor: (row: HuggingFaceRow) => `https://www.google.com/search?q=${encodeURIComponent(`${row.title || "electronics"} Shopify store`)}`,
  },
  {
    platform: "Alibaba",
    sourceDataset: "Alibaba supplier catalog style normalization",
    priceMultiplier: 0.7,
    urlFor: (row: HuggingFaceRow) => `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(row.title || "electronics")}`,
  },
  {
    platform: "Daraz",
    sourceDataset: "Daraz regional electronics style normalization",
    priceMultiplier: 0.96,
    urlFor: (row: HuggingFaceRow) => `https://www.daraz.pk/catalog/?q=${encodeURIComponent(row.title || "electronics")}`,
  },
];

const withTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const safeNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const firstImage = (images?: HuggingFaceRow["images"]) =>
  [...(images?.hi_res || []), ...(images?.large || []), ...(images?.thumb || [])].filter(Boolean)[0] ||
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600";

const classifyCategory = (row: HuggingFaceRow) => {
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

const sentimentFromRating = (rating: number) => {
  const positive = Math.min(95, Math.max(45, Math.round(rating * 18)));
  const negative = Math.max(3, Math.round((5 - rating) * 6));
  const neutral = Math.max(2, 100 - positive - negative);
  return { positive, neutral, negative };
};

const makePriceHistory = (price: number) => [
  { date: "2026-01", price: Math.round(price * 1.18) },
  { date: "2026-02", price: Math.round(price * 1.1) },
  { date: "2026-03", price: Math.round(price * 1.04) },
  { date: "2026-04", price: Math.round(price) },
];

const normalizeHuggingFaceProduct = (row: HuggingFaceRow, index: number): Product => {
  const channel = marketplaceChannels[index % marketplaceChannels.length];
  const usdPrice = safeNumber(row.price_numeric || row.price, 1);
  const price = Math.max(1, Math.round(usdPrice * PKR_EXCHANGE_RATE * channel.priceMultiplier));
  const rating = safeNumber(row.average_rating, 4.2);
  const reviewCount = safeNumber(row.rating_number, 0);

  return {
    id: `${channel.platform.toLowerCase()}-${row.parent_asin || `hf-product-${index}`}`,
    name: row.title || "Amazon electronics product",
    price,
    originalPrice: Math.round(price * 1.12),
    currency: "PKR",
    rating,
    reviewCount,
    sentiment: sentimentFromRating(rating),
    image: firstImage(row.images),
    platform: channel.platform,
    category: classifyCategory(row),
    brand: row.store || "Amazon seller",
    sourceDataset: channel.sourceDataset,
    productUrl: channel.urlFor(row),
    description: Array.isArray(row.description) ? row.description.join(" ") : "",
    specifications: {
      features: row.features || [],
      categories: row.categories || [],
      main_category: row.main_category || "",
      original_usd_price: usdPrice,
      source_dataset: HF_DATASET,
    },
    priceHistory: makePriceHistory(price),
    reviews: [
      {
        author: "Amazon dataset reviewer",
        rating: Math.round(rating),
        text: `${reviewCount} public ratings from the source dataset with an average score of ${rating}.`,
        sentiment: rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "negative",
        helpfulVotes: Math.round(reviewCount * 0.08),
        timestamp: "2023-09-30T00:00:00Z",
      },
    ],
  };
};

const fetchHuggingFacePage = async (length: number, offset: number): Promise<Product[]> => {
  const url = new URL(HF_ROWS_URL);
  url.searchParams.set("dataset", HF_DATASET);
  url.searchParams.set("config", "default");
  url.searchParams.set("split", "train");
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("length", String(length));

  const response = await withTimeout(url.toString(), { headers: { Accept: "application/json" } }, 8000);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Hugging Face dataset server is unavailable.");
  }

  const products = (payload.rows || [])
    .map((entry: { row: HuggingFaceRow }, index: number) => normalizeHuggingFaceProduct(entry.row, offset + index))
    .filter((product: Product) => product.name && product.price > 0);

  if (products.length === 0) {
    throw new Error("No products were returned by the Hugging Face dataset.");
  }

  return products;
};

const fetchHuggingFaceProducts = async (limit: number): Promise<ProductsResponse> => {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_PRODUCTS);
  const pageOffsets = Array.from(
    { length: Math.ceil(safeLimit / DATASET_PAGE_SIZE) },
    (_, index) => index * DATASET_PAGE_SIZE,
  );
  const pages = await Promise.all(
    pageOffsets.map((offset, index) => {
      const remaining = safeLimit - index * DATASET_PAGE_SIZE;
      return fetchHuggingFacePage(Math.min(DATASET_PAGE_SIZE, remaining), offset);
    }),
  );
  const products = pages.flat().slice(0, safeLimit);

  return {
    products,
    source: "huggingface-amazon-products",
    total: products.length,
  };
};

const fetchBackendProducts = async (limit: number): Promise<ProductsResponse> => {
  const response = await withTimeout(
    `${API_BASE_URL}/products?limit=${limit}`,
    { headers: { Accept: "application/json" } },
    4000,
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Local backend products endpoint is unavailable.");
  }

  return data as ProductsResponse;
};

export const productsApi = {
  list: async (limit = 500): Promise<ProductsResponse> => {
    const safeLimit = Math.min(Math.max(limit, 1), MAX_PRODUCTS);
    try {
      const backendResponse = await fetchBackendProducts(safeLimit);
      if (backendResponse.products?.length) return backendResponse;
    } catch (error) {
      console.info("Local products API unavailable; trying Hugging Face dataset directly.", error);
    }

    try {
      return await fetchHuggingFaceProducts(safeLimit);
    } catch (error) {
      console.info("Live dataset fetch unavailable; using bundled dataset-backed products.", error);
      return {
        products: bundledDatasetProducts.slice(0, safeLimit),
        source: "bundled-amazon-daraz-dataset-products",
        total: Math.min(safeLimit, bundledDatasetProducts.length),
      };
    }
  },
};
