
import { lazy } from "react";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

const OverwatchDashboard = lazy(() => import("@/pages/admin/OverwatchDashboard"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const SystemLogs = lazy(() => import("@/pages/admin/SystemLogs"));
const FeatureManagement = lazy(() => import("@/pages/admin/FeatureManagement"));
const BillingExemptions = lazy(() => import("@/pages/admin/BillingExemptions"));

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
