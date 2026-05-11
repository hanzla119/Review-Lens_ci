export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "local" | "google";
  isVerified: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface OtpResponse {
  message: string;
  developmentOtp?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_STORAGE_KEY = "review_lens_token";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

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

export const authApi = {
  sendOtp: (email: string) =>
    request<OtpResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, purpose: "signup" }),
    }),

  verifyOtp: (email: string, otp: string) =>
    request<{ message: string }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp, purpose: "signup" }),
    }),

  signup: (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
  }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  googleLogin: (credential: string) =>
    request<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () => request<{ user: AuthUser }>("/auth/me"),
};
