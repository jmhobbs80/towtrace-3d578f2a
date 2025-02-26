
import { DashboardOverview } from "@/pages/dashboard/DashboardOverview";
import { CompanySettings } from "@/pages/dashboard/CompanySettings";
import { BillingManagement } from "@/pages/dashboard/BillingManagement";
import { UsersManagement } from "@/pages/dashboard/UsersManagement";
import { NotificationSettings } from "@/pages/dashboard/NotificationSettings";
import { ApiKeysManagement } from "@/pages/dashboard/ApiKeysManagement";
import { RouteConfig } from "./types";

export const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <DashboardOverview />,
  },
  {
    path: "/dashboard/settings",
    element: <CompanySettings />,
  },
  {
    path: "/dashboard/billing",
    element: <BillingManagement />,
  },
  {
    path: "/dashboard/users",
    element: <UsersManagement />,
  },
  {
    path: "/dashboard/notifications",
    element: <NotificationSettings />,
  },
  {
    path: "/dashboard/api-keys",
    element: <ApiKeysManagement />,
  },
];
