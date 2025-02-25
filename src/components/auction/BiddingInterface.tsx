
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { placeBid, subscribeToBids } from '@/lib/api/auctions';
import type { AuctionItem, AuctionBid } from '@/lib/types/auction';

interface BiddingInterfaceProps {
  item: AuctionItem;
  onBidPlaced?: (bid: AuctionBid) => void;
}

export function BiddingInterface({ item, onBidPlaced }: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState<number>(
    (item.current_bid || item.starting_price) + 100
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const subscription = subscribeToBids(item.id, (bid) => {
      toast({
        title: "New Bid Placed",
        description: `A new bid of $${bid.amount.toLocaleString()} has been placed`
      });
      if (onBidPlaced) onBidPlaced(bid);
    });

    return () => {
      subscription.then(channel => supabase.removeChannel(channel));
    };
  }, [item.id, onBidPlaced]);

  const handleSubmitBid = async () => {
    try {
      setIsSubmitting(true);
      const bid = await placeBid({
        auction_item_id: item.id,
        bidder_id: 'current-user-id', // This should come from auth context
        amount: bidAmount
      });

      toast({
        title: "Bid Placed Successfully",
        description: `Your bid of $${bidAmount.toLocaleString()} has been placed`
      });

      if (onBidPlaced) onBidPlaced(bid);
      setBidAmount(bidAmount + 100);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Placing Bid",
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Your Bid</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            min={(item.current_bid || item.starting_price) + 100}
            step={100}
          />
          <Button 
            onClick={handleSubmitBid}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Current Bid: ${(item.current_bid || item.starting_price).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
