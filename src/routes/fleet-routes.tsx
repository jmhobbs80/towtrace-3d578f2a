
import FleetDashboard from "@/pages/fleet/FleetDashboard";
import VehicleDetails from "@/pages/fleet/VehicleDetails";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const fleetRoutes: RouteConfig[] = [
  {
    path: "/fleet",
    element: <FleetDashboard />,
    allowedRoles: ROLE_ACCESS.FLEET
  },
  {
    path: "/fleet/:vehicleId",
    element: <VehicleDetails />,
    allowedRoles: ROLE_ACCESS.FLEET
  }
];
