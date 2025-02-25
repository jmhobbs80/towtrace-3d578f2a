
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import TermsOfService from "@/pages/legal/TermsOfService";
import ComplianceInfo from "@/pages/legal/ComplianceInfo";
import HelpCenter from "@/pages/help/HelpCenter";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const legalRoutes: RouteConfig[] = [
  {
    path: "/legal/privacy",
    element: <PrivacyPolicy />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/legal/terms",
    element: <TermsOfService />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/legal/compliance",
    element: <ComplianceInfo />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  },
  {
    path: "/help",
    element: <HelpCenter />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  }
];
