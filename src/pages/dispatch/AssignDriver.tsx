
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface DriverProfile extends Profile {
  role: string;
}

export function AssignDriver() {
  const { toast } = useToast();

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'driver');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching drivers",
          description: error.message
        });
        throw error;
      }

      return (data as DriverProfile[]) || [];
    }
  });

  const handleAssign = (driverId: string) => {
    // Implementation for assigning driver will go here
    console.log('Assigning driver:', driverId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Assign Driver</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading drivers...</p>
          ) : drivers?.length === 0 ? (
            <p className="text-center text-muted-foreground">No drivers available</p>
          ) : (
            <div className="space-y-4">
              {drivers?.map((driver) => (
                <div 
                  key={driver.id} 
                  className="flex justify-between items-center p-4 border rounded hover:bg-accent/5 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{`${driver.first_name || ''} ${driver.last_name || ''}`}</span>
                    {driver.email && (
                      <span className="text-sm text-muted-foreground">{driver.email}</span>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleAssign(driver.id)}
                    className="ml-4"
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
