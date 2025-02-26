
import AuthPage from "@/pages/auth/AuthPage";
import { RouteConfig } from "./types";

export const authRoutes: RouteConfig[] = [
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/auth/login",
    element: <AuthPage />,
  },
  {
    path: "/auth/register",
    element: <AuthPage type="register" />,
  },
  {
    path: "/auth/forgot-password",
    element: <AuthPage type="recovery" />,
  },
  {
    path: "/auth/reset-password",
    element: <AuthPage type="reset" />,
  }
];
