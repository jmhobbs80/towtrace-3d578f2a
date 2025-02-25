
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImpoundDetails {
  id: string;
  status: string;
  impound_date: string;
  total_fees: number;
  release_date: string | null;
  police_report_number?: string;
  insurance_claim_number?: string;
  inventory_vehicles?: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
}

interface TokenValidation {
  is_valid: boolean;
  impound_id: string;
}

export default function CustomerPortal() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const [impound, setImpound] = useState<ImpoundDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateTokenAndFetchDetails = async () => {
      try {
        // First validate the token
        const { data: validation, error: validationError } = await supabase
          .rpc('validate_customer_access_token', {
            _token: token
          }) as { data: TokenValidation | null, error: any };

        if (validationError) throw validationError;
        if (!validation?.is_valid) {
          setError('Invalid or expired access token');
          return;
        }

        // Fetch impound details
        const { data: impoundData, error: impoundError } = await supabase
          .from('impounded_vehicles')
          .select(`
            id,
            status,
            impound_date,
            total_fees,
            release_date,
            police_report_number,
            insurance_claim_number,
            inventory_vehicles(
              make,
              model,
              year,
              vin
            )
          `)
          .eq('id', validation.impound_id)
          .single();

        if (impoundError) throw impoundError;
        setImpound(impoundData);
      } catch (err) {
        console.error('Error fetching impound details:', err);
        setError('Failed to load vehicle details');
        toast({
          title: "Error",
          description: "Failed to load vehicle details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateTokenAndFetchDetails();
    } else {
      setError('No access token provided');
      setLoading(false);
    }
  }, [token, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!impound) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      impounded: "bg-red-500",
      waiting_for_payment: "bg-yellow-500",
      pending_release: "bg-blue-500",
      released: "bg-green-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Vehicle Details</span>
              <Badge className={`${getStatusColor(impound.status)} text-white`}>
                {impound.status.replace('_', ' ')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                <p className="text-gray-600">
                  {impound.inventory_vehicles?.year} {impound.inventory_vehicles?.make} {impound.inventory_vehicles?.model}
                </p>
                <p className="text-gray-600">VIN: {impound.inventory_vehicles?.vin}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Impound Details</h3>
                <p className="text-gray-600">
                  Impounded on: {new Date(impound.impound_date).toLocaleDateString()}
                </p>
                {impound.release_date && (
                  <p className="text-gray-600">
                    Released on: {new Date(impound.release_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fees and Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Fees:</span>
                <span className="text-xl">${impound.total_fees.toLocaleString()}</span>
              </div>
              {impound.status === 'waiting_for_payment' && (
                <Button className="w-full" size="lg">
                  Pay Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {impound.police_report_number && (
                <p className="text-gray-600">
                  Police Report #: {impound.police_report_number}
                </p>
              )}
              {impound.insurance_claim_number && (
                <p className="text-gray-600">
                  Insurance Claim #: {impound.insurance_claim_number}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
