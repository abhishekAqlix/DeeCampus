import { ApiUser, authMeRequest, loginRequest, logoutRequest } from "@/api/school-api";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthState = {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (u: ApiUser): ApiUser => ({
    ...u,
    id: u.id ?? (u._id != null ? String(u._id) : undefined),
  });

  const refreshUser = useCallback(async () => {
    try {
      const { user: raw } = await authMeRequest();
      setUser(normalizeUser(raw));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { user: raw } = await loginRequest(email, password);
    setUser(normalizeUser(raw));
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
