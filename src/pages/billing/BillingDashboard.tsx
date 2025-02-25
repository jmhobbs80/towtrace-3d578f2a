
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "@/lib/api/billing";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptionPlans } from "@/lib/api/billing";
import { format } from "date-fns";

export default function BillingDashboard() {
  const { organization } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: fetchSubscriptionPlans
  });

  const handleUpgrade = async (planId: string) => {
    if (!organization) return;
    
    setIsLoading(true);
    try {
      const { url } = await createCheckoutSession({
        organizationId: organization.id,
        planId,
        successUrl: window.location.origin + '/billing?success=true',
        cancelUrl: window.location.origin + '/billing?canceled=true'
      });
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Plan: {organization?.subscription_tier}</p>
              <p>Status: {organization?.subscription_status}</p>
              {organization?.subscription_period_end && (
                <p>Next billing date: {format(new Date(organization.subscription_period_end), 'PPP')}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price}/{plan.interval}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading || plan.id === organization?.subscription_plan_id}
                className="w-full"
              >
                {plan.id === organization?.subscription_plan_id ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
