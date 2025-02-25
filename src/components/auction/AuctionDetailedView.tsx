
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuctionDetails } from "@/lib/api/auctions";
import { AuctionHeader } from "./AuctionHeader";
import { AuctionItems } from "./AuctionItems";
import { AuctionAnalytics } from "./AuctionAnalytics";

interface AuctionDetailedViewProps {
  auctionId: string;
}

export function AuctionDetailedView({ auctionId }: AuctionDetailedViewProps) {
  const { data: auction, isLoading } = useQuery({
    queryKey: ['auction-details', auctionId],
    queryFn: () => getAuctionDetails(auctionId)
  });

  if (isLoading) return <div>Loading auction details...</div>;
  if (!auction) return <div>Auction not found</div>;

  return (
    <div className="space-y-6">
      <AuctionHeader 
        title={auction.title}
        description={auction.description}
      />

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Auction Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <AuctionItems items={auction.items || []} />
        </TabsContent>

        <TabsContent value="analytics">
          <AuctionAnalytics auctionId={auctionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
