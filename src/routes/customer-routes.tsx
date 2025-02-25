
import RequestTow from "@/pages/public/RequestTow";
import CustomerPortal from "@/pages/customer/CustomerPortal";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const customerRoutes: RouteConfig[] = [
  {
    path: "/customer/book",
    element: <RequestTow />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/customer/portal",
    element: <CustomerPortal />,
    allowedRoles: ROLE_ACCESS.CUSTOMER
  }
];
