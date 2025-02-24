
export interface AuthUser {
  id: string;
  organization_id: string;
  email?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}
