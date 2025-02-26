
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">About TowTrace</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              TowTrace is dedicated to revolutionizing the vehicle management industry
              through innovative technology solutions that enhance efficiency,
              transparency, and customer satisfaction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We envision a future where vehicle management is seamless,
              automated, and stress-free for both service providers and customers.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none">
        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
        <p className="mb-4">
          Founded in 2024, TowTrace emerged from the need to modernize the
          vehicle management industry. Our team of industry experts and
          technology innovators came together to create a comprehensive
          solution that addresses the unique challenges faced by towing
          companies, dealers, and fleet managers.
        </p>

        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Innovation in everything we do</li>
          <li>Transparency and trust</li>
          <li>Customer success first</li>
          <li>Continuous improvement</li>
        </ul>
      </div>
    </div>
  );
}
