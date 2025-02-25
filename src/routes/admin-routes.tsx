
import Dashboard from "@/pages/dashboard/Dashboard";
import OverwatchDashboard from "@/pages/admin/OverwatchDashboard";
import OrganizationDashboard from "@/pages/organization/OrganizationDashboard";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const adminRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/admin",
    element: <OverwatchDashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/organization",
    element: <OrganizationDashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  }
];
