
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

export function TowTracking() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Track Your Tow</h1>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Active Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">No active tow services to track.</p>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = "/portal/request-tow"}
          >
            Request New Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
