
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AuthPage from "@/pages/auth/AuthPage";
import Dashboard from "@/pages/dashboard/Dashboard";
import Index from "@/pages/Index";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { AnalyticsDashboard } from "@/pages/analytics/AnalyticsDashboard";
import { DealerDashboard } from "@/pages/dashboard/DealerDashboard";
import { TransporterDashboard } from "@/pages/dashboard/TransporterDashboard";
import FleetManagement from "@/pages/fleet/FleetManagement";
import InventoryManagement from "@/pages/inventory/InventoryManagement";
import BillingDashboard from "@/pages/billing/BillingDashboard";
import ProfileSettings from "@/pages/profile/ProfileSettings";
import OverwatchDashboard from "@/pages/admin/OverwatchDashboard";
import { UserRole } from "@/lib/types/auth";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        element: <SidebarLayout />,
        children: [
          {
            path: "/",
            element: (
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            ),
          },
          {
            path: "/dashboard",
            element: (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "/fleet",
            element: (
              <ProtectedRoute allowedRoles={["dispatcher" as UserRole]}>
                <FleetManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "/inventory",
            element: (
              <ProtectedRoute allowedRoles={["dealer" as UserRole, "wholesaler" as UserRole]}>
                <InventoryManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "/analytics",
            element: (
              <ProtectedRoute allowedRoles={["admin" as UserRole, "dealer" as UserRole, "wholesaler" as UserRole, "dispatcher" as UserRole]}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "/billing",
            element: (
              <ProtectedRoute>
                <BillingDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "/settings",
            element: (
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            ),
          },
          {
            path: "/admin",
            element: (
              <ProtectedRoute allowedRoles={["overwatch_admin" as UserRole]}>
                <OverwatchDashboard />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
