
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VehicleDetailsCard } from './VehicleDetailsCard';
import { PaymentCard } from './PaymentCard';
import { DocumentationCard } from './DocumentationCard';

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
        const { data: validation, error: validationError } = await supabase
          .rpc('validate_customer_access_token', {
            _token: token
          }) as { data: TokenValidation | null, error: any };

        if (validationError) throw validationError;
        if (!validation?.is_valid) {
          setError('Invalid or expired access token');
          return;
        }

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

  const handlePaymentClick = async () => {
    try {
      if (!impound) return;
      
      const { data: paymentIntent, error: intentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            amount: impound.total_fees,
            impoundId: impound.id
          }
        }
      );

      if (intentError) throw intentError;

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe failed to load');

      const result = await stripe.redirectToCheckout({
        sessionId: paymentIntent.sessionId
      });

      if (result.error) throw result.error;

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <VehicleDetailsCard
          vehicle={impound.inventory_vehicles!}
          status={impound.status}
          impoundDate={impound.impound_date}
          releaseDate={impound.release_date}
        />

        <PaymentCard
          totalFees={impound.total_fees}
          status={impound.status}
          onPaymentClick={handlePaymentClick}
        />

        <DocumentationCard
          policeReportNumber={impound.police_report_number}
          insuranceClaimNumber={impound.insurance_claim_number}
        />
      </div>
    </div>
  );
}
