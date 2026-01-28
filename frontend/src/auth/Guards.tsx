// Link
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, Role } from "./AuthContext";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, ready } = useAuth();
  if (!ready) return null; // or a spinner
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { token, role, ready } = useAuth();
  if (!ready) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (!role || !allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
