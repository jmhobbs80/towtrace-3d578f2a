
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareQuestion, Book, FileQuestion, Phone } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Help Center</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuestion className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold">How do I track my vehicle?</h3>
                <p className="text-muted-foreground">
                  You can track your vehicle through the customer portal using your tracking number.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold">What are your operating hours?</h3>
                <p className="text-muted-foreground">
                  We operate 24/7 for emergency services. Office hours are Monday-Friday, 9am-5pm.
                </p>
              </div>
              <div className="pb-4">
                <h3 className="font-semibold">How do I pay for services?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, cash, and digital payments through our secure payment portal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access our comprehensive documentation and user guides.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help? Our support team is available 24/7.
              </p>
              <div className="space-y-2">
                <p>Email: support@towtrace.com</p>
                <p>Phone: 1-800-TOW-HELP</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
