
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
  entity_id?: string;
  previous_state?: Record<string, any>;
  new_state?: Record<string, any>;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
