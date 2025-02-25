
export interface QuickBooksConnection {
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  realm_id: string;
}

export interface SyncLog {
  id: string;
  organization_id: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export interface SyncResult {
  Id: string;
  [key: string]: any;
}
