
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function PricingPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Choose the perfect plan for your business
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <div className="text-3xl font-bold">$99/mo</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li>✓ Up to 5 vehicles</li>
              <li>✓ Real-time tracking</li>
              <li>✓ Basic dispatch</li>
              <li>✓ Customer portal</li>
            </ul>
            <Link to="/auth?type=register&plan=basic">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Professional</CardTitle>
            <div className="text-3xl font-bold">$199/mo</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li>✓ Up to 15 vehicles</li>
              <li>✓ Advanced dispatch</li>
              <li>✓ Route optimization</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ API access</li>
            </ul>
            <Link to="/auth?type=register&plan=professional">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <div className="text-3xl font-bold">Custom</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li>✓ Unlimited vehicles</li>
              <li>✓ Custom integration</li>
              <li>✓ Dedicated support</li>
              <li>✓ Custom features</li>
            </ul>
            <Link to="/contact?type=enterprise">
              <Button className="w-full">Contact Sales</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
