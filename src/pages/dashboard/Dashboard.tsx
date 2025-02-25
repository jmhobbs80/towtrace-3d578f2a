
import { useAuth } from "@/components/auth/AuthProvider";
import { DealerDashboard } from "./DealerDashboard";
import { TransporterDashboard } from "./TransporterDashboard";

export default function Dashboard() {
  const { organization } = useAuth();

  if (!organization) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to TowTrace</h1>
        <p className="mt-4">Please select an organization to continue.</p>
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
          <p className="mt-4">Unknown organization type.</p>
        </div>
      );
  }
}
