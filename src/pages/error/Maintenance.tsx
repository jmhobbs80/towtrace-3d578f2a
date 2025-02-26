
import { Button } from "@/components/ui/button";

export function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
        <p className="mb-8 text-muted-foreground">
          We're currently performing scheduled maintenance. Please check back later.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    </div>
  );
}
