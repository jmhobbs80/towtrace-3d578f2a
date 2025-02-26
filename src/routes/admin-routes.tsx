
import { SystemOverview } from "@/pages/admin/SystemOverview";
import { ManageUsers } from "@/pages/admin/ManageUsers";
import { RevenueOverview } from "@/pages/admin/RevenueOverview";
import { SecurityLogs } from "@/pages/admin/SecurityLogs";
import { FeatureFlags } from "@/pages/admin/FeatureFlags";
import { WebhookIntegrations } from "@/pages/admin/WebhookIntegrations";
import { AuditReports } from "@/pages/admin/AuditReports";
import { RouteConfig } from "./types";

export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin",
    element: <SystemOverview />,
  },
  {
    path: "/admin/users",
    element: <ManageUsers />,
  },
  {
    path: "/admin/revenue",
    element: <RevenueOverview />,
  },
  {
    path: "/admin/logs",
    element: <SecurityLogs />,
  },
  {
    path: "/admin/settings",
    element: <FeatureFlags />,
  },
  {
    path: "/admin/webhooks",
    element: <WebhookIntegrations />,
  },
  {
    path: "/admin/compliance",
    element: <AuditReports />,
  },
];
