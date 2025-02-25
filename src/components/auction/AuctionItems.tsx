
import { AuctionItemCard } from "./AuctionItemCard";
import type { AuctionItem } from "@/lib/types/auction";

interface AuctionItemsProps {
  items: AuctionItem[];
}

export function AuctionItems({ items }: AuctionItemsProps) {
  return (
    <div className="space-y-4">
      {items?.map((item) => (
        <AuctionItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
