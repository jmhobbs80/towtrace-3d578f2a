
import AnalyticsDashboard from "@/pages/analytics/AnalyticsDashboard";
import AIReports from "@/pages/ai/AIReports";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const analyticsRoutes: RouteConfig[] = [
  {
    path: "/analytics",
    element: <AnalyticsDashboard />,
    allowedRoles: ROLE_ACCESS.ANALYTICS
  },
  {
    path: "/analytics/ai",
    element: <AIReports />,
    allowedRoles: ROLE_ACCESS.ANALYTICS
  }
];
