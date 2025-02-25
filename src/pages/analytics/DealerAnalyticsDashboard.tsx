
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Banknote, Clock, CarFront } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";

interface InventoryMetrics {
  total_vehicles: number;
  available_vehicles: number;
  in_repair: number;
  in_transit: number;
  average_days_in_inventory: number;
}

interface TradeMetrics {
  total_trades: number;
  pending_trades: number;
  completed_trades: number;
  average_completion_time: number;
}

export function DealerAnalyticsDashboard() {
  const { organization } = useAuth();

  // Fetch inventory metrics
  const { data: inventoryMetrics, isLoading: loadingInventory } = useQuery({
    queryKey: ['dealer-inventory-metrics', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_vehicles')
        .select('status, created_at')
        .eq('organization_id', organization?.id);

      if (error) throw error;

      const metrics: InventoryMetrics = {
        total_vehicles: data.length,
        available_vehicles: data.filter(v => v.status === 'available').length,
        in_repair: data.filter(v => v.status === 'in_repair' || v.status === 'pending_repair').length,
        in_transit: data.filter(v => v.status === 'in_transit').length,
        average_days_in_inventory: calculateAverageDays(data.map(v => new Date(v.created_at)))
      };

      return metrics;
    },
    enabled: !!organization?.id
  });

  // Fetch trade metrics
  const { data: tradeMetrics, isLoading: loadingTrades } = useQuery({
    queryKey: ['dealer-trade-metrics', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_trades')
        .select('*')
        .eq('source_dealer', organization?.id);

      if (error) throw error;

      const metrics: TradeMetrics = {
        total_trades: data.length,
        pending_trades: data.filter(t => t.status === 'pending').length,
        completed_trades: data.filter(t => t.status === 'completed').length,
        average_completion_time: calculateAverageCompletionTime(data)
      };

      return metrics;
    },
    enabled: !!organization?.id
  });

  // Fetch monthly inventory trends
  const { data: monthlyTrends, isLoading: loadingTrends } = useQuery({
    queryKey: ['dealer-monthly-trends', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_vehicles')
        .select('created_at, status')
        .eq('organization_id', organization?.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      return processMonthlyTrends(data);
    },
    enabled: !!organization?.id
  });

  if (loadingInventory || loadingTrades || loadingTrends) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dealer Analytics Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <CarFront className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryMetrics?.total_vehicles}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryMetrics?.available_vehicles} Available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tradeMetrics?.pending_trades}</div>
            <p className="text-xs text-muted-foreground">
              {tradeMetrics?.completed_trades} Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Days in Stock</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryMetrics?.average_days_in_inventory}</div>
            <p className="text-xs text-muted-foreground">
              Days on average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Repair/Transit</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(inventoryMetrics?.in_repair || 0) + (inventoryMetrics?.in_transit || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventoryMetrics?.in_repair} In Repair
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Monthly Inventory Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Inventory" />
              <Line type="monotone" dataKey="available" stroke="#82ca9d" name="Available" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function calculateAverageDays(dates: Date[]): number {
  if (!dates.length) return 0;
  const now = new Date();
  const totalDays = dates.reduce((sum, date) => {
    return sum + Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);
  return Math.round(totalDays / dates.length);
}

function calculateAverageCompletionTime(trades: any[]): number {
  const completedTrades = trades.filter(t => t.status === 'completed' && t.created_at);
  if (!completedTrades.length) return 0;
  
  const totalDays = completedTrades.reduce((sum, trade) => {
    const created = new Date(trade.created_at);
    const completed = new Date(trade.updated_at);
    return sum + Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);
  
  return Math.round(totalDays / completedTrades.length);
}

function processMonthlyTrends(data: any[]): any[] {
  const trends: { [key: string]: { date: string; total: number; available: number } } = {};
  
  data.forEach(item => {
    const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!trends[date]) {
      trends[date] = { date, total: 0, available: 0 };
    }
    trends[date].total++;
    if (item.status === 'available') {
      trends[date].available++;
    }
  });

  return Object.values(trends);
}
