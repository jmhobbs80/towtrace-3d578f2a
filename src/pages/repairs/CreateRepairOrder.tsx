
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRepairFacilities } from '@/lib/api/repair';
import { RepairOrderForm } from '@/components/repair/RepairOrderForm';

export default function CreateRepairOrder() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: any) => {
    // Handle form submission
    navigate('/repairs');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create Repair Order</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <RepairOrderForm 
          vehicleId="" // This should be passed from the route params or state
          onSubmit={handleSubmit}
          onCancel={() => navigate('/repairs')}
        />
      </div>
    </div>
  );
}
