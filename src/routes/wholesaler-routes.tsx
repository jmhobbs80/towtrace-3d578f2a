
import WholesaleDashboard from "@/pages/wholesale/WholesaleAuctions";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const wholesalerRoutes: RouteConfig[] = [
  {
    path: "/wholesale",
    element: <WholesaleDashboard />,
    allowedRoles: ROLE_ACCESS.WHOLESALER
  }
];
