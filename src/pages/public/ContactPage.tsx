
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contact form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
