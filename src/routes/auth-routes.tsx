
import AuthPage from "@/pages/auth/AuthPage";
import { RouteConfig } from "./types";

type AuthPageType = "login" | "register" | "recovery" | "reset";

interface AuthPageProps {
  type?: AuthPageType;
}

// Type assertion to ensure AuthPage accepts the type prop
const TypedAuthPage = AuthPage as React.ComponentType<AuthPageProps>;

export const authRoutes: RouteConfig[] = [
  {
    path: "/auth",
    element: <TypedAuthPage />,
  },
  {
    path: "/auth/login",
    element: <TypedAuthPage />,
  },
  {
    path: "/auth/register",
    element: <TypedAuthPage type="register" />,
  },
  {
    path: "/auth/forgot-password",
    element: <TypedAuthPage type="recovery" />,
  },
  {
    path: "/auth/reset-password",
    element: <TypedAuthPage type="reset" />,
  }
];
