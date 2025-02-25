import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarFront, Building2, ArrowLeftRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

interface Trade {
  id: string;
  source_dealer: string;
  destination_dealer: string | null;
  vehicle_id: string;
  status: TradeStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
}

export default function DealerTrades() {
  const { organization, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const { data: dealerRole } = useQuery({
    queryKey: ['dealer-role', organization?.id, user?.id],
    queryFn: async () => {
      if (!user?.id || !organization?.id) return null;

      const { data, error } = await supabase
        .from('organization_roles')
        .select('role_type')
        .eq('organization_id', organization.id)
        .eq('role_type', 'dealer')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: "Access Denied. You must be a dealer to access this page."
    }
  });

  useEffect(() => {
    if (!user?.id) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['dealer-trades', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];
      
      const { data, error } = await supabase
        .from('dealer_trades')
        .select(`
          id,
          source_dealer,
          destination_dealer,
          status,
          created_at,
          vehicle:inventory_vehicles!inner (
            make,
            model,
            year,
            vin
          )
        `)
        .or(`source_dealer.eq.${organization.id},destination_dealer.eq.${organization.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!organization?.id && !!dealerRole,
    meta: {
      errorMessage: "Failed to fetch trades. Please try again later."
    }
  });

  const { data: availableVehicles = [] } = useQuery({
    queryKey: ['available-vehicles', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return [];

      const { data, error } = await supabase
        .from('inventory_vehicles')
        .select('id, make, model, year, vin')
        .eq('organization_id', organization.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id && !!dealerRole,
    meta: {
      errorMessage: "Failed to fetch available vehicles. Please try again later."
    }
  });

  const handleInitiateTrade = async () => {
    if (!selectedVehicle || !organization?.id) return;

    try {
      const { error } = await supabase
        .from('dealer_trades')
        .insert({
          source_dealer: organization.id,
          vehicle_id: selectedVehicle,
          status: 'pending' as TradeStatus
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trade initiated successfully."
      });
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Failed to initiate trade:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate trade. Please try again later."
      });
    }
  };

  if (!dealerRole || !user) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dealer Trades</h1>
        <Button 
          onClick={handleInitiateTrade} 
          disabled={!selectedVehicle || !organization?.id}
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Initiate Trade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Active Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades?.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>
                    {trade.vehicle.year} {trade.vehicle.make} {trade.vehicle.model}
                    <br />
                    <span className="text-sm text-gray-500">
                      VIN: {trade.vehicle.vin}
                    </span>
                  </TableCell>
                  <TableCell>{trade.source_dealer}</TableCell>
                  <TableCell>{trade.destination_dealer || 'Open'}</TableCell>
                  <TableCell>{trade.status}</TableCell>
                  <TableCell>
                    {new Date(trade.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {trade.status === 'pending' && (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
