import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, authStorage, AuthUser } from "@/lib/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthUser>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
  }) => Promise<AuthUser>;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      if (!authStorage.getToken()) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
      } catch {
        authStorage.clearToken();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    hydrateSession();
  }, []);

  const persistAuth = useCallback((token: string, nextUser: AuthUser) => {
    authStorage.setToken(token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login: async (payload) => {
        const response = await authApi.login(payload);
        return persistAuth(response.token, response.user);
      },
      signup: async (payload) => {
        const response = await authApi.signup(payload);
        return persistAuth(response.token, response.user);
      },
      loginWithGoogle: async (credential) => {
        const response = await authApi.googleLogin(credential);
        return persistAuth(response.token, response.user);
      },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          authStorage.clearToken();
          setUser(null);
        }
      },
    }),
    [isInitializing, persistAuth, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
