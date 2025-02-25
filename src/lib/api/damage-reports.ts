
import { supabase } from "@/integrations/supabase/client";
import type { CreateDamageReport, DamageReport } from './vehicle-types';

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
