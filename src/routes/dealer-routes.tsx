
import InventoryManagement from "@/pages/inventory/InventoryManagement";
import VehicleDetails from "@/pages/fleet/VehicleDetails";
import InspectionHistoryDashboard from "@/pages/inventory/InspectionHistoryDashboard";
import VehicleInspectionDetails from "@/pages/inventory/InspectionDetails";
import InspectionTemplates from "@/pages/inventory/InspectionTemplates";
import RepairTracking from "@/pages/repairs/RepairTracking";
import CreateRepairOrder from "@/pages/repairs/CreateRepairOrder";
import RepairDashboard from "@/pages/repairs/RepairDashboard";
import RepairFacilityManagement from "@/pages/repairs/RepairFacilityManagement";
import TransportRequests from "@/pages/transport/TransportRequests";
import VehiclesInTransit from "@/pages/transport/VehiclesInTransit";
import PreferredTransporters from "@/pages/transport/PreferredTransporters";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const dealerRoutes: RouteConfig[] = [
  {
    path: "/dealer/inventory",
    element: <InventoryManagement />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory/:vehicleId",
    element: <VehicleDetails />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory/inspections",
    element: <InspectionHistoryDashboard />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory/inspections/:inspectionId",
    element: <VehicleInspectionDetails />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory/templates",
    element: <InspectionTemplates />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs",
    element: <RepairTracking />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs/create",
    element: <CreateRepairOrder />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs/dashboard",
    element: <RepairDashboard />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs/facilities",
    element: <RepairFacilityManagement />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/transport-requests",
    element: <TransportRequests />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/vehicles-in-transit",
    element: <VehiclesInTransit />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/preferred-transporters",
    element: <PreferredTransporters />,
    allowedRoles: ROLE_ACCESS.DEALER
  }
];
