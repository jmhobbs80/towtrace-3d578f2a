
import { CustomerDashboard } from "@/pages/customer/CustomerDashboard";
import { ImpoundStatus } from "@/pages/customer/ImpoundStatus";
import { RequestTow } from "@/pages/customer/RequestTow";
import { TowTracking } from "@/pages/customer/TowTracking";
import { PaymentPortal } from "@/pages/customer/PaymentPortal";
import { PaymentHistory } from "@/pages/customer/PaymentHistory";
import { CustomerSupport } from "@/pages/customer/CustomerSupport";
import { RouteConfig } from "./types";

export const customerRoutes: RouteConfig[] = [
  {
    path: "/portal/dashboard",
    element: <CustomerDashboard />,
  },
  {
    path: "/portal/impound-status",
    element: <ImpoundStatus />,
  },
  {
    path: "/portal/request-tow",
    element: <RequestTow />,
  },
  {
    path: "/portal/track-tow",
    element: <TowTracking />,
  },
  {
    path: "/portal/pay-impound-fee",
    element: <PaymentPortal />,
  },
  {
    path: "/portal/payment-history",
    element: <PaymentHistory />,
  },
  {
    path: "/portal/support",
    element: <CustomerSupport />,
  }
];
