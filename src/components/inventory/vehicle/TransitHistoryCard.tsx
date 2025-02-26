
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransitRecord } from "@/lib/api/vehicles";

interface TransitHistoryCardProps {
  transitHistory: TransitRecord[];
}

export function TransitHistoryCard({ transitHistory }: TransitHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transit History</CardTitle>
      </CardHeader>
      <CardContent>
        {transitHistory?.length > 0 ? (
          <div className="space-y-4">
            {transitHistory.map((transit) => (
              <div key={transit.id} className="border p-4 rounded">
                <p>Status: {transit.status}</p>
                <p>Pickup Date: {new Date(transit.pickup_date).toLocaleDateString()}</p>
                <p>Delivery Date: {transit.delivery_date ? new Date(transit.delivery_date).toLocaleDateString() : 'Pending'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No transit history available</p>
        )}
      </CardContent>
    </Card>
  );
}
