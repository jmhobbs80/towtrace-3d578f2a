
import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { downloadTemplate } from '@/lib/utils';
import { ValidationErrorsTable } from "./validation-errors-table";
import { ValidatedDataTable } from "./validated-data-table";
import { useBulkUpload } from "./use-bulk-upload";
import type { BulkUploadModalProps } from "./types";

export function BulkUploadModal({ 
  open, 
  onClose, 
  onSuccess, 
  locationId,
  organizationId 
}: BulkUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isUploading,
    progress,
    validationErrors,
    validatedData,
    handleFileUpload,
    handleSubmit,
    resetState
  } = useBulkUpload({
    organizationId,
    locationId,
    onSuccess,
    onClose
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Vehicles</DialogTitle>
          <DialogDescription>
            Upload multiple vehicles using a CSV file. Download the template below for the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => downloadTemplate('vehicle_upload_template.csv')}
            >
              Download Template
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Select CSV File
            </Button>
          </div>

          {isUploading && (
            <Progress value={progress} className="w-full" />
          )}

          <ValidationErrorsTable errors={validationErrors} />
          <ValidatedDataTable vehicles={validatedData} />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                resetState();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || validatedData.length === 0}
            >
              Upload {validatedData.length} Vehicles
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
