
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import type { Auction, AuctionItem, AuctionBid } from "../types/auction";

export async function getAuctions() {
  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      items:auction_items(
        *,
        vehicle:inventory_vehicles(
          make,
          model,
          year,
          vin,
          status,
          auction_status
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAuction(auction: Omit<Auction, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('auctions')
    .insert(auction)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addItemToAuction(item: Omit<AuctionItem, 'id' | 'created_at' | 'updated_at' | 'current_bid' | 'current_winner_id'>) {
  // First, update vehicle status to auction_ready
  const { error: vehicleError } = await supabase
    .from('inventory_vehicles')
    .update({ status: 'auction_ready' })
    .eq('id', item.vehicle_id);

  if (vehicleError) throw vehicleError;

  const { data, error } = await supabase
    .from('auction_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function placeBid(bid: Omit<AuctionBid, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('auction_bids')
    .insert(bid)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAuctionDetails(auctionId: string) {
  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      items:auction_items(
        *,
        vehicle:inventory_vehicles(
          make,
          model,
          year,
          vin,
          status,
          auction_status
        ),
        bids:auction_bids(*)
      )
    `)
    .eq('id', auctionId)
    .single();

  if (error) throw error;
  return data;
}

export async function subscribeToBids(auctionItemId: string, callback: (bid: AuctionBid) => void): Promise<RealtimeChannel> {
  return supabase
    .channel(`auction-bids-${auctionItemId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'auction_bids',
        filter: `auction_item_id=eq.${auctionItemId}`
      },
      (payload) => callback(payload.new as AuctionBid)
    )
    .subscribe();
}

export async function completeAuction(auctionId: string, results: {
  itemId: string;
  winnerId: string;
  finalPrice: number;
}[]) {
  const { error: auctionError } = await supabase
    .from('auctions')
    .update({ status: 'ended' })
    .eq('id', auctionId);

  if (auctionError) throw auctionError;

  // Create auction results and trigger automatic processes
  const { error: resultsError } = await supabase
    .from('auction_results')
    .insert(
      results.map(result => ({
        auction_id: auctionId,
        buyer_id: result.winnerId,
        vehicle_id: result.itemId,
        winning_bid_amount: result.finalPrice,
        status: 'completed',
        delivery_status: 'pending'
      }))
    );

  if (resultsError) throw resultsError;
}

export async function getAuctionAnalytics(auctionId: string) {
  const { data, error } = await supabase
    .from('auction_results')
    .select(`
      *,
      buyer:profiles!buyer_id(*),
      seller:profiles!seller_id(*),
      vehicle:inventory_vehicles(*)
    `)
    .eq('auction_id', auctionId);

  if (error) throw error;
  return data;
}
