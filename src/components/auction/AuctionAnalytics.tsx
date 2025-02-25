
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuctionAnalytics } from "@/lib/api/auctions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AuctionAnalyticsProps {
  auctionId: string;
}

export function AuctionAnalytics({ auctionId }: AuctionAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['auction-analytics', auctionId],
    queryFn: () => getAuctionAnalytics(auctionId)
  });

  if (isLoading) return <div>Loading analytics...</div>;

  const soldVehicles = analytics?.filter(result => result.status === 'completed') || [];
  const totalSales = soldVehicles.reduce((sum, result) => sum + (result.winning_bid_amount || 0), 0);
  const averagePrice = soldVehicles.length ? totalSales / soldVehicles.length : 0;

  const chartData = soldVehicles.map(result => ({
    vehicle: `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model}`,
    amount: result.winning_bid_amount
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auction Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vehicles Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {soldVehicles.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${averagePrice.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
