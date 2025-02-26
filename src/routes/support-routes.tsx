
import SupportDashboard from "@/pages/support/SupportDashboard";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const supportRoutes: RouteConfig[] = [
  {
    path: "/support",
    element: <SupportDashboard />,
    allowedRoles: ROLE_ACCESS.SUPPORT
  }
];
