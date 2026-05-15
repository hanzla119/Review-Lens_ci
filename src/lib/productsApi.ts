import type { Product } from "@/data/mockData";

export interface ProductsResponse {
  products: Product[];
  source: string;
  total: number;
  warning?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const productsApi = {
  list: async (limit = 24): Promise<ProductsResponse> => {
    const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`, {
      headers: { Accept: "application/json" },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Unable to load dataset products.");
    }

    return data as ProductsResponse;
  },
};
