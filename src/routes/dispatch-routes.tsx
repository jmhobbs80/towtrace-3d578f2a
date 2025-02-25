
import DispatchDashboard from "@/pages/dispatch/DispatchDashboard";
import AIDispatch from "@/pages/ai/AIDispatch";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const dispatchRoutes: RouteConfig[] = [
  {
    path: "/dispatch",
    element: <DispatchDashboard />,
    allowedRoles: ROLE_ACCESS.DISPATCH
  },
  {
    path: "/dispatch/ai",
    element: <AIDispatch />,
    allowedRoles: ROLE_ACCESS.DISPATCH
  }
];
