
import { supabase } from "@/integrations/supabase/client";
import type { ProviderBalance, ProviderPayout, JobEarnings } from "../../types/billing";

export const getProviderBalance = async (organizationId: string): Promise<ProviderBalance> => {
  const { data, error } = await supabase
    .from('provider_balances')
    .select('*')
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getProviderPayouts = async (organizationId: string): Promise<ProviderPayout[]> => {
  const { data, error } = await supabase
    .from('provider_payouts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(payout => ({
    ...payout,
    status: payout.status as ProviderPayout['status']
  }));
};

export const getJobEarnings = async (organizationId: string): Promise<JobEarnings[]> => {
  const { data, error } = await supabase
    .from('job_earnings')
    .select('*, jobs:job_id(*)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(earning => ({
    ...earning,
    status: earning.status as JobEarnings['status']
  }));
};

export const requestPayout = async (data: {
  organization_id: string;
  amount: number;
  payout_method: string;
}): Promise<ProviderPayout> => {
  const { data: payout, error } = await supabase
    .from('provider_payouts')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...payout,
    status: payout.status as ProviderPayout['status']
  };
};
