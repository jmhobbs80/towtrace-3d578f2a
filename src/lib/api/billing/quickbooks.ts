
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const initiateQuickBooksConnect = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('quickbooks-oauth', {
      body: { path: 'authorize' }
    });

    if (error) throw error;
    
    window.location.href = data.url;
  } catch (error) {
    console.error('Error initiating QuickBooks connection:', error);
    toast.error("Failed to connect to QuickBooks. Please try again.");
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

    toast.success("Successfully connected to QuickBooks!");
    return data;
  } catch (error) {
    console.error('Error handling QuickBooks callback:', error);
    toast.error("Failed to complete QuickBooks connection. Please try again.");
    throw error;
  }
};

export const syncQuickBooksEntity = async (entityType: 'invoice' | 'payment' | 'expense', entityId: string, organizationId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('quickbooks-sync', {
      body: {
        entity_type: entityType,
        entity_id: entityId,
        organization_id: organizationId
      }
    });

    if (error) throw error;

    toast.success(`Successfully synced ${entityType} to QuickBooks`);
    return data;
  } catch (error) {
    console.error(`Error syncing ${entityType} to QuickBooks:`, error);
    toast.error(`Failed to sync ${entityType} to QuickBooks. It will be retried automatically.`);
    throw error;
  }
};
