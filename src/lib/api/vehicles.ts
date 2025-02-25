import { BluetoothVINScanner } from './scanners/bluetooth-scanner';
import { WebcamVINScanner } from './scanners/webcam-scanner';
import { supabase } from "@/integrations/supabase/client";
import type { VINScannerHardware } from './scanner-types';
import type { Json } from '@/integrations/supabase/types';

export type VehicleDamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';

export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'salvage';

export interface DamageReport {
  damage_locations: Json;
  severity: VehicleDamageSeverity;
  description?: string;
  photos?: string[];
  repair_estimate?: number;
}

// Re-export scanner types
export type { VINScannerHardware };

// VIN Scanner Core Functions
export async function createVINScanner(): Promise<VINScannerHardware> {
  // Try Bluetooth scanner first (for dedicated hardware)
  const bluetoothScanner = new BluetoothVINScanner();
  if (await bluetoothScanner.isAvailable()) {
    console.log('Using Bluetooth VIN scanner');
    return bluetoothScanner;
  }

  // Fall back to webcam scanning
  const webcamScanner = new WebcamVINScanner();
  if (await webcamScanner.isAvailable()) {
    console.log('Using webcam VIN scanner');
    return webcamScanner;
  }

  throw new Error('No VIN scanner hardware available');
}

export function validateVIN(vin: string): boolean {
  // Validate the VIN
  return vin.length === 17 && /^[A-HJ-NP-TV-Z0-9]{17}$/.test(vin);
}

export async function decodeVIN(vin: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('decode-vin', {
      body: { vin }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('VIN decode error:', error);
    throw error;
  }
}

// Vehicle Management Functions
export async function getVehicles(organizationId: string) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .select(`
      *,
      location:inventory_locations(name, address),
      condition_logs:vehicle_condition_logs(*),
      inspections:vehicle_inspections(*)
    `)
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data;
}

export async function getVehicleDetails(vehicleId: string) {
  // First get the vehicle details with basic related data
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('inventory_vehicles')
    .select(`
      *,
      location:inventory_locations(name, address)
    `)
    .eq('id', vehicleId)
    .single();

  if (vehicleError) throw vehicleError;

  // Get damage reports separately
  const { data: damageReports, error: damageError } = await supabase
    .from('vehicle_damage_reports')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (damageError) throw damageError;

  // Get transit history separately
  const { data: transitHistory, error: transitError } = await supabase
    .from('vehicles_in_transit')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (transitError) throw transitError;

  // Combine all data
  return {
    ...vehicleData,
    damage_reports: damageReports || [],
    transit_history: transitHistory || []
  };
}

export async function updateVehicleStatus(
  vehicleId: string, 
  status: string,
  condition?: VehicleCondition
) {
  const updates: Record<string, any> = { status };
  if (condition) updates.condition = condition;

  const { data, error } = await supabase
    .from('inventory_vehicles')
    .update(updates)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createDamageReport(vehicleId: string, report: DamageReport) {
  const { data, error } = await supabase
    .from('vehicle_damage_reports')
    .insert({
      vehicle_id: vehicleId,
      inspector_id: (await supabase.auth.getUser()).data.user?.id,
      damage_locations: report.damage_locations,
      severity: report.severity,
      description: report.description,
      photos: report.photos,
      repair_estimate: report.repair_estimate
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadVehiclePhotos(
  vehicleId: string,
  files: File[]
): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${vehicleId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('vehicle-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
}

// Scanner Helper Functions
export async function scanAndValidateVIN(): Promise<{ 
  vin: string; 
  isValid: boolean;
  decodedInfo?: any;
}> {
  try {
    const scanner = await createVINScanner();
    const scannedVIN = await scanner.startScanning();
    
    await scanner.stopScanning();
    const isValid = validateVIN(scannedVIN);
    
    if (!isValid) {
      throw new Error('Invalid VIN detected');
    }

    const decodedInfo = await decodeVIN(scannedVIN);

    return {
      vin: scannedVIN,
      isValid: true,
      decodedInfo
    };
  } catch (error) {
    console.error('VIN scanning error:', error);
    throw error;
  }
}
