
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
import AIDispatch from "@/pages/ai/AIDis