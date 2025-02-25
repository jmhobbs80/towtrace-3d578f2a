
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { MapPin, Calendar, Package } from "lucide-react";
import type { Load, Dimensions } from "@/lib/types/load";
import { CreateLoadDialog } from "@/components/transport/CreateLoadDialog";

export default function LoadBoard() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: loads, isLoading } = useQuery({
    queryKey: ["loads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching loads",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Transform the data to match our Load type
      const transformedData: Load[] = data.map((load) => ({
        ...load,
        pickup_location: load.pickup_location as { address: string },
        delivery_location: load.delivery_location as { address: string },
        requirements: (load.requirements as string[]) || [],
        photos: (load.photos as string[]) || [],
        dimensions: load.dimensions as Dimensions | undefined,
        weight: load.weight || undefined,
        price_range: load.price_range || undefined,
        assigned_to: load.assigned_to || undefined,
        description: load.description || undefined
      }));

      return transformedData;
    },
  });

  // Set up real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("loads-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loads",
        },
        (payload) => {
          console.log("Load change received!", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading loads...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Load Board</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Post Load</Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Load Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loads?.map((load) => (
                  <TableRow key={load.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{load.title}</div>
                        <div className="text-sm text-gray-500">
                          {load.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        <Package className="w-4 h-4 mr-1" />
                        {load.load_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {load.pickup_location.address}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(load.pickup_date), "MMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {load.delivery_location.address}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(load.delivery_date), "MMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {load.price_range ? (
                        <span>
                          ${load.price_range.min} - ${load.price_range.max}
                        </span>
                      ) : (
                        "Contact for price"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          load.status === "open"
                            ? "default"
                            : load.status === "assigned"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {load.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <CreateLoadDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
