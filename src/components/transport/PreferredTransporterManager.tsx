
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface Transporter {
  id: string;
  name: string;
  average_rating: number;
}

interface PreferredTransporter {
  id: string;
  transporter_id: string;
  priority: number;
  is_active: boolean;
  transporter: {
    name: string;
    average_rating: number;
  };
}

export function PreferredTransporterManager() {
  const { organization } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: preferredTransporters, refetch: refetchPreferred } = useQuery({
    queryKey: ["preferred-transporters", organization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preferred_transporters")
        .select(`
          *,
          transporter:organizations!preferred_transporters_transporter_id_fkey(
            name,
            average_rating
          )
        `)
        .eq("organization_id", organization?.id);

      if (error) throw error;
      return data as PreferredTransporter[];
    },
    enabled: !!organization?.id,
  });

  const { data: availableTransporters } = useQuery({
    queryKey: ["transporters", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("organizations")
        .select("id, name, average_rating")
        .eq("type", "transporter")
        .order("average_rating", { ascending: false });

      if (searchQuery) {
        query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Transporter[];
    },
  });

  const addPreferredMutation = useMutation({
    mutationFn: async (transporterId: string) => {
      const { error } = await supabase.from("preferred_transporters").insert({
        organization_id: organization?.id,
        transporter_id: transporterId,
        priority: 1,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Preferred transporter added successfully",
      });
      refetchPreferred();
    },
  });

  const removePreferredMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("preferred_transporters")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Preferred transporter removed successfully",
      });
      refetchPreferred();
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferred Transporters</CardTitle>
          <CardDescription>
            Manage your preferred transporters for automatic job assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transporters..."
              className="flex-1 p-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 mt-4">
            {availableTransporters?.map((transporter) => {
              const isPreferred = preferredTransporters?.some(
                (pt) => pt.transporter_id === transporter.id
              );
              const preferredId = preferredTransporters?.find(
                (pt) => pt.transporter_id === transporter.id
              )?.id;

              return (
                <div
                  key={transporter.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{transporter.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {transporter.average_rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  {isPreferred ? (
                    <Button
                      variant="destructive"
                      onClick={() => preferredId && removePreferredMutation.mutate(preferredId)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addPreferredMutation.mutate(transporter.id)}
                    >
                      Add as Preferred
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
