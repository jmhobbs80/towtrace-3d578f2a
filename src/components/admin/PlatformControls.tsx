
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { FeatureToggle } from "@/lib/types/features";

export function PlatformControls() {
  const queryClient = useQueryClient();

  const { data: features = [], isLoading } = useQuery({
    queryKey: ['feature-toggles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_toggles')
        .select('*')
        .order('category');

      if (error) throw error;
      return data as FeatureToggle[];
    },
  });

  // Subscribe to feature toggle changes
  useEffect(() => {
    const channel = supabase
      .channel('feature-toggles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_toggles'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['feature-toggles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const toggleFeature = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('feature_toggles')
        .update({ is_enabled: isEnabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-toggles'] });
      toast.success('Feature toggle updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update feature toggle');
      console.error('Toggle error:', error);
    }
  });

  const handleToggleFeature = (id: string, isEnabled: boolean) => {
    toggleFeature.mutate({ id, isEnabled });
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, FeatureToggle[]>);

  if (isLoading) {
    return <div>Loading platform controls...</div>;
  }

  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle>Platform Feature Controls</CardTitle>
      </CardHeader>
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{feature.name}</h4>
                    <Badge variant={feature.is_enabled ? "default" : "secondary"}>
                      {feature.is_enabled ? "Enabled" : "Coming Soon"}
                    </Badge>
                  </div>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                </div>
                <Switch
                  checked={feature.is_enabled}
                  onCheckedChange={(checked) => handleToggleFeature(feature.id, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
