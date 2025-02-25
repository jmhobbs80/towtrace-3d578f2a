
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function LegalHub() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Legal Information</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/legal/terms">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Read our terms of service and user agreement
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/legal/privacy">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn how we handle and protect your data
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/legal/compliance">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View our compliance and regulatory information
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
