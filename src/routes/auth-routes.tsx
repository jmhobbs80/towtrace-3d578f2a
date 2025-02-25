
import AuthPage from "@/pages/auth/AuthPage";
import NotificationCenter from "@/pages/notifications/NotificationCenter";
import { UserRole } from "@/lib/types/auth";
import { ROLE_ACCESS } from "./role-access";
import type { RouteConfig } from "./types";

export const authRoutes: RouteConfig[] = [
  {
    path: "/auth",
    element: <AuthPage />,
    allowedRoles: [] as UserRole[]
  },
  {
    path: "/auth/signup",
    element: <AuthPage />,
    allowedRoles: [] as UserRole[]
  },
  {
    path: "/auth/login",
    element: <AuthPage />,
    allowedRoles: [] as UserRole[]
  },
  {
    path: "/auth/forgot-password",
    element: <AuthPage />,
    allowedRoles: [] as UserRole[]
  },
  {
    path: "/notifications",
    element: <NotificationCenter />,
    allowedRoles: ROLE_ACCESS.PUBLIC
  }
];
