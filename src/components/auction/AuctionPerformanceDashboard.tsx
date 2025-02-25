
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { getAuctionAnalytics } from "@/lib/api/auctions";

interface AuctionPerformanceProps {
  auctionId: string;
}

export function AuctionPerformanceDashboard({ auctionId }: AuctionPerformanceProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['auction-analytics', auctionId],
    queryFn: () => getAuctionAnalytics(auctionId)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading auction analytics...
      </div>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        No auction data available
      </div>
    );
  }

  // Calculate key metrics
  const totalVehicles = analytics.length;
  const soldVehicles = analytics.filter(result => result.status === 'completed');
  const totalSales = soldVehicles.reduce((sum, result) => sum + (result.winning_bid_amount || 0), 0);
  const averagePrice = soldVehicles.length ? totalSales / soldVehicles.length : 0;
  const sellThroughRate = (soldVehicles.length / totalVehicles) * 100;

  // Prepare chart data
  const priceDistribution = soldVehicles.map(result => ({
    vehicle: `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model}`,
    price: result.winning_bid_amount
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averagePrice)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Vehicles Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldVehicles.length} / {totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sell-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellThroughRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Prices by Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicle" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="price" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
