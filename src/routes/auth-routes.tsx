
import AuthPage from "@/pages/auth/AuthPage";
import { UserRole } from "@/lib/types/auth";
import type { RouteConfig } from "./types";

export const authRoutes: RouteConfig[] = [
  {
    path: "/auth",
    element: <AuthPage />,
    allowedRoles: [] as UserRole[]
  }
];
