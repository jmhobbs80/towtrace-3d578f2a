
import DealerTrades from "@/pages/dealer/DealerTrades";
import InventoryManagement from "@/pages/inventory/InventoryManagement";
import VehicleDetails from "@/pages/inventory/VehicleDetails";
import VehicleSearch from "@/pages/inventory/VehicleSearch";
import InspectionTemplates from "@/pages/inventory/InspectionTemplates";
import InspectionDetails from "@/pages/inventory/InspectionDetails";
import RepairDashboard from "@/pages/repairs/RepairDashboard";
import CreateRepairOrder from "@/pages/repairs/CreateRepairOrder";
import RepairTracking from "@/pages/repairs/RepairTracking";
import RepairFacilityManagement from "@/pages/repairs/RepairFacilityManagement";
import TransportRequests from "@/pages/transport/TransportRequests";
import PreferredTransporters from "@/pages/transport/PreferredTransporters";
import LoadBoard from "@/pages/transport/LoadBoard";
import VehiclesInTransit from "@/pages/transport/VehiclesInTransit";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const dealerRoutes: RouteConfig[] = [
  // Inventory Management
  {
    path: "/dealer/inventory",
    element: <InventoryManagement />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory/search",
    element: <VehicleSearch />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory/:vehicleId",
    element: <VehicleDetails />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  // Inspections
  {
    path: "/dealer/inspections/templates",
    element: <InspectionTemplates />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inspections/:inspectionId",
    element: <InspectionDetails />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  // Repairs
  {
    path: "/dealer/repairs",
    element: <RepairDashboard />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs/new",
    element: <CreateRepairOrder />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs/tracking",
    element: <RepairTracking />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs/facilities",
    element: <RepairFacilityManagement />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  // Transport
  {
    path: "/dealer/transport",
    element: <TransportRequests />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/transport/preferred",
    element: <PreferredTransporters />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/transport/load-board",
    element: <LoadBoard />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/transport/in-transit",
    element: <VehiclesInTransit />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  // Trades
  {
    path: "/dealer/trades",
    element: <DealerTrades />,
    allowedRoles: ROLE_ACCESS.DEALER
  }
];
