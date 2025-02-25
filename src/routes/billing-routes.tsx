
import BillingDashboard from "@/pages/billing/BillingDashboard";
import InvoiceList from "@/pages/billing/InvoiceList";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const billingRoutes: RouteConfig[] = [
  {
    path: "/billing",
    element: <BillingDashboard />,
    allowedRoles: ROLE_ACCESS.BILLING
  },
  {
    path: "/billing/invoices",
    element: <InvoiceList />,
    allowedRoles: ROLE_ACCESS.BILLING
  }
];
