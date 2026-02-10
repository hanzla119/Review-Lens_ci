import { Search, Sparkles, TrendingUp, MessageSquare, Star, ShoppingBag } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  image: string;
  platform: string;
  category: string;
  priceHistory: { date: string; price: number }[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Apple MacBook Pro 14\" M3 Pro",
    price: 199999,
    originalPrice: 249999,
    rating: 4.8,
    reviewCount: 2847,
    sentiment: { positive: 85, neutral: 10, negative: 5 },
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    platform: "Amazon",
    category: "Laptops",
    priceHistory: [
      { date: "2024-01", price: 249999 },
      { date: "2024-02", price: 239999 },
      { date: "2024-03", price: 229999 },
      { date: "2024-04", price: 219999 },
      { date: "2024-05", price: 199999 },
    ],
  },
  {
    id: "2",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 29990,
    originalPrice: 34990,
    rating: 4.7,
    reviewCount: 5621,
    sentiment: { positive: 78, neutral: 15, negative: 7 },
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    platform: "Daraz",
    category: "Audio",
    priceHistory: [
      { date: "2024-01", price: 34990 },
      { date: "2024-02", price: 32990 },
      { date: "2024-03", price: 31990 },
      { date: "2024-04", price: 30990 },
      { date: "2024-05", price: 29990 },
    ],
  },
  {
    id: "3",
    name: "Samsung Galaxy S24 Ultra 256GB",
    price: 184999,
    originalPrice: 199999,
    rating: 4.6,
    reviewCount: 3892,
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    platform: "Amazon",
    category: "Smartphones",
    priceHistory: [
      { date: "2024-01", price: 199999 },
      { date: "2024-02", price: 194999 },
      { date: "2024-03", price: 189999 },
      { date: "2024-04", price: 187999 },
      { date: "2024-05", price: 184999 },
    ],
  },
  {
    id: "4",
    name: "Nike Air Jordan 1 Retro High OG",
    price: 16995,
    rating: 4.9,
    reviewCount: 8234,
    sentiment: { positive: 92, neutral: 5, negative: 3 },
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    platform: "Shopify",
    category: "Footwear",
    priceHistory: [
      { date: "2024-01", price: 18995 },
      { date: "2024-02", price: 17995 },
      { date: "2024-03", price: 17495 },
      { date: "2024-04", price: 16995 },
      { date: "2024-05", price: 16995 },
    ],
  },
  {
    id: "5",
    name: "DJI Mini 4 Pro Drone",
    price: 89900,
    originalPrice: 99900,
    rating: 4.5,
    reviewCount: 1456,
    sentiment: { positive: 68, neutral: 22, negative: 10 },
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
    platform: "Amazon",
    category: "Drones",
    priceHistory: [
      { date: "2024-01", price: 99900 },
      { date: "2024-02", price: 97900 },
      { date: "2024-03", price: 94900 },
      { date: "2024-04", price: 92900 },
      { date: "2024-05", price: 89900 },
    ],
  },
  {
    id: "6",
    name: "Logitech MX Master 3S Mouse",
    price: 10999,
    rating: 4.8,
    reviewCount: 4521,
    sentiment: { positive: 88, neutral: 8, negative: 4 },
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    platform: "Daraz",
    category: "Accessories",
    priceHistory: [
      { date: "2024-01", price: 12999 },
      { date: "2024-02", price: 12499 },
      { date: "2024-03", price: 11999 },
      { date: "2024-04", price: 11499 },
      { date: "2024-05", price: 10999 },
    ],
  },
];

export const features = [
  {
    icon: Search,
    title: "Multi-Platform Search",
    description: "Search across Amazon, Daraz, Shopify and more platforms simultaneously",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Advanced sentiment analysis to understand real customer opinions",
  },
  {
    icon: TrendingUp,
    title: "Price Tracking",
    description: "Monitor price changes and get alerts for the best deals",
  },
  {
    icon: MessageSquare,
    title: "Smart Chatbot",
    description: "Ask questions in natural language and get instant product recommendations",
  },
  {
    icon: Star,
    title: "Review Aggregation",
    description: "All reviews from multiple sources analyzed in one place",
  },
  {
    icon: ShoppingBag,
    title: "Smart Recommendations",
    description: "Personalized product suggestions based on your preferences",
  },
];

export const platforms = ["Amazon", "Daraz", "Shopify", "eBay", "AliExpress"];
export const categories = ["All", "Laptops", "Smartphones", "Audio", "Footwear", "Drones", "Accessories"];
