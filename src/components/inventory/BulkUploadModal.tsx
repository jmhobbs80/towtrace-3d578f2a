
import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateVIN } from '@/lib/api/vin-validator';
import { downloadTemplate } from '@/lib/utils';
import type { Database } from "@/integrations/supabase/types";

type InventoryStatus = Database['public']['Enums']['inventory_status'];

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locationId?: string;
  organizationId: string; // Added organizationId as a required prop
}

interface VehicleData {
  vin: string;
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  status?: InventoryStatus;
  location?: string;
}

interface ValidationError {
  row: number;
  vin: string;
  error: string;
}

export function BulkUploadModal({ 
  open, 
  onClose, 
  onSuccess, 
  locationId,
  organizationId 
}: BulkUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validatedData, setValidatedData] = useState<VehicleData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = () => {
    setIsUploading(false);
    setProgress(0);
    setValidationErrors([]);
    setValidatedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

        for (const [index, row] of results.data.entries()) {
          const vehicle = row as VehicleData;
          processedCount++;
          setProgress((processedCount / results.data.length) * 100);

          // Validate VIN
          if (!vehicle.vin || !validateVIN(vehicle.vin)) {
            errors.push({
              row: index + 2, // +2 because of header row and 0-based index
              vin: vehicle.vin || 'Missing',
              error: 'Invalid VIN',
            });
            continue;
          }

          // Check for required fields
          if (!vehicle.make || !vehicle.model || !vehicle.year) {
            errors.push({
              row: index + 2,
              vin: vehicle.vin,
              error: 'Missing required fields (make, model, or year)',
            });
            continue;
          }

          validData.push(vehicle);
        }

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

  const handleDownloadTemplate = () => {
    downloadTemplate([
      'vin,make,model,year,color,status,location',
      'SAMPLE1234567890,Toyota,Camry,2023,Silver,available,Lot A',
    ].join('\n'), 'vehicle_upload_template.csv');
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
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
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

          {validationErrors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-destructive">
                Validation Errors ({validationErrors.length})
              </h3>
              <div className="max-h-40 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationErrors.map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>{error.row}</TableCell>
                        <TableCell>{error.vin}</TableCell>
                        <TableCell>{error.error}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {validatedData.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-600">
                Valid Entries ({validatedData.length})
              </h3>
              <div className="max-h-40 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validatedData.map((vehicle, index) => (
                      <TableRow key={index}>
                        <TableCell>{vehicle.vin}</TableCell>
                        <TableCell>{vehicle.make}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

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
