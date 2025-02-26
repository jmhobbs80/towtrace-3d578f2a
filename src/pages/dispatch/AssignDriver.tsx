
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface QueryResponse {
  data: Driver[] | null;
  error: Error | null;
}

export function AssignDriver() {
  const { toast } = useToast();

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async (): Promise<Driver[]> => {
      const { data, error }: QueryResponse = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'driver');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching drivers",
          description: error.message
        });
        throw error;
      }

      return data || [];
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Assign Driver</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading drivers...</p>
          ) : (
            <div className="space-y-4">
              {drivers?.map((driver) => (
                <div key={driver.id} className="flex justify-between items-center p-4 border rounded">
                  <span>{`${driver.first_name} ${driver.last_name}`}</span>
                  <Button>Assign</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
