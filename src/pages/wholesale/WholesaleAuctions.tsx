
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Gavel } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function WholesaleAuctions() {
  const { organization } = useAuth();

  const { data: auctions = [], isLoading } = useQuery({
    queryKey: ['auctions', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          items:auction_items(*)
        `)
        .eq('organization_id', organization?.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wholesale Auctions</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Auction
        </Button>
      </div>

      {isLoading ? (
        <div>Loading auctions...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => (
            <Card key={auction.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="w-5 h-5 mr-2" />
                  {auction.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Start: {new Date(auction.start_time).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    End: {new Date(auction.end_time).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    Items: {auction.items?.length || 0}
                  </p>
                  <p className="text-sm font-medium">
                    Status: {auction.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
