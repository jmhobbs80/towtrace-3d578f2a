
import { UserRole } from "@/lib/types/auth";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedRoles?: UserRole[];
}
