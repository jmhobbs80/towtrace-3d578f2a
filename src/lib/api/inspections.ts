import { supabase } from "@/integrations/supabase/client";
import type { VehicleInspection, InspectionChecklistItem, UpdateInspectionStatusParams, InspectionType } from "../types/inspection";

export async function createInspection(
  vehicleId: string,
  inspectionType: InspectionType,
  assignmentId?: string
): Promise<VehicleInspection> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .insert({
      vehicle_id: vehicleId,
      inspector_id: userData.user.id,
      status: 'pending',
      inspection_type: inspectionType,
      assignment_id: assignmentId,
      inspection_data: {}
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    inspection_data: data.inspection_data as Record<string, any>
  };
}

export async function updateInspectionStatus(
  params: UpdateInspectionStatusParams
): Promise<void> {
  const { inspectionId, status } = params;
  const { error } = await supabase
    .from('vehicle_inspections')
    .update({ status })
    .eq('id', inspectionId);

  if (error) throw error;
}

export async function addChecklistItem(item: Omit<InspectionChecklistItem, 'id' | 'created_at' | 'updated_at'>): Promise<InspectionChecklistItem> {
  const { data, error } = await supabase
    .from('inspection_checklist_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as InspectionChecklistItem;
}

export async function getInspectionDetails(inspectionId: string): Promise<{
  inspection: VehicleInspection;
  checklistItems: InspectionChecklistItem[];
}> {
  const [inspectionResult, checklistResult] = await Promise.all([
    supabase
      .from('vehicle_inspections')
      .select('*')
      .eq('id', inspectionId)
      .single(),
    supabase
      .from('inspection_checklist_items')
      .select('*')
      .eq('inspection_id', inspectionId)
  ]);

  if (inspectionResult.error) throw inspectionResult.error;
  if (checklistResult.error) throw checklistResult.error;

  return {
    inspection: {
      ...inspectionResult.data,
      inspection_data: inspectionResult.data.inspection_data as Record<string, any>
    },
    checklistItems: checklistResult.data as InspectionChecklistItem[]
  };
}

export async function uploadInspectionPhoto(
  inspectionId: string,
  file: File
): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const fileExt = file.name.split('.').pop();
  const fileName = `${inspectionId}/${Date.now()}.${fileExt}`;
  const filePath = `inspection-photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('vehicle-inspections')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage
    .from('vehicle-inspections')
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}

export async function updateChecklistItemWithPhotos(
  itemId: string,
  files: File[]
): Promise<void> {
  const photoUrls = await Promise.all(
    files.map(file => uploadInspectionPhoto(itemId, file))
  );

  const { error } = await supabase
    .from('inspection_checklist_items')
    .update({ photos: photoUrls })
    .eq('id', itemId);

  if (error) throw error;
}

export async function updateChecklistItem(
  itemId: string,
  updates: Partial<Omit<InspectionChecklistItem, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('inspection_checklist_items')
    .update(updates)
    .eq('id', itemId);

  if (error) throw error;
}

export async function getInspectionHistory(vehicleId?: string): Promise<VehicleInspection[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  let query = supabase
    .from('vehicle_inspections')
    .select('*')
    .order('created_at', { ascending: false });

  if (vehicleId) {
    query = query.eq('vehicle_id', vehicleId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map(inspection => ({
    ...inspection,
    inspection_data: inspection.inspection_data as Record<string, any>
  }));
}
