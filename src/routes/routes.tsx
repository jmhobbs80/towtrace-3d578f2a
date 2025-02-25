
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
import CustomerPortal from "@/pages/customer/CustomerPortal";
import HelpCenter from "@/pages/help/HelpCenter";
import LegalHub from "@/pages/legal/LegalHub";
import { UserRole } from "@/lib/types/auth";

// Define allowed roles for each protected route
const ROLE_ACCESS = {
  FLEET: ["dispatcher", "admin", "super_admin"] as UserRole[],
  INVENTORY: ["dealer", "wholesaler", "admin", "super_admin"] as UserRole[],
  ANALYTICS: ["admin", "dealer", "wholesaler", "dispatcher", "super_admin"] as UserRole[],
  ADMIN: ["overwatch_admin", "super_admin"] as UserRole[],
  BILLING: ["billing_manager", "admin", "super_admin"] as UserRole[],
  CUSTOMER: ["customer", "admin", "super_admin"] as UserRole[],
} as const;

interface RouteConfig {
  path: string;
  allowedRoles?: UserRole[];
  element: React.ReactNode;
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Protected routes configuration
const protectedRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/fleet",
    allowedRoles: ROLE_ACCESS.FLEET,
    element: <FleetManagement />
  },
  {
    path: "/inventory",
    allowedRoles: ROLE_ACCESS.INVENTORY,
    element: <InventoryManagement />
  },
  {
    path: "/analytics",
    allowedRoles: ROLE_ACCESS.ANALYTICS,
    element: <AnalyticsDashboard />
  },
  {
    path: "/billing",
    allowedRoles: ROLE_ACCESS.BILLING,
    element: <BillingDashboard />
  },
  {
    path: "/settings",
    element: <ProfileSettings />
  },
  {
    path: "/admin",
    allowedRoles: ROLE_ACCESS.ADMIN,
    element: <OverwatchDashboard />
  },
  {
    path: "/customer",
    allowedRoles: ROLE_ACCESS.CUSTOMER,
    element: <CustomerPortal />
  },
  {
    path: "/help",
    element: <HelpCenter />
  },
  {
    path: "/legal",
    element: <LegalHub />
  }
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />
      },
      {
        element: <SidebarLayout />,
        children: protectedRoutes.map(route => ({
          path: route.path,
          element: (
            <ProtectedRoute allowedRoles={route.allowedRoles}>
              {route.element}
            </ProtectedRoute>
          )
        }))
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
