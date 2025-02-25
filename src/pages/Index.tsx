
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const { organization } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to {organization?.name || 'TowTrace'}
          </h1>
          <p className="text-gray-600">
            Subscription Tier: {organization?.subscription_tier || 'Loading...'}
          </p>
          <p className="text-gray-600">
            Status: {organization?.subscription_status || 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
