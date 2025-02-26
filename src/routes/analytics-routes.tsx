
import { AnalyticsDashboard } from "@/pages/analytics/AnalyticsDashboard";
import { TowHistory } from "@/pages/analytics/TowHistory";
import { DriverPerformance } from "@/pages/analytics/DriverPerformance";
import { FleetEfficiency } from "@/pages/analytics/FleetEfficiency";
import { RevenueReports } from "@/pages/analytics/RevenueReports";
import { ImpoundTrends } from "@/pages/analytics/ImpoundTrends";
import { RouteConfig } from "./types";

export const analyticsRoutes: RouteConfig[] = [
  {
    path: "/analytics",
    element: <AnalyticsDashboard />,
  },
  {
    path: "/analytics/tow-history",
    element: <TowHistory />,
  },
  {
    path: "/analytics/driver-performance",
    element: <DriverPerformance />,
  },
  {
    path: "/analytics/fleet-efficiency",
    element: <FleetEfficiency />,
  },
  {
    path: "/analytics/revenue",
    element: <RevenueReports />,
  },
  {
    path: "/analytics/impound-trends",
    element: <ImpoundTrends />,
  },
];
