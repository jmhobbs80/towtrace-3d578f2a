
import { supabase } from '@/integrations/supabase/client';
import type { Auction, AuctionBid, AuctionAnalytics } from '@/lib/types/auction';

export const getAuctions = async (): Promise<Auction[]> => {
  const { data, error } = await supabase
    .from('auctions')
    .select('*, items:auction_items(*)');

  if (error) {
    console.error('Error fetching auctions:', error);
    throw error;
  }

  return data || [];
};

export const getAuctionDetails = async (id: string): Promise<Auction> => {
  const { data, error } = await supabase
    .from('auctions')
    .select('*, items:auction_items(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching auction details:', error);
    throw error;
  }

  return data;
};

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

export const placeBid = async (bid: { auction_item_id: string; bidder_id: string; amount: number }): Promise<AuctionBid> => {
  const { data, error } = await supabase
    .from('auction_bids')
    .insert(bid)
    .select()
    .single();

  if (error) {
    console.error('Error placing bid:', error);
    throw error;
  }

  return data;
};

export const subscribeToBids = async (auctionItemId: string, onUpdate: (bid: AuctionBid) => void) => {
  return supabase
    .channel(`auction_bids:${auctionItemId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'auction_bids',
        filter: `auction_item_id=eq.${auctionItemId}`
      },
      (payload) => onUpdate(payload.new as AuctionBid)
    )
    .subscribe();
};
