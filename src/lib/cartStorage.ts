import type { Product } from "@/data/mockData";

const CART_STORAGE_KEY = "review_lens_cart";
const LEGACY_WATCHLIST_KEY = "review_lens_watchlist";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  image: string;
  platform: string;
  category: string;
  brand?: string;
  sourceDataset?: string;
  productUrl?: string;
  addedAt: string;
}

const parseStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("cart-storage-updated"));
};

export const readCart = (): CartItem[] => {
  const saved = parseStorage(CART_STORAGE_KEY);
  if (saved.length > 0) {
    return saved;
  }

  const legacy = parseStorage(LEGACY_WATCHLIST_KEY);
  if (legacy.length > 0) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(legacy));
    return legacy;
  }

  return [];
};

export const isInCart = (productId: string) => {
  return readCart().some((item) => item.id === productId);
};

export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  dispatchUpdate();
};

export const addCartItem = (product: Product) => {
  const current = readCart();
  const existing = current.some((item) => item.id === product.id);
  if (existing) {
    return current;
  }

  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    currency: product.currency || "PKR",
    image: product.image,
    platform: product.platform,
    category: product.category,
    brand: product.brand,
    sourceDataset: product.sourceDataset,
    productUrl: product.productUrl,
    addedAt: new Date().toISOString(),
  };

  const updated = [cartItem, ...current];
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  dispatchUpdate();
  return updated;
};

export const removeCartItem = (productId: string) => {
  const updated = readCart().filter((item) => item.id !== productId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  dispatchUpdate();
  return updated;
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  dispatchUpdate();
};
