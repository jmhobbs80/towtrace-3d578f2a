
import type { UserRole } from "@/lib/types/auth";

export const ROLE_ACCESS = {
  ADMIN: ["admin", "super_admin", "overwatch_admin"] as UserRole[],
  FLEET: ["dispatcher", "admin", "super_admin"] as UserRole[],
  INVENTORY: ["dealer", "wholesaler", "admin", "super_admin"] as UserRole[],
  DEALER: ["dealer", "admin", "super_admin"] as UserRole[],
  WHOLESALER: ["wholesaler", "admin", "super_admin"] as UserRole[],
  TRANSPORT: ["dealer", "wholesaler", "transporter", "admin", "super_admin"] as UserRole[],
  BILLING: ["billing_manager", "admin", "super_admin"] as UserRole[],
  DRIVER: ["driver", "admin", "super_admin"] as UserRole[],
  DISPATCH: ["dispatcher", "admin", "super_admin"] as UserRole[],
  ANALYTICS: ["dealer", "wholesaler", "dispatcher", "admin", "super_admin", "billing_manager"] as UserRole[],
  SUPPORT: ["support_agent", "admin", "super_admin"] as UserRole[],
  CUSTOMER: [] as UserRole[], // Public access
  PUBLIC: [] as UserRole[], // Public access
} as const;
