
import { UserProfile } from "@/pages/account/UserProfile";
import { ChangePassword } from "@/pages/account/ChangePassword";
import { TwoFactorSettings } from "@/pages/account/TwoFactorSettings";
import { LinkedDevices } from "@/pages/account/LinkedDevices";
import { BillingSettings } from "@/pages/account/BillingSettings";
import { RouteConfig } from "./types";

export const accountRoutes: RouteConfig[] = [
  {
    path: "/account/profile",
    element: <UserProfile />,
  },
  {
    path: "/account/password",
    element: <ChangePassword />,
  },
  {
    path: "/account/2fa",
    element: <TwoFactorSettings />,
  },
  {
    path: "/account/sessions",
    element: <LinkedDevices />,
  },
  {
    path: "/account/billing",
    element: <BillingSettings />,
  },
];
