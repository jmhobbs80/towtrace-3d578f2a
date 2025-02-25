
export type FeatureCategory = 'core' | 'billing' | 'dispatch' | 'inventory' | 'auction' | 'reporting';

export interface FeatureToggle {
  id: string;
  name: string;
  description: string | null;
  category: FeatureCategory;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  metadata: Record<string, unknown>;
}
