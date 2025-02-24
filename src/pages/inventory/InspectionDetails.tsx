
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getInspectionDetails } from "@/lib/api/inspections";
import type { InspectionChecklistItem } from "@/lib/types/inspection";

export default function InspectionDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['inspection', id],
    queryFn: () => getInspectionDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading inspection details...</div>;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load inspection details",
      variant: "destructive",
    });
    return null;
  }

  if (!data) return null;

  const { inspection, checklistItems } = data;

  const getStatusBadgeVariant = (status: InspectionChecklistItem['status']) => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      case 'needs_repair':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Inspections
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Vehicle ID</dt>
                <dd className="mt-1">{inspection.vehicle_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Badge>{inspection.status}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Inspector</dt>
                <dd className="mt-1">{inspection.inspector_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Inspection Date</dt>
                <dd className="mt-1">
                  {format(new Date(inspection.inspection_date), 'PPP')}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {inspection.notes || "No notes provided"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Items */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {checklistItems.map((item) => (
              <div key={item.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.item_name}</h4>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                
                {item.notes && (
                  <p className="text-sm text-gray-600">{item.notes}</p>
                )}

                {item.photos && item.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {item.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={photo}
                          alt={`${item.item_name} photo ${index + 1}`}
                          className="object-cover rounded-lg w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <Separator />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
