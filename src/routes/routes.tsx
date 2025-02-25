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
import type { UserRole } from "@/lib/types/auth";

// Import newly created components
import ProfileSettings from "@/pages/profile/ProfileSettings";
import NotificationCenter from "@/pages/notifications/NotificationCenter";
import OrganizationDashboard from "@/pages/organization/OrganizationDashboard";
import OverwatchDashboard from "@/pages/admin/OverwatchDashboard";
import JobDetails from "@/pages/job/JobDetails";
import JobReports from "@/pages/reports/JobReports";
import DriverPortal from "@/pages/driver/DriverPortal";
import CustomerPortal from "@/pages/customer/CustomerPortal";
import BookingFlow from "@/pages/customer/BookingFlow";
import PublicJobRequests from "@/pages/public/RequestTow";
import InvoiceList from "@/pages/billing/InvoiceList";
import PayoutManagement from "@/pages/billing/PayoutManagement";
import AIDispatch from "@/pages/ai/AIDispatch";
import AIReports from "@/pages/ai/AIReports";
import ReportBuilder from "@/pages/analytics/ReportBuilder";
import TermsOfService from "@/pages/legal/TermsOfService";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import ComplianceInfo from "@/pages/legal/ComplianceInfo";
import VehicleDetails from "@/pages/fleet/VehicleDetails";

const ROLE_ACCESS = {
  ADMIN: ["admin", "super_admin", "overwatch_admin"] as UserRole[],
  FLEET: ["dispatcher", "admin", "super_admin"] as UserRole[],
  INVENTORY: ["dealer", "wholesaler", "admin", "super_admin"] as UserRole[],
  DEALER: ["dealer", "admin", "super_admin"] as UserRole[],
  WHOLESALER: ["wholesaler", "admin", "super_admin"] as UserRole[],
  TRANSPORT: ["dealer", "wholesaler", "transporter", "admin", "super_admin"] as UserRole[],
  BILLING: ["dealer", "wholesaler", "admin", "super_admin"] as UserRole[],
  DRIVER: ["driver", "admin", "super_admin"] as UserRole[],
  DISPATCH: ["dispatcher", "admin", "super_admin"] as UserRole[],
  ANALYTICS: ["dealer", "wholesaler", "dispatcher", "admin", "super_admin"] as UserRole[],
  PUBLIC: [] as UserRole[] // Empty array means public access
} as const;

const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/analytics",
    element: <AnalyticsDashboard />,
    allowedRoles: ROLE_ACCESS.ANALYTICS
  },
  {
    path: "/fleet",
    element: <FleetManagement />,
    allowedRoles: ROLE_ACCESS.FLEET
  },
  {
    path: "/inventory",
    element: <InventoryManagement />,
    allowedRoles: ROLE_ACCESS.INVENTORY
  },
  {
    path: "/repairs",
    element: <RepairTracking />,
    allowedRoles: ROLE_ACCESS.INVENTORY
  },
  {
    path: "/transport",
    element: <TransportRequests />,
    allowedRoles: ROLE_ACCESS.TRANSPORT
  },
  {
    path: "/preferred",
    element: <PreferredTransporters />,
    allowedRoles: ROLE_ACCESS.TRANSPORT
  },
  {
    path: "/billing",
    element: <BillingDashboard />,
    allowedRoles: ROLE_ACCESS.BILLING
  },
  {
    path: "/dealer",
    element: <DealerDashboard />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/wholesale",
    element: <WholesaleVehicles />,
    allowedRoles: ROLE_ACCESS.WHOLESALER
  },
  {
    path: "/dispatch",
    element: <DispatchDashboard />,
    allowedRoles: ROLE_ACCESS.DISPATCH
  },
  {
    path: "/dealer-trades",
    element: <DealerTrades />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/public",
    element: <PublicJobRequests />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/profile",
    element: <ProfileSettings />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/notifications",
    element: <NotificationCenter />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/organization",
    element: <OrganizationDashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/overwatch",
    element: <OverwatchDashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/job-details",
    element: <JobDetails />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/job-reports",
    element: <JobReports />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/driver-portal",
    element: <DriverPortal />,
    allowedRoles: ROLE_ACCESS.DRIVER
  },
  {
    path: "/customer-portal",
    element: <CustomerPortal />,
    allowedRoles: ROLE_ACCESS.CUSTOMER
  },
  {
    path: "/booking-flow",
    element: <BookingFlow />,
    allowedRoles: ROLE_ACCESS.CUSTOMER
  },
  {
    path: "/invoice-list",
    element: <InvoiceList />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/payout-management",
    element: <PayoutManagement />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/aidispatch",
    element: <AIDispatch />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/ai-reports",
    element: <AIReports />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/report-builder",
    element: <ReportBuilder />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/compliance-info",
    element: <ComplianceInfo />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/vehicle-details",
    element: <VehicleDetails />,
    allowedRoles: ROLE_ACCESS.ADMIN
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
