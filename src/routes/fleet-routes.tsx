
import { FleetOverview } from "@/pages/fleet/FleetOverview";
import { VehiclesList } from "@/pages/fleet/VehiclesList";
import { AssignVehicle } from "@/pages/fleet/AssignVehicle";
import { VehicleInspections } from "@/pages/fleet/VehicleInspections";
import { MaintenanceScheduling } from "@/pages/fleet/MaintenanceScheduling";
import { ExpenseTracking } from "@/pages/fleet/ExpenseTracking";
import { GpsHistory } from "@/pages/fleet/GpsHistory";
import { RouteConfig } from "./types";

export const fleetRoutes: RouteConfig[] = [
  {
    path: "/fleet",
    element: <FleetOverview />,
  },
  {
    path: "/fleet/vehicles",
    element: <VehiclesList />,
  },
  {
    path: "/fleet/assign-vehicle",
    element: <AssignVehicle />,
  },
  {
    path: "/fleet/inspections",
    element: <VehicleInspections />,
  },
  {
    path: "/fleet/maintenance",
    element: <MaintenanceScheduling />,
  },
  {
    path: "/fleet/expenses",
    element: <ExpenseTracking />,
  },
  {
    path: "/fleet/gps-history",
    element: <GpsHistory />,
  },
];
