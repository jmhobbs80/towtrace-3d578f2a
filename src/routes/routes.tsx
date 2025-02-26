
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import NotFound from "@/pages/NotFound";
import { authRoutes } from "./auth-routes";
import { adminRoutes } from "./admin-routes";
import { dealerRoutes } from "./dealer-routes";
import { fleetRoutes } from "./fleet-routes";
import { dispatchRoutes } from "./dispatch-routes";
import { customerRoutes } from "./customer-routes";
import { billingRoutes } from "./billing-routes";
import { analyticsRoutes } from "./analytics-routes";
import { legalRoutes } from "./legal-routes";
import { auctionRoutes } from "./auction-routes";
import { supportRoutes } from "./support-routes";
import { wholesalerRoutes } from "./wholesaler-routes";
import { UserRole } from "@/lib/types/auth";

// Lazy load the Dashboard component
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const CustomerPortal = lazy(() => import("@/pages/impound/customer/CustomerPortal"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const protectedRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Dashboard />
      </Suspense>
    ),
    allowedRoles: ["admin", "dealer", "dispatcher", "wholesaler", "transporter", "provider", "support_agent", "billing_manager"] as UserRole[]
  },
  ...adminRoutes,
  ...dealerRoutes,
  ...fleetRoutes,
  ...dispatchRoutes,
  ...customerRoutes,
  ...billingRoutes,
  ...analyticsRoutes,
  ...auctionRoutes,
  ...wholesalerRoutes,
  ...supportRoutes
];

const publicRoutes = [
  ...legalRoutes,
  {
    path: "/customer/book",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CustomerPortal />
      </Suspense>
    ),
  }
];

const AppLayout = () => (
  <AuthProvider>
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/auth" replace />,
      },
      ...authRoutes,
      ...publicRoutes,
      {
        element: <SidebarLayout />,
        children: protectedRoutes.map(route => ({
          path: route.path,
          element: (
            <ProtectedRoute allowedRoles={route.allowedRoles}>
              <Suspense fallback={<LoadingFallback />}>
                {route.element}
              </Suspense>
            </ProtectedRoute>
          )
        }))
      },
      // Authentication redirects
      {
        path: "/login",
        element: <Navigate to="/auth" replace />,
      },
      {
        path: "/signup",
        element: <Navigate to="/auth?signup=true" replace />,
      },
      {
        path: "/forgot-password",
        element: <Navigate to="/auth?type=recovery" replace />,
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);
