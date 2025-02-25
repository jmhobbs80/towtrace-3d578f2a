
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
import Index from "@/pages/Index";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";
import CustomerPortal from "@/pages/customer/CustomerPortal";
import { UserRole } from "@/lib/types/auth";

const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowedRoles: ["admin", "dealer", "dispatcher", "wholesaler", "transporter", "driver"] as UserRole[]
  },
  ...adminRoutes,    // Admin dashboard, user management, system logs
  ...dealerRoutes,   // Inventory, repairs, transport requests
  ...fleetRoutes,    // Vehicle management, driver assignments
  ...dispatchRoutes, // Job dispatch, route optimization
  ...customerRoutes, // Customer portal, service requests
  ...billingRoutes,  // Invoices, payments, billing dashboard
  ...analyticsRoutes, // Performance metrics, reports
  {
    path: "/settings",
    element: <ProfileSettings />,
    allowedRoles: ["admin", "dealer", "dispatcher", "wholesaler", "transporter", "driver"] as UserRole[]
  },
  {
    path: "/organization",
    element: <OrganizationDashboard />,
    allowedRoles: ["admin", "dealer"] as UserRole[]
  },
  {
    path: "/job/:jobId",
    element: <JobDetails />,
    allowedRoles: ["admin", "dealer", "dispatcher", "transporter", "driver"] as UserRole[]
  },
  {
    path: "/impound",
    element: <ImpoundDashboard />,
    allowedRoles: ["admin", "dealer"] as UserRole[]
  },
  {
    path: "/driver-portal",
    element: <DriverPortal />,
    allowedRoles: ["driver"] as UserRole[]
  },
  {
    path: "/help",
    element: <HelpCenter />,
    allowedRoles: ["admin", "dealer", "dispatcher", "wholesaler", "transporter", "driver"] as UserRole[]
  }
];

const publicRoutes = [
  ...legalRoutes,    // Terms, privacy policy, compliance
  {
    path: "/customer/book",
    element: <CustomerPortal />,
  },
  {
    path: "/",
    element: <Index />
  }
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

// Import statements for additional components
import ProfileSettings from "@/pages/profile/ProfileSettings";
import OrganizationDashboard from "@/pages/organization/OrganizationDashboard";
import JobDetails from "@/pages/job/JobDetails";
import ImpoundDashboard from "@/pages/impound/ImpoundDashboard";
import DriverPortal from "@/pages/driver/DriverPortal";
import HelpCenter from "@/pages/help/HelpCenter";
