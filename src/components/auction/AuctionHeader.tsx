
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuctionHeaderProps {
  title: string;
  description: string | null;
}

export function AuctionHeader({ title, description }: AuctionHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
