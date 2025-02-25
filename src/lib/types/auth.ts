
export interface AuthUser {
  id: string;
  email?: string;
  role?: 'admin' | 'dispatcher' | 'driver' | 'dealer' | 'wholesaler';
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'dealer' | 'wholesaler';
