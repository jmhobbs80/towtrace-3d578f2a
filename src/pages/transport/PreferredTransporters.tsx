
import { PreferredTransporterManager } from "@/components/transport/PreferredTransporterManager";

export default function PreferredTransporters() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Preferred Transporters</h1>
      <PreferredTransporterManager />
    </div>
  );
}
