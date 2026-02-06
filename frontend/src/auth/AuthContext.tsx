// Add AuthContext with logoin, logout, retore session, /api/me
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";

export type Role = "user" | "scientist" | "admin";

type AuthState = {
  token: string | null;
  role: Role | null;
  userId: string | null;
  disclaimerAccepted: boolean;
  ready: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  acceptDisclaimer: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);



export function AuthProvider({ children }: { children: React.ReactNode }) {

  // --- persisted auth state ----
  const [token, setToken] = useState<string | null>(localStorage.getItem("cmh_token"));
  const [role, setRole] = useState<Role | null>(localStorage.getItem("cmh_role") as Role | null);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("cmh_userId"));
  // ---Add disclaimer acknowledgement ----
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(
  localStorage.getItem("cmh_disclaimer") === "true"
  );
  // --- app ready flag ---
  const [ready, setReady] = useState(false);

  // Restore session by calling /api/me (proves token is valid + returns role/userId)
  useEffect(() => {
    const restore = async () => {
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const res = await api.get("/api/me");
        setUserId(res.data.userId);
        setRole(res.data.role);
        localStorage.setItem("cmh_userId", res.data.userId);
        localStorage.setItem("cmh_role", res.data.role);
      } catch {
        // Token invalid/expired -> clear
        localStorage.removeItem("cmh_token");
        localStorage.removeItem("cmh_role");
        localStorage.removeItem("cmh_userId");
        setToken(null);
        setRole(null);
        setUserId(null);
      } finally {
        setReady(true);
      }
    };
    restore();
  }, [token]);

  // --- Login ---

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/users/login", { email, password });
    const t = res.data.token as string;
    const r = res.data.role as Role;

    localStorage.setItem("cmh_token", t);
    localStorage.setItem("cmh_role", r);

    setToken(t);
    setRole(r);

    // Immediately resolve identity from backend
    const me = await api.get("/api/me");
    setUserId(me.data.userId);
    localStorage.setItem("cmh_userId", me.data.userId);

    // Force disclaimer each new login
    localStorage.removeItem("cmh_disclaimer");
    setDisclaimerAccepted(false);
  };

  /* ===============================
     Accept disclaimer
     =============================== */
  const acceptDisclaimer = () => {
    localStorage.setItem("cmh_disclaimer", "true");
    setDisclaimerAccepted(true);
  };

  const logout = () => {
    localStorage.removeItem("cmh_token");
    localStorage.removeItem("cmh_role");
    localStorage.removeItem("cmh_userId");
    localStorage.removeItem("cmh_disclaimer");
    setToken(null);
    setRole(null);
    setUserId(null);
    setDisclaimerAccepted(false);
  };
  // -- memorised context value
  const value = useMemo(
    () => ({ token, role, userId, disclaimerAccepted, ready, login, logout, acceptDisclaimer }),
    [token, role, userId, disclaimerAccepted, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// -- Hook --//
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
