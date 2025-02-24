
export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface InspectionChecklistItem {
  id: string;
  inspection_id: string;
  category: string;
  item_name: string;
  status: 'pass' | 'fail' | 'needs_repair';
  notes?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface VehicleInspection {
  id: string;
  vehicle_id: string;
  inspector_id: string;
  status: InspectionStatus;
  inspection_date: string;
  completed_at?: string;
  inspection_data: Record<string, any>;
  photos?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateInspectionStatusParams {
  inspectionId: string;
  status: InspectionStatus;
}
