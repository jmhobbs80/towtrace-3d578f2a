
import { RouteObject } from "react-router-dom";
import AuthPage from "@/pages/auth/AuthPage";
import Index from "@/pages/Index";
import BillingDashboard from "@/pages/billing/BillingDashboard";
import DispatchDashboard from "@/pages/dispatch/DispatchDashboard";
import VehicleSearch from "@/pages/inventory/VehicleSearch";
import InspectionTemplates from "@/pages/inventory/InspectionTemplates";
import InspectionDetails from "@/pages/inventory/InspectionDetails";
import InspectionHistoryDashboard from "@/pages/inventory/InspectionHistoryDashboard";
import InventoryManagement from "@/pages/inventory/InventoryManagement";
import VehicleDetails from "@/pages/inventory/VehicleDetails";
import VehiclesInTransit from "@/pages/transport/VehiclesInTransit";
import FleetManagement from "@/pages/fleet/FleetManagement";
import ProfileSettings from "@/pages/profile/ProfileSettings";
import RepairDashboard from "@/pages/repairs/RepairDashboard";
import RepairFacilityManagement from "@/pages/repairs/RepairFacilityManagement";
import CreateRepairOrder from "@/pages/repairs/CreateRepairOrder";
import CustomerPortal from "@/pages/impound/customer/CustomerPortal";
import DealerTrades from "@/pages/dealer/DealerTrades";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";

export const routes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthPage />
  },
  {
    path: "/impound/customer",
    element: <CustomerPortal />
  },
  {
    element: <SidebarLayout />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/billing",
        element: <BillingDashboard />
      },
      {
        path: "/dispatch",
        element: <DispatchDashboard />
      },
      {
        path: "/inventory",
        element: <InventoryManagement />
      },
      {
        path: "/inventory/search",
        element: <VehicleSearch />
      },
      {
        path: "/inventory/vehicle/:id",
        element: <VehicleDetails />
      },
      {
        path: "/inventory/inspections",
        element: <InspectionHistoryDashboard />
      },
      {
        path: "/inventory/inspection/:id",
        element: <InspectionDetails />
      },
      {
        path: "/inventory/templates",
        element: <InspectionTemplates />
      },
      {
        path: "/fleet",
        element: <FleetManagement />
      },
      {
        path: "/transport",
        element: <VehiclesInTransit />
      },
      {
        path: "/profile",
        element: <ProfileSettings />
      },
      {
        path: "/repairs",
        element: <RepairDashboard />
      },
      {
        path: "/repairs/facilities",
        element: <RepairFacilityManagement />
      },
      {
        path: "/repairs/create",
        element: <CreateRepairOrder />
      },
      {
        path: "/dealer/trades",
        element: <DealerTrades />
      }
    ]
  }
];
