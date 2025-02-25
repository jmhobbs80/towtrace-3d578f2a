
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuctionDetails } from "@/lib/api/auctions";
import { BiddingInterface } from "./BiddingInterface";
import { AuctionAnalytics } from "./AuctionAnalytics";
import type { AuctionItem } from "@/lib/types/auction";

interface AuctionDetailedViewProps {
  auctionId: string;
}

export function AuctionDetailedView({ auctionId }: AuctionDetailedViewProps) {
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);

  const { data: auction, isLoading } = useQuery({
    queryKey: ['auction-details', auctionId],
    queryFn: () => getAuctionDetails(auctionId)
  });

  if (isLoading) return <div>Loading auction details...</div>;
  if (!auction) return <div>Auction not found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{auction.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{auction.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Auction Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {auction.items?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>
                  {item.vehicle?.year} {item.vehicle?.make} {item.vehicle?.model}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">VIN</p>
                      <p className="font-medium">{item.vehicle?.vin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Starting Price</p>
                      <p className="font-medium">${item.starting_price.toLocaleString()}</p>
                    </div>
                  </div>
                  <BiddingInterface item={item} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <AuctionAnalytics auctionId={auctionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
