
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [stats] = useState([
    { label: "Active Jobs", value: "12" },
    { label: "Available Drivers", value: "8" },
    { label: "Completed Today", value: "45" },
    { label: "Average Response Time", value: "15min" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="lg:pl-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dispatch Console</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your towing operations in real-time
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Job</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in"
              >
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              Job list will be implemented in the next iteration
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
