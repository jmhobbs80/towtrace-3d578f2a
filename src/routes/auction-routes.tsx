
import AuctionsDashboard from "@/pages/auctions/AuctionsPage";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const auctionRoutes: RouteConfig[] = [
  {
    path: "/auctions",
    element: <AuctionsDashboard />,
    allowedRoles: ROLE_ACCESS.DEALER
  }
];
