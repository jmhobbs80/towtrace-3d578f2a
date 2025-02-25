
export type UserRole = 'dealer' | 'wholesaler' | 'admin' | 'dispatcher' | 'provider' | 
                      'consumer' | 'overwatch_admin' | 'super_admin' | 'support_agent' | 
                      'billing_manager' | 'fleet_manager';

export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

// Update to handle JSON type properly
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface AdminAuditLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id?: string | null;
  previous_state?: JsonValue | null;
  new_state?: JsonValue | null;
  metadata?: JsonValue | null;
  ip_address?: string | null;
  created_at: string;
}
