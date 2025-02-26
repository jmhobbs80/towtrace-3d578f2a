
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateJobModal } from "@/components/dispatch/CreateJobModal";

export function CreateJob() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Job</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateJobModal 
            open={true}
            onClose={() => window.history.back()}
            onSuccess={() => window.history.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
