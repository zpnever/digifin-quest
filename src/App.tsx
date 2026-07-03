import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";

// Student pages
import Dashboard from "./pages/student/Dashboard";
import Modules from "./pages/student/Modules";
import ModuleDetail from "./pages/student/ModuleDetail";
import ScenarioGame from "./pages/student/ScenarioGame";
import FinalSimulation from "./pages/student/FinalSimulation";
import Leaderboard from "./pages/student/Leaderboard";
import Badges from "./pages/student/Badges";
import Analytics from "./pages/student/Analytics";
import Profile from "./pages/student/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModuleManager from "./pages/admin/ModuleManager";
import UserManager from "./pages/admin/UserManager";

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "var(--toast-bg, #333)",
            color: "var(--toast-color, #fff)",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<AuthRedirect><Landing /></AuthRedirect>} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
        <Route path="/register/admin" element={<AuthRedirect><RegisterAdmin /></AuthRedirect>} />

        {/* Student */}
        <Route element={<ProtectedRoute role="STUDENT"><StudentLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/game" element={<ScenarioGame />} />
          <Route path="/simulation" element={<FinalSimulation />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/modules" element={<ModuleManager />} />
          <Route path="/admin/users" element={<UserManager />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
