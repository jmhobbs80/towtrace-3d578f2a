
import { ApiDocs } from "@/pages/developer/ApiDocs";
import { ApiKeyManagement } from "@/pages/developer/ApiKeyManagement";
import { WebhookSettings } from "@/pages/developer/WebhookSettings";
import { Sandbox } from "@/pages/developer/Sandbox";
import { RouteConfig } from "./types";

export const developerRoutes: RouteConfig[] = [
  {
    path: "/developer/docs",
    element: <ApiDocs />,
  },
  {
    path: "/developer/api-keys",
    element: <ApiKeyManagement />,
  },
  {
    path: "/developer/webhooks",
    element: <WebhookSettings />,
  },
  {
    path: "/developer/sandbox",
    element: <Sandbox />,
  },
];
