
import { DealerDashboard } from "@/pages/dashboard/DealerDashboard";
import InventoryManagement from "@/pages/inventory/InventoryManagement";
import WholesaleAuctions from "@/pages/wholesale/WholesaleAuctions";
import RepairTracking from "@/pages/repairs/RepairTracking";
import TransportRequests from "@/pages/transport/TransportRequests";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const dealerRoutes: RouteConfig[] = [
  {
    path: "/dealer/dashboard",
    element: <DealerDashboard />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/inventory",
    element: <InventoryManagement />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/auctions",
    element: <WholesaleAuctions />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/repairs",
    element: <RepairTracking />,
    allowedRoles: ROLE_ACCESS.DEALER
  },
  {
    path: "/dealer/transport",
    element: <TransportRequests />,
    allowedRoles: ROLE_ACCESS.DEALER
  }
];
