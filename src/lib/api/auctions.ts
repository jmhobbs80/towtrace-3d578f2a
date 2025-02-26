import { supabase } from '@/integrations/supabase/client';
import type { AuctionAnalytics } from '@/lib/types/auction';

export const getAuctionAnalytics = async (auctionId: string): Promise<AuctionAnalytics[]> => {
  const { data, error } = await supabase.functions.invoke('get-auction-analytics', {
    body: { auctionId }
  });

  if (error) {
    console.error('Error fetching auction analytics:', error);
    throw error;
  }

  return data || [];
};
