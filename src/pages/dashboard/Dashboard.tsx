
import { useAuth } from "@/components/auth/AuthProvider";
import { DealerDashboard } from "./DealerDashboard";
import { TransporterDashboard } from "./TransporterDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationSwitcher } from "@/components/organization/OrganizationSwitcher";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building, TrendingUp, Truck, Users } from "lucide-react";

export default function Dashboard() {
  const { organization } = useAuth();
  const navigate = useNavigate();

  if (!organization) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-primary font-bold">Welcome to TowTrace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Please select or create an organization to continue.
            </p>
            <OrganizationSwitcher />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Create Organization</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate("/organization/new")}
                    variant="outline"
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Join Existing</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate("/organization/join")}
                    variant="outline"
                    className="w-full"
                  >
                    Join Team
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Schedule Demo</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate("/schedule-demo")}
                    variant="outline"
                    className="w-full"
                  >
                    Book Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#9b87f5]/5 to-background">
            <CardHeader>
              <CardTitle className="text-[#9b87f5]">For Dealers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your inventory, track vehicles, and streamline your operations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#7E69AB]/5 to-background">
            <CardHeader>
              <CardTitle className="text-[#7E69AB]">For Transporters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimize routes, manage fleet, and increase efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#D6BCFA]/5 to-background">
            <CardHeader>
              <CardTitle className="text-[#D6BCFA]">For Wholesalers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access auctions, manage trades, and grow your business.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  switch (organization.type) {
    case "dealer":
    case "wholesaler":
      return <DealerDashboard />;
    case "transporter":
      return <TransporterDashboard />;
    default:
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome to {organization.name}</h1>
          <p className="mt-4">Please complete your organization setup to continue.</p>
        </div>
      );
  }
}
