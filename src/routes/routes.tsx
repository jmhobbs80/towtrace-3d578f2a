
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { authRoutes } from "./auth-routes";
import { adminRoutes } from "./admin-routes";
import { dealerRoutes } from "./dealer-routes";
import { fleetRoutes } from "./fleet-routes";
import { dispatchRoutes } from "./dispatch-routes";
import { customerRoutes } from "./customer-routes";
import { billingRoutes } from "./billing-routes";
import { analyticsRoutes } from "./analytics-routes";
import { legalRoutes } from "./legal-routes";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import { UserRole } from "@/lib/types/auth";

const protectedRoutes = [
  {
    path: "/",
    element: <Dashboard />,
    allowedRoles: ["admin", "dealer", "dispatcher", "wholesaler"] as UserRole[]
  },
  ...adminRoutes,
  ...dealerRoutes,
  ...fleetRoutes,
  ...dispatchRoutes,
  ...customerRoutes,
  ...billingRoutes,
  ...analyticsRoutes,
];

const publicRoutes = [
  ...legalRoutes,
];

const AppLayout = () => (
  <AuthProvider>
    <Outlet />
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
              {route.element}
            </ProtectedRoute>
          )
        }))
      },
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
