
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
import DispatchDashboard from "@/pages/dispatch/DispatchDashboard";
import FleetManagement from "@/pages/fleet/FleetManagement";
import InventoryManagement from "@/pages/inventory/InventoryManagement";
import RepairTracking from "@/pages/repairs/RepairTracking";
import TransportRequests from "@/pages/transport/TransportRequests";
import PreferredTransporters from "@/pages/transport/PreferredTransporters";
import BillingDashboard from "@/pages/billing/BillingDashboard";
import WholesaleVehicles from "@/pages/wholesale/WholesaleVehicles";
import WholesaleAuctions from "@/pages/wholesale/WholesaleAuctions";
import BulkTransport from "@/pages/wholesale/BulkTransport";
import DealerTrades from "@/pages/dealer/DealerTrades";
import { UserRole } from "@/lib/types/auth";

const ROLE_ACCESS = {
  FLEET: ["dispatcher", "admin", "super_admin"] as UserRole[],
  INVENTORY: ["dealer", "wholesaler", "admin", "super_admin"] as UserRole[],
  DEALER: ["dealer", "admin", "super_admin"] as UserRole[],
  WHOLESALER: ["wholesaler", "admin", "super_admin"] as UserRole[],
  TRANSPORT: ["dealer", "wholesaler", "transporter", "admin", "super_admin"] as UserRole[],
  BILLING: ["dealer", "wholesaler", "admin", "super_admin"] as UserRole[],
} as const;

const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const protectedRoutes = [
  {
    path: "/",
    element: <Index />
  },
  // Dealer routes
  {
    path: "/dealer",
    allowedRoles: ROLE_ACCESS.DEALER,
    children: [
      {
        path: "dashboard",
        element: <DealerDashboard />
      },
      {
        path: "inventory",
        element: <InventoryManagement />
      },
      {
        path: "repairs",
        element: <RepairTracking />
      },
      {
        path: "transport-requests",
        element: <TransportRequests />
      },
      {
        path: "preferred-transporters",
        element: <PreferredTransporters />
      },
      {
        path: "billing",
        element: <BillingDashboard />
      },
      {
        path: "trades",
        element: <DealerTrades />
      }
    ]
  },
  // Wholesaler routes
  {
    path: "/wholesale",
    allowedRoles: ROLE_ACCESS.WHOLESALER,
    children: [
      {
        path: "vehicles",
        element: <WholesaleVehicles />
      },
      {
        path: "auctions",
        element: <WholesaleAuctions />
      },
      {
        path: "transport",
        element: <BulkTransport />
      }
    ]
  },
  // Shared routes
  {
    path: "/inventory",
    allowedRoles: ROLE_ACCESS.INVENTORY,
    element: <InventoryManagement />
  },
  {
    path: "/transport",
    allowedRoles: ROLE_ACCESS.TRANSPORT,
    element: <TransportRequests />
  },
  {
    path: "/fleet",
    allowedRoles: ROLE_ACCESS.FLEET,
    element: <FleetManagement />
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
          ),
          children: route.children?.map(child => ({
            path: route.path + "/" + child.path,
            element: (
              <ProtectedRoute allowedRoles={route.allowedRoles}>
                {child.element}
              </ProtectedRoute>
            )
          }))
        }))
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
