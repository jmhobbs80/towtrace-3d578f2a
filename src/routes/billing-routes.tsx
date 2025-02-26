
import { ViewInvoices } from "@/pages/billing/ViewInvoices";
import { SubscriptionManagement } from "@/pages/billing/SubscriptionManagement";
import { TransactionHistory } from "@/pages/billing/TransactionHistory";
import { StripeIntegration } from "@/pages/billing/StripeIntegration";
import { QuickbooksSync } from "@/pages/billing/QuickbooksSync";
import { RouteConfig } from "./types";

export const billingRoutes: RouteConfig[] = [
  {
    path: "/billing/invoices",
    element: <ViewInvoices />,
  },
  {
    path: "/billing/subscription",
    element: <SubscriptionManagement />,
  },
  {
    path: "/billing/transactions",
    element: <TransactionHistory />,
  },
  {
    path: "/billing/stripe",
    element: <StripeIntegration />,
  },
  {
    path: "/billing/quickbooks",
    element: <QuickbooksSync />,
  },
];
