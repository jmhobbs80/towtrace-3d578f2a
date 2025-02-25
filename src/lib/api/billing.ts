import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentMethod, SubscriptionPlan, OrganizationType, RoleFeature, OrganizationRole, VolumeDiscount, ProviderBalance, ProviderPayout, JobEarnings, Invoice } from "../types/billing";
import type { Job } from "@/lib/types/job";

export const createPayment = async (data: {
  job_id: string;
  organization_id: string;
  amount: number;
  method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}): Promise<Payment> => {
  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select('*')
    .single();

  if (error) throw error;

  // After creating payment, sync with QuickBooks
  try {
    await supabase.functions.invoke('quickbooks-sync', {
      body: {
        organization_id: data.organization_id,
        entity_type: 'payment',
        entity_id: payment.id
      }
    });
  } catch (syncError) {
    console.error('Error syncing payment to QuickBooks:', syncError);
    // Continue anyway - the sync will be retried automatically
  }

  return payment;
};

export const fetchOrganizationRoles = async (organizationId: string): Promise<OrganizationRole[]> => {
  const { data, error } = await supabase
    .from('organization_roles')
    .select('*')
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data;
};

export const addOrganizationRole = async (
  organizationId: string, 
  roleType: OrganizationType, 
  isPrimary: boolean = false
): Promise<OrganizationRole> => {
  const { data, error } = await supabase
    .from('organization_roles')
    .insert({
      organization_id: organizationId,
      role_type: roleType,
      is_primary: isPrimary
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchRoleFeatures = async (organizationType: OrganizationType): Promise<RoleFeature[]> => {
  const { data, error } = await supabase
    .from('role_features')
    .select('*')
    .eq('organization_type', organizationType);

  if (error) throw error;
  return data;
};

export const fetchSubscriptionPlans = async (organizationType: OrganizationType): Promise<SubscriptionPlan[]> => {
  const { data: rawData, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .eq('organization_type', organizationType)
    .order('base_price', { ascending: true });

  if (error) throw error;
  
  const plans: SubscriptionPlan[] = rawData.map(plan => {
    // Safely parse volume_discount array
    let volumeDiscount: VolumeDiscount[] | undefined;
    if (Array.isArray(plan.volume_discount)) {
      volumeDiscount = plan.volume_discount.map(discount => {
        const discountObj = discount as Record<string, unknown>;
        return {
          threshold: typeof discountObj.threshold === 'number' ? discountObj.threshold : 
                    typeof discountObj.threshold === 'string' ? Number(discountObj.threshold) : 0,
          discount_percentage: typeof discountObj.discount_percentage === 'number' ? discountObj.discount_percentage :
                             typeof discountObj.discount_percentage === 'string' ? Number(discountObj.discount_percentage) : 0
        };
      });
    }

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description || undefined,
      organization_type: plan.organization_type,
      base_price: plan.base_price,
      per_user_price: plan.per_user_price || 0,
      per_vehicle_price: plan.per_vehicle_price || 0,
      interval: plan.interval as 'month' | 'year',
      tier: plan.tier || 'standard',
      features: Array.isArray(plan.features) ? plan.features.map(String) : [],
      limits: plan.limits as Record<string, number>,
      addon_roles: plan.addon_roles || [],
      addon_price: plan.addon_price || 0,
      volume_discount: volumeDiscount,
      is_active: Boolean(plan.is_active)
    };
  });

  return plans;
};

export const calculateSubscriptionCost = async (
  plan: SubscriptionPlan,
  userCount: number,
  vehicleCount: number,
  additionalRoles: OrganizationType[] = []
): Promise<number> => {
  let total = plan.base_price;
  
  // Add per-user and per-vehicle costs
  total += (plan.per_user_price * userCount);
  total += (plan.per_vehicle_price * vehicleCount);
  
  // Add costs for additional roles
  const validAdditionalRoles = additionalRoles.filter(role => 
    plan.addon_roles.includes(role)
  );
  total += (validAdditionalRoles.length * plan.addon_price);
  
  // Apply volume discounts if any
  if (plan.volume_discount) {
    for (const discount of plan.volume_discount) {
      if (userCount >= discount.threshold) {
        total = total * (1 - (discount.discount_percentage / 100));
        break;
      }
    }
  }
  
  return Number(total.toFixed(2));
};

export const createCheckoutSession = async ({
  organizationId,
  planId,
  additionalRoles = [],
  successUrl,
  cancelUrl
}: {
  organizationId: string;
  planId: string;
  additionalRoles?: OrganizationType[];
  successUrl: string;
  cancelUrl: string;
}) => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { organizationId, planId, additionalRoles, successUrl, cancelUrl }
  });

  if (error) throw error;
  return data;
};

export const getJobPayments = async (jobId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updatePaymentStatus = async (paymentId: string, status: string): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', paymentId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

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
  
  // Cast the status to the correct type
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
  
  // Cast the status to the correct type
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
  
  // Cast the status to the correct type
  return {
    ...payout,
    status: payout.status as ProviderPayout['status']
  };
};

export const createInvoiceFromPayment = async (payment: Payment, job: Job) => {
  const invoiceNumber = `INV-${Date.now()}-${job.id.slice(0, 4)}`;
  
  const invoiceItems = [{
    description: `Towing Service - ${job.service_type}`,
    amount: payment.amount,
    quantity: 1
  }];

  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        organization_id: payment.organization_id,
        customer_id: job.customer_id,
        total_amount: payment.amount,
        items: invoiceItems,
        status: payment.status === 'processed' ? 'paid' : 'pending',
        paid_date: payment.status === 'processed' ? payment.processed_at : null
      })
      .select()
      .single();

    if (error) throw error;

    // After creating invoice, sync with QuickBooks
    try {
      await supabase.functions.invoke('quickbooks-sync', {
        body: {
          organization_id: payment.organization_id,
          entity_type: 'invoice',
          entity_id: invoice.id
        }
      });
    } catch (syncError) {
      console.error('Error syncing invoice to QuickBooks:', syncError);
      // Continue anyway - the sync will be retried automatically
    }

    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

// New QuickBooks specific functions
export const initiateQuickBooksConnect = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('quickbooks-oauth', {
      body: { path: 'authorize' }
    });

    if (error) throw error;
    
    // Redirect to QuickBooks authorization page
    window.location.href = data.url;
  } catch (error) {
    console.error('Error initiating QuickBooks connection:', error);
    throw error;
  }
};

export const handleQuickBooksCallback = async (code: string, realmId: string, organizationId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('quickbooks-oauth', {
      body: { 
        path: 'callback',
        code,
        realmId
      },
      headers: {
        'organization-id': organizationId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error handling QuickBooks callback:', error);
    throw error;
  }
};
