import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRepairFacilities, getRepairOrders, getRepairStats } from '@/lib/api/repair';
import { RepairFacilityCard } from '@/components/repair/RepairFacilityCard';
import { RepairOrderCard } from '@/components/repair/RepairOrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

export default function RepairDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: facilities = [] } = useQuery({
    queryKey: ['repair-facilities'],
    queryFn: getRepairFacilities,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['repair-orders'],
    queryFn: () => getRepairOrders(),
  });

  const { data: stats } = useQuery({
    queryKey: ['repair-stats', user?.id],
    queryFn: () => getRepairStats(user?.id || ''),
    enabled: !!user?.id,
  });

  const handleStatusUpdate = async (orderId: string, status: 'completed') => {
    try {
      toast({
        title: "Status Updated",
        description: "The repair order has been marked as completed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update repair order status.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Repair Management</h1>
        <Link to="/repairs/create">
          <Button>Create Repair Order</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.completedOrders || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(stats?.averageCost || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(stats?.totalCost || 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Repair Facilities */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Repair Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facilities.map(facility => (
            <RepairFacilityCard 
              key={facility.id} 
              facility={facility}
              activeRepairs={orders.filter(o => o.facility_id === facility.id).length}
            />
          ))}
        </div>
      </section>

      {/* Active Repair Orders */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Active Repair Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders
            .filter(order => order.status !== 'completed')
            .map(order => (
              <RepairOrderCard 
                key={order.id} 
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
