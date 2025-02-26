export type AuctionStatus = 'draft' | 'scheduled' | 'live' | 'ended' | 'canceled';

export interface Auction {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: AuctionStatus;
  minimum_participants: number;
  created_at: string;
  updated_at: string;
}

export interface AuctionItem {
  id: string;
  auction_id: string;
  vehicle_id: string;
  starting_price: number;
  reserve_price: number | null;
  current_bid: number | null;
  current_winner_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
}

export interface AuctionBid {
  id: string;
  auction_item_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
}

export type AuctionAnalytics = {
  id: string;
  auction_id: string;
  vehicle_id: string;
  winning_bid_amount: number | null;
  status: string;
  created_at: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    condition: string;
  };
};
