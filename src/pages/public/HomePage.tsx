
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6">
        <NavigationMenu>
          <Link to="/" className="text-2xl font-bold">TowTrace</Link>
          <div className="flex-1" />
          <Link to="/about" className="px-4 py-2">About</Link>
          <Link to="/pricing" className="px-4 py-2">Pricing</Link>
          <Link to="/contact" className="px-4 py-2">Contact</Link>
          <Link to="/help" className="px-4 py-2">Help</Link>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </NavigationMenu>
      </header>

      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Next-Generation Vehicle Management Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline your towing operations with real-time tracking, automated dispatch, and seamless fleet management.
          </p>
          <Link to="/auth?type=register">
            <Button size="lg" className="mr-4">Get Started</Button>
          </Link>
          <Link to="/schedule-demo">
            <Button variant="outline" size="lg">Schedule Demo</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Monitor your entire fleet in real-time with advanced GPS tracking and status updates.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Dispatch</CardTitle>
            </CardHeader>
            <CardContent>
              <p>AI-powered dispatch system optimizes routes and automatically assigns the best driver for each job.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Give your customers real-time updates and easy access to service requests and payment processing.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
