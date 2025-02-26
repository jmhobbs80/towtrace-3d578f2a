
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to TowTrace</h1>
        <p className="text-xl text-muted-foreground">
          The complete towing management solution
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>For Towing Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Streamline your operations and grow your business.</p>
            <Button>Learn More</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Vehicle Owners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Request and track towing services in real-time.</p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Dealerships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your fleet and transportation needs.</p>
            <Button>Learn More</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
