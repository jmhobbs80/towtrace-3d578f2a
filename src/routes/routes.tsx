
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthPage from "@/pages/auth/AuthPage";
import Dashboard from "@/pages/dashboard/Dashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
