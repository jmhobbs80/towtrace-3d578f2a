import type { Database } from "@/integrations/supabase/types";

export type PaymentMethod = Database["public"]["Enums"]["payment_method"];
export type OrganizationType = Database["public"]["Enums"]["organization_type"];
export type Json = Database["public"]["Tables"]["payments"]["Row"]["metadata"];

export interface RoleFeature {
  id: string;
  organization_type: OrganizationType;
  feature_key: string;
  feature_name: string;
  description?: string;
  is_addon: boolean;
}

export interface OrganizationRole {
  id: string;
  organization_id: string;
  role_type: OrganizationType;
  is_primary: boolean;
}

export interface Payment {
  id: string;
  job_id: string;
  organization_id: string;
  amount: number;
  method: PaymentMethod;
  status: string;
  reference_number?: string;
  notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Json;
}

export interface Invoice {
  id: string;
  organization_id: string;
  customer_id?: string;
  total_amount: number;
  status: string;
  due_date?: string;
  issued_date: string;
  paid_date?: string;
  invoice_number: string;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  organization_type: OrganizationType;
  base_price: number;
  per_user_price: number;
  per_vehicle_price: number;
  interval: 'month' | 'year';
  tier: string;
  features: string[];
  limits: Record<string, number>;
  addon_roles: OrganizationType[];
  addon_price: number;
  volume_discount?: Array<{
    threshold: number;
    discount_percentage: number;
  }>;
  is_active: boolean;
}

export interface SubscriptionAddon {
  id: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  limits: Record<string, number>;
  is_active: boolean;
}

export interface UsageMetrics {
  organization_id: string;
  feature_name: string;
  usage_count: number;
  usage_type: string;
  pricing_tier?: string;
  period_start: string;
  period_end: string;
}

export interface BillingCalculation {
  base_cost: number;
  user_costs: number;
  vehicle_costs: number;
  addon_costs: number;
  volume_discounts: number;
  total: number;
}
