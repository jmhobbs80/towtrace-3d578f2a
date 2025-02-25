
import { supabase } from "@/integrations/supabase/client";
import type {
  RepairFacility,
  RepairOrder,
  RepairItem,
  CreateRepairFacilityParams,
  CreateRepairOrderParams,
  CreateRepairItemParams,
  UpdateRepairItemParams,
} from "../types/repair";

export async function getRepairFacilities(): Promise<RepairFacility[]> {
  const { data, error } = await supabase
    .from('repair_facilities')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createRepairFacility(params: CreateRepairFacilityParams): Promise<RepairFacility> {
  const { data, error } = await supabase
    .from('repair_facilities')
    .insert(params)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRepairOrders(vehicleId?: string): Promise<RepairOrder[]> {
  let query = supabase
    .from('repair_orders')
    .select(`
      *,
      facility:repair_facilities(name, address),
      items:repair_items(*)
    `);

  if (vehicleId) {
    query = query.eq('vehicle_id', vehicleId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createRepairOrder(params: CreateRepairOrderParams): Promise<RepairOrder> {
  const { data, error } = await supabase
    .from('repair_orders')
    .insert(params)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRepairOrderStatus(
  orderId: string,
  status: RepairItem["status"],
  actual_completion_date?: string
): Promise<RepairOrder> {
  const updates: Partial<RepairOrder> = { 
    status,
    ...(actual_completion_date ? { actual_completion_date } : {})
  };

  const { data, error } = await supabase
    .from('repair_orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createRepairItem(params: CreateRepairItemParams): Promise<RepairItem> {
  const { data, error } = await supabase
    .from('repair_items')
    .insert(params)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRepairItem(params: UpdateRepairItemParams): Promise<RepairItem> {
  const { id, ...updates } = params;
  const { data, error } = await supabase
    .from('repair_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadRepairPhotos(itemId: string, files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `repair-items/${itemId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('repair-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('repair-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
}

export async function getRepairStats(organizationId: string): Promise<{
  totalOrders: number;
  completedOrders: number;
  averageCost: number;
  totalCost: number;
}> {
  const { data, error } = await supabase
    .rpc('get_repair_stats', { org_id: organizationId });

  if (error) throw error;
  return data;
}
