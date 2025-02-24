
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/ui/layout/Sidebar";

const Index = () => {
  const { organization } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
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
      </main>
    </div>
  );
};

export default Index;
