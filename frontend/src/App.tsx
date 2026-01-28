import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboards";
import NewCalculation from "./pages/NewCalculation";
import AdminDashboard from "./pages/AdminDashboard";
import AuditLog from "./pages/AuditLog";
import { RequireAuth, RequireRole } from "./auth/Guards";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/new"
          element={
            <RequireRole allow={["user"]}>
              <NewCalculation />
            </RequireRole>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireRole allow={["admin"]}>
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/audit"
          element={
            <RequireRole allow={["admin", "scientist"]}>
              <AuditLog />
            </RequireRole>
          }
        />
      </Routes>
    </>
  );
}
