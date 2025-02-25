
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiddingInterface } from "./BiddingInterface";
import type { AuctionItem } from "@/lib/types/auction";

interface AuctionItemCardProps {
  item: AuctionItem;
}

export function AuctionItemCard({ item }: AuctionItemCardProps) {
  return (
    <Card>
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
  );
}
