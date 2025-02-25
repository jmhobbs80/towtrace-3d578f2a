
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
          vin
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
          vin
        ),
        bids:auction_bids(*)
      )
    `)
    .eq('id', auctionId)
    .single();

  if (error) throw error;
  return data;
}
