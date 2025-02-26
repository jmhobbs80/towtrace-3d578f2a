
import { NotificationCenter } from "@/pages/notifications/NotificationCenter";
import { MessageCenter } from "@/pages/notifications/MessageCenter";
import { DispatchAlerts } from "@/pages/notifications/DispatchAlerts";
import { SystemNotices } from "@/pages/notifications/SystemNotices";
import { NotificationPreferences } from "@/pages/notifications/NotificationPreferences";
import { RouteConfig } from "./types";

export const notificationRoutes: RouteConfig[] = [
  {
    path: "/notifications",
    element: <NotificationCenter />,
  },
  {
    path: "/notifications/messages",
    element: <MessageCenter />,
  },
  {
    path: "/notifications/dispatch",
    element: <DispatchAlerts />,
  },
  {
    path: "/notifications/system",
    element: <SystemNotices />,
  },
  {
    path: "/notifications/preferences",
    element: <NotificationPreferences />,
  },
];
