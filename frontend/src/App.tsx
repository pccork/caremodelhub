import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboards";
import NewCalculation from "./pages/NewCalculation";
import AdminDashboard from "./pages/AdminDashboard";
import AuditLog from "./pages/AuditLog";
import Disclaimer from "./pages/Disclaimer";
import { RequireAuth, RequireRole, RequireDisclaimer } from "./auth/Guards";
import ModelSelect from "./pages/ModelsSelect";

// routes for frontend
export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/models" replace />} />

        <Route path="/login" element={<Login />} />

        {/* Mandatory disclaimer after login */}
        <Route
          path="/disclaimer"
          element={
            <RequireAuth>
              <Disclaimer />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <RequireDisclaimer>
                <Dashboard />
              </RequireDisclaimer>
            </RequireAuth>
          }
        />

        <Route
          path="/models"
          element={
            <RequireAuth>
              <ModelSelect />
            </RequireAuth>
          }
        />  

         {/* KFRE calculation (user only) */}
        <Route
          path="/new"
          element={
            <RequireRole allow={["user"]}>
              <RequireDisclaimer>
                <NewCalculation />
              </RequireDisclaimer>
            </RequireRole>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireRole allow={["admin"]}>
              <RequireDisclaimer>
                <AdminDashboard />
              </RequireDisclaimer>
            </RequireRole>
          }
        />

        <Route
          path="/audit"
          element={
            <RequireRole allow={["admin", "scientist"]}>
              <RequireDisclaimer>
                <AuditLog />
              </RequireDisclaimer>
            </RequireRole>
          }
        />
      </Routes>
    </>
  );
}
