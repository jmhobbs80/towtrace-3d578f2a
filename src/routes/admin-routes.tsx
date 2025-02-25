
import OverwatchDashboard from "@/pages/admin/OverwatchDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import SystemLogs from "@/pages/admin/SystemLogs";
import FeatureManagement from "@/pages/admin/FeatureManagement";
import BillingExemptions from "@/pages/admin/BillingExemptions";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin",
    element: <OverwatchDashboard />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/admin/logs",
    element: <SystemLogs />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/admin/feature-toggles",
    element: <FeatureManagement />,
    allowedRoles: ROLE_ACCESS.ADMIN
  },
  {
    path: "/admin/billing-exemptions",
    element: <BillingExemptions />,
    allowedRoles: ROLE_ACCESS.ADMIN
  }
];
