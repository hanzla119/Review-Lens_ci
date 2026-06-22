import { authStorage } from "@/lib/authApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = authStorage.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data as T;
};

export interface ChatHistoryItem {
  _id: string;
  role: "user" | "assistant";
  content: string;
  products?: unknown[]; // Changed from any[] to unknown[]
  createdAt: string;
}

export const chatApi = {
  getHistory: () => request<{ history: ChatHistoryItem[] }>("/chatbot/history"),
  sendMessage: (message: string) =>
    request<{ message: { _id: string; role: "user" | "assistant"; content: string; products?: unknown[]; createdAt: string } }>(
      "/chatbot",
      {
        method: "POST",
        body: JSON.stringify({ message }),
      }
    ),
};
