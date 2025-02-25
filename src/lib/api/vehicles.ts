
import { BluetoothVINScanner } from './scanners/bluetooth-scanner';
import { WebcamVINScanner } from './scanners/webcam-scanner';
import { supabase } from "@/integrations/supabase/client";
import type { VINScannerHardware } from './scanner-types';
import type { Json } from '@/integrations/supabase/types';

export type { VINScannerHardware };

export type VehicleDamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'salvage';

export interface CreateDamageReport {
  severity: VehicleDamageSeverity;
  description?: string;
  repair_estimate?: number;
  damage_locations: Json;
  photos: string[];
}

export interface DamageReport extends CreateDamageReport {
  id: string;
  vehicle_id: string;
  inspector_id: string;
  created_at: string;
  updated_at: string;
}

export interface TransitRecord {
  id: string;
  status: string;
  pickup_date: string;
  delivery_date?: string;
  vehicle_id: string;
}

export interface VehicleLocation {
  name: string;
  address: Json;
}

interface VehicleTransitData {
  id: string;
  delivery_status: string;
  pickup_status: string;
  pickup_confirmation: string | null;
  delivery_confirmation: string | null;
  created_at: string;
  make: string;
  model: string;
}

async function createVINScanner(): Promise<VINScannerHardware> {
  const bluetoothScanner = new BluetoothVINScanner();
  if (await bluetoothScanner.isAvailable()) {
    console.log('Using Bluetooth VIN scanner');
    return bluetoothScanner;
  }

  const webcamScanner = new WebcamVINScanner();
  if (await webcamScanner.isAvailable()) {
    console.log('Using webcam VIN scanner');
    return webcamScanner;
  }

  throw new Error('No VIN scanner hardware available');
}

function validateVIN(vin: string): boolean {
  return vin.length === 17 && /^[A-HJ-NP-TV-Z0-9]{17}$/.test(vin);
}

async function decodeVIN(vin: string): Promise<any> {
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

export async function getVehicles(organizationId: string) {
  const { data, error } = await supabase
    .from('inventory_vehicles')
    .select('*, location:inventory_locations(name, address), condition_logs:vehicle_condition_logs(*), inspections:vehicle_inspections(*)')
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data;
}

export async function getVehicleDetails(vehicleId: string) {
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('inventory_vehicles')
    .select('*, location:inventory_locations(name, address)')
    .eq('id', vehicleId)
    .single();

  if (vehicleError) throw vehicleError;

  const { data: damageReports, error: damageError } = await supabase
    .from('vehicle_damage_reports')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (damageError) throw damageError;

  const { data: conditionLogs, error: conditionError } = await supabase
    .from('vehicle_condition_logs')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (conditionError) throw conditionError;

  const { data: inspections, error: inspectionError } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (inspectionError) throw inspectionError;

  const { data: transitData, error: transitError } = await supabase
    .from('vehicles_in_transit')
    .select('id, make, model, delivery_status, pickup_status, pickup_confirmation, delivery_confirmation, created_at')
    .eq('vin', vehicleData.vin);

  if (transitError) throw transitError;

  const transitHistory: TransitRecord[] = (transitData || []).map((record: VehicleTransitData) => ({
    id: record.id,
    status: record.delivery_status || record.pickup_status,
    pickup_date: record.pickup_confirmation || record.created_at,
    delivery_date: record.delivery_confirmation || undefined,
    vehicle_id: vehicleId
  }));

  return {
    ...vehicleData,
    damage_reports: damageReports || [],
    condition_logs: conditionLogs || [],
    inspections: inspections || [],
    transit_history: transitHistory
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

export async function createDamageReport(vehicleId: string, report: CreateDamageReport): Promise<DamageReport> {
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
