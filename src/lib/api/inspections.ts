
import { supabase } from "@/integrations/supabase/client";
import type { VehicleInspection, InspectionChecklistItem } from "../types/inspection";

export async function createInspection(vehicleId: string): Promise<VehicleInspection> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .insert({
      vehicle_id: vehicleId,
      inspector_id: userData.user.id,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInspectionStatus(
  inspectionId: string, 
  status: VehicleInspection['status']
): Promise<void> {
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
  return data;
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
    inspection: inspectionResult.data,
    checklistItems: checklistResult.data
  };
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
