export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export type InspectionType = 'pre_trip' | 'post_trip';

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
  inspection_type: InspectionType;
  assignment_id: string | null;
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

export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'general' | 'mechanical' | 'body' | 'safety';
  checklist_items: Array<{
    item_name: string;
    category: string;
    required: boolean;
  }>;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export type CreateInspectionTemplateInput = Omit<InspectionTemplate, 'id' | 'created_at' | 'updated_at'>;
