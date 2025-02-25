
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Truck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoadTable } from "@/components/transport/LoadTable";
import { supabase } from "@/integrations/supabase/client";

export default function BulkTransport() {
  const { organization } = useAuth();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { data: loads = [], isLoading } = useQuery({
    queryKey: ['bulk-transport-loads', organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('load_type', 'bulk')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id,
  });

  const handleOptimize = async (load: any) => {
    setIsOptimizing(true);
    try {
      // Implement route optimization logic here
      console.log('Optimizing bulk transport route for load:', load.id);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bulk Transport</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Bulk Transport
        </Button>
      </div>

      {isLoading ? (
        <div>Loading bulk transport requests...</div>
      ) : (
        <LoadTable
          loads={loads}
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
        />
      )}
    </div>
  );
}
