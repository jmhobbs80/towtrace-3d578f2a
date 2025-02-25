
import { supabase } from "@/integrations/supabase/client";

export const initiateQuickBooksConnect = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('quickbooks-oauth', {
      body: { path: 'authorize' }
    });

    if (error) throw error;
    
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
