
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
  PUBLIC: [] as UserRole[], // Empty array means public access
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
  // Profile & Organization Routes
  {
    path: "/profile/:userId",
    element: <ProfileSettings />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/notifications",
    element: <NotificationCenter />,
    allowedRoles: Object.values(ROLE_ACCESS).flat()
  },
  {
    path: "/organization",
    element: <OrganizationDashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  // Admin Routes
  {
    path: "/admin",
    element: <OverwatchDashboard />,
    allowedRoles: ["overwatch_admin", "super_admin"]
  },
  // Dispatch & Job Management
  {
    path: "/dispatch",
    element: <DispatchDashboard />,
    allowedRoles: ROLE_ACCESS.DISPATCH
  },
  {
    path: "/job/:jobId",
    element: <JobDetails />,
    allowedRoles: ROLE_ACCESS.TRANSPORT
  },
  {
    path: "/reports/jobs",
    element: <JobReports />,
    allowedRoles: ROLE_ACCESS.ANALYTICS
  },
  // Driver Routes
  {
    path: "/driver",
    element: <DriverPortal />,
    allowedRoles: ROLE_ACCESS.DRIVER
  },
  // Fleet Routes
  {
    path: "/fleet",
    element: <FleetManagement />,
    allowedRoles: ROLE_ACCESS.FLEET
  },
  {
    path: "/fleet/:vehicleId",
    element: <VehicleDetails />,
    allowedRoles: ROLE_ACCESS.FLEET
  },
  // Customer Routes
  {
    path: "/customer",
    element: <CustomerPortal />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/customer/book",
    element: <BookingFlow />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/public/jobs",
    element: <PublicJobRequests />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  // Dealer Routes
  {
    path: "/dealer",
    allowedRoles: ROLE_ACCESS.DEALER,
    children: [
      { path: "dashboard", element: <DealerDashboard /> },
      { path: "inventory", element: <InventoryManagement /> },
      { path: "repairs", element: <RepairTracking /> },
      { path: "transport-requests", element: <TransportRequests /> },
      { path: "preferred-transporters", element: <PreferredTransporters /> },
      { path: "billing", element: <BillingDashboard /> },
      { path: "trades", element: <DealerTrades /> }
    ]
  },
  // Wholesaler Routes
  {
    path: "/wholesale",
    allowedRoles: ROLE_ACCESS.WHOLESALER,
    children: [
      { path: "vehicles", element: <WholesaleVehicles /> },
      { path: "auctions", element: <WholesaleAuctions /> },
      { path: "transport", element: <BulkTransport /> }
    ]
  },
  // Billing Routes
  {
    path: "/billing",
    allowedRoles: ROLE_ACCESS.BILLING,
    children: [
      { path: "/", element: <BillingDashboard /> },
      { path: "invoices", element: <InvoiceList /> },
      { path: "payouts", element: <PayoutManagement /> }
    ]
  },
  // AI & Analytics Routes
  {
    path: "/ai",
    allowedRoles: ROLE_ACCESS.ADMIN,
    children: [
      { path: "dispatch", element: <AIDispatch /> },
      { path: "reports", element: <AIReports /> }
    ]
  },
  {
    path: "/analytics",
    allowedRoles: ROLE_ACCESS.ANALYTICS,
    children: [
      { path: "/", element: <AnalyticsDashboard /> },
      { path: "reports", element: <ReportBuilder /> }
    ]
  },
  // Legal Routes
  {
    path: "/legal",
    allowedRoles: ROLE_ACCESS.PUBLIC,
    children: [
      { path: "terms", element: <TermsOfService /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "compliance", element: <ComplianceInfo /> }
    ]
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
