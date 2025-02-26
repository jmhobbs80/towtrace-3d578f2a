
import { Button } from "@/components/ui/button";
import { DamageReportForm } from "@/components/inventory/DamageReportForm";
import { RepairOrderForm } from "@/components/repair/RepairOrderForm";

interface ActionModalsProps {
  vehicleId: string;
  isDamageReportOpen: boolean;
  isRepairOrderOpen: boolean;
  onDamageReportClose: () => void;
  onRepairOrderClose: () => void;
  onDamageReportSuccess: () => void;
  onRepairOrderSubmit: (data: { vehicleId?: string; facilityId?: string; estimatedCompletionDate?: string; notes?: string; }) => Promise<void>;
}

export function ActionModals({
  vehicleId,
  isDamageReportOpen,
  isRepairOrderOpen,
  onDamageReportClose,
  onRepairOrderClose,
  onDamageReportSuccess,
  onRepairOrderSubmit
}: ActionModalsProps) {
  return (
    <>
      {isDamageReportOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-4 sm:p-5 border w-[95%] sm:w-[460px] max-w-lg shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add Damage Report
            </h3>
            <div className="mt-2">
              <DamageReportForm
                vehicleId={vehicleId}
                onSuccess={onDamageReportSuccess}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onDamageReportClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {isRepairOrderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-4 sm:p-5 border w-[95%] sm:w-[460px] max-w-lg shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create Repair Order
            </h3>
            <div className="mt-2">
              <RepairOrderForm
                vehicleId={vehicleId}
                onSubmit={onRepairOrderSubmit}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onRepairOrderClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
