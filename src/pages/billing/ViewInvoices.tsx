
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function ViewInvoices() {
  const { toast } = useToast();
  
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching invoices",
          description: error.message
        });
        throw error;
      }
      
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading invoices...</p>
          ) : invoices?.length ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 border rounded">
                  <p>Invoice #{invoice.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No invoices found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
