
import { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateVIN } from '@/lib/api/vin-validator';
import type { ValidationError, VehicleData, InventoryStatus } from "./types";

interface UseBulkUploadProps {
  organizationId: string;
  locationId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function useBulkUpload({ 
  organizationId, 
  locationId, 
  onSuccess, 
  onClose 
}: UseBulkUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validatedData, setValidatedData] = useState<VehicleData[]>([]);
  const { toast } = useToast();

  const resetState = () => {
    setIsUploading(false);
    setProgress(0);
    setValidationErrors([]);
    setValidatedData([]);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setValidationErrors([]);
    setValidatedData([]);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const errors: ValidationError[] = [];
        const validData: VehicleData[] = [];
        let processedCount = 0;

        if (!Array.isArray(results.data)) {
          toast({
            variant: "destructive",
            title: "Upload Error",
            description: "Invalid CSV format. Please check the file structure.",
          });
          setIsUploading(false);
          return;
        }

        results.data.forEach((row: any, index: number) => {
          const vehicle = row as VehicleData;
          processedCount++;
          setProgress((processedCount / results.data.length) * 100);

          const rowNumber = index + 2;

          if (!vehicle.vin || !validateVIN(vehicle.vin)) {
            errors.push({
              row: rowNumber,
              vin: vehicle.vin || 'Missing',
              error: !vehicle.vin ? 'Missing VIN' : 'Invalid VIN',
            });
            return;
          }

          if (!vehicle.make || !vehicle.model || !vehicle.year) {
            errors.push({
              row: rowNumber,
              vin: vehicle.vin,
              error: 'Missing required fields (make, model, or year)',
            });
            return;
          }

          validData.push(vehicle);
        });

        setValidationErrors(errors);
        setValidatedData(validData);
        setIsUploading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: "Failed to parse the CSV file. Please check the file format.",
        });
        setIsUploading(false);
      },
    });
  };

  const handleSubmit = async () => {
    if (validatedData.length === 0) return;

    setIsUploading(true);
    let processedCount = 0;

    try {
      for (const vehicle of validatedData) {
        const { error } = await supabase
          .from('inventory_vehicles')
          .insert({
            organization_id: organizationId,
            vin: vehicle.vin,
            make: vehicle.make || '',
            model: vehicle.model || '',
            year: parseInt(vehicle.year || '0'),
            color: vehicle.color || null,
            status: (vehicle.status as InventoryStatus) || 'pending_inspection',
            location_id: locationId || null
          });

        if (error) throw error;

        processedCount++;
        setProgress((processedCount / validatedData.length) * 100);
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${validatedData.length} vehicles.`,
      });
      onSuccess();
      onClose();
      resetState();
    } catch (error) {
      console.error('Error uploading vehicles:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "Failed to upload vehicles. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    progress,
    validationErrors,
    validatedData,
    handleFileUpload,
    handleSubmit,
    resetState
  };
}
