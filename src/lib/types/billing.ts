
import type { Database } from "@/integrations/supabase/types";

export type PaymentMethod = Database["public"]["Enums"]["payment_method"];
export type Json = Database["public"]["Tables"]["payments"]["Row"]["metadata"];

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
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: Record<string, number>;
  is_active: boolean;
}
