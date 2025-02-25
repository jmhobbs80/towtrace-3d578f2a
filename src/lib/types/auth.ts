
export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'dealer' | 'wholesaler' | 'overwatch_admin' | 'super_admin' | 'support_agent' | 'billing_manager';

export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

export interface AdminAuditLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id?: string | null;
  previous_state?: Record<string, any> | null;
  new_state?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  ip_address?: string | null;
  created_at: string;
}
