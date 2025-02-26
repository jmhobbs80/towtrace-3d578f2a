
import { InventoryOverview } from "@/pages/inventory/InventoryOverview";
import { AddVehicle } from "@/pages/inventory/AddVehicle";
import { VinScanning } from "@/pages/inventory/VinScanning";
import { AuctionListings } from "@/pages/inventory/AuctionListings";
import { DealerTrades } from "@/pages/inventory/DealerTrades";
import { VehicleReports } from "@/pages/inventory/VehicleReports";
import { RouteConfig } from "./types";

export const inventoryRoutes: RouteConfig[] = [
  {
    path: "/inventory",
    element: <InventoryOverview />,
  },
  {
    path: "/inventory/add",
    element: <AddVehicle />,
  },
  {
    path: "/inventory/vin-scan",
    element: <VinScanning />,
  },
  {
    path: "/inventory/auctions",
    element: <AuctionListings />,
  },
  {
    path: "/inventory/trades",
    element: <DealerTrades />,
  },
  {
    path: "/inventory/reports",
    element: <VehicleReports />,
  },
];
