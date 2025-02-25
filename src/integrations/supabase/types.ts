export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dealerships: {
        Row: {
          address: Json
          contact_info: Json
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          address: Json
          contact_info: Json
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          address?: Json
          contact_info?: Json
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealerships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          coordinates: Json
          created_at: string
          driver_id: string
          id: string
          job_id: string | null
        }
        Insert: {
          coordinates: Json
          created_at?: string
          driver_id: string
          id?: string
          job_id?: string | null
        }
        Update: {
          coordinates?: Json
          created_at?: string
          driver_id?: string
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          capacity: number
          created_at: string
          id: string
          last_maintenance_date: string | null
          license_plate: string | null
          make: string | null
          model: string | null
          next_maintenance_date: string | null
          organization_id: string
          status: string
          updated_at: string
          vehicle_type: string
          vin: string | null
          year: number | null
        }
        Insert: {
          capacity: number
          created_at?: string
          id?: string
          last_maintenance_date?: string | null
          license_plate?: string | null
          make?: string | null
          model?: string | null
          next_maintenance_date?: string | null
          organization_id: string
          status?: string
          updated_at?: string
          vehicle_type: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          last_maintenance_date?: string | null
          license_plate?: string | null
          make?: string | null
          model?: string | null
          next_maintenance_date?: string | null
          organization_id?: string
          status?: string
          updated_at?: string
          vehicle_type?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_checklist_items: {
        Row: {
          category: string
          created_at: string | null
          id: string
          inspection_id: string
          item_name: string
          notes: string | null
          photos: string[] | null
          status: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          inspection_id: string
          item_name: string
          notes?: string | null
          photos?: string[] | null
          status: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          inspection_id?: string
          item_name?: string
          notes?: string | null
          photos?: string[] | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_checklist_items_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "vehicle_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_locations: {
        Row: {
          address: Json
          capacity: number | null
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          address: Json
          capacity?: number | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          address?: Json
          capacity?: number | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_vehicles: {
        Row: {
          auction_date: string | null
          color: string | null
          condition: Database["public"]["Enums"]["vehicle_condition"] | null
          created_at: string
          damage_report: Json | null
          id: string
          inspection_date: string | null
          listing_price: number | null
          location_id: string | null
          make: string
          metadata: Json | null
          mileage: number | null
          model: string
          notes: string | null
          organization_id: string
          photos: string[] | null
          purchase_price: number | null
          service_history: Json | null
          status: Database["public"]["Enums"]["inventory_status"] | null
          trim: string | null
          updated_at: string
          vin: string
          year: number
        }
        Insert: {
          auction_date?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["vehicle_condition"] | null
          created_at?: string
          damage_report?: Json | null
          id?: string
          inspection_date?: string | null
          listing_price?: number | null
          location_id?: string | null
          make: string
          metadata?: Json | null
          mileage?: number | null
          model: string
          notes?: string | null
          organization_id: string
          photos?: string[] | null
          purchase_price?: number | null
          service_history?: Json | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          trim?: string | null
          updated_at?: string
          vin: string
          year: number
        }
        Update: {
          auction_date?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["vehicle_condition"] | null
          created_at?: string
          damage_report?: Json | null
          id?: string
          inspection_date?: string | null
          listing_price?: number | null
          location_id?: string | null
          make?: string
          metadata?: Json | null
          mileage?: number | null
          model?: string
          notes?: string | null
          organization_id?: string
          photos?: string[] | null
          purchase_price?: number | null
          service_history?: Json | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          trim?: string | null
          updated_at?: string
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_vehicles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issued_date: string
          items: Json
          organization_id: string
          paid_date: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issued_date?: string
          items?: Json
          organization_id: string
          paid_date?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_date?: string
          items?: Json
          organization_id?: string
          paid_date?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          accounting_settings: Json | null
          billing_details: Json | null
          billing_settings: Json | null
          created_at: string
          id: string
          name: string
          settings: Json | null
          subscription_status: string
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          accounting_settings?: Json | null
          billing_details?: Json | null
          billing_settings?: Json | null
          created_at?: string
          id?: string
          name: string
          settings?: Json | null
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
        }
        Update: {
          accounting_settings?: Json | null
          billing_details?: Json | null
          billing_settings?: Json | null
          created_at?: string
          id?: string
          name?: string
          settings?: Json | null
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          job_id: string
          metadata: Json | null
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          organization_id: string
          processed_at: string | null
          reference_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          job_id: string
          metadata?: Json | null
          method: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          organization_id: string
          processed_at?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          job_id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          organization_id?: string
          processed_at?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          notification_preferences: Json | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: string
          subscription: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subscription: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subscription?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tow_jobs: {
        Row: {
          charge_amount: number | null
          completed_at: string | null
          created_at: string
          customer_id: string | null
          delivery_location: Json | null
          description: string | null
          dispatcher_id: string | null
          driver_id: string | null
          driver_notes: string | null
          eta: number | null
          id: string
          mileage: number | null
          notes: string | null
          organization_id: string
          payment_status: string | null
          photos: string[] | null
          pickup_location: Json
          priority: number | null
          scheduled_time: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          signature_url: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          charge_amount?: number | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_location?: Json | null
          description?: string | null
          dispatcher_id?: string | null
          driver_id?: string | null
          driver_notes?: string | null
          eta?: number | null
          id?: string
          mileage?: number | null
          notes?: string | null
          organization_id: string
          payment_status?: string | null
          photos?: string[] | null
          pickup_location: Json
          priority?: number | null
          scheduled_time?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          signature_url?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          charge_amount?: number | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          delivery_location?: Json | null
          description?: string | null
          dispatcher_id?: string | null
          driver_id?: string | null
          driver_notes?: string | null
          eta?: number | null
          id?: string
          mileage?: number | null
          notes?: string | null
          organization_id?: string
          payment_status?: string | null
          photos?: string[] | null
          pickup_location?: Json
          priority?: number | null
          scheduled_time?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          signature_url?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tow_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_condition_logs: {
        Row: {
          condition: Database["public"]["Enums"]["vehicle_condition"]
          created_at: string
          id: string
          inspector_id: string | null
          notes: string | null
          photos: string[] | null
          vehicle_id: string
        }
        Insert: {
          condition: Database["public"]["Enums"]["vehicle_condition"]
          created_at?: string
          id?: string
          inspector_id?: string | null
          notes?: string | null
          photos?: string[] | null
          vehicle_id: string
        }
        Update: {
          condition?: Database["public"]["Enums"]["vehicle_condition"]
          created_at?: string
          id?: string
          inspector_id?: string | null
          notes?: string | null
          photos?: string[] | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_condition_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_inspections: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          inspection_data: Json | null
          inspection_date: string | null
          inspector_id: string
          notes: string | null
          photos: string[] | null
          status: Database["public"]["Enums"]["inspection_status"] | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          inspection_data?: Json | null
          inspection_date?: string | null
          inspector_id: string
          notes?: string | null
          photos?: string[] | null
          status?: Database["public"]["Enums"]["inspection_status"] | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          inspection_data?: Json | null
          inspection_date?: string | null
          inspector_id?: string
          notes?: string | null
          photos?: string[] | null
          status?: Database["public"]["Enums"]["inspection_status"] | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_inspections_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles_in_transit: {
        Row: {
          created_at: string
          delivery_confirmation: string | null
          delivery_status: string
          id: string
          job_id: string
          make: string
          model: string
          pickup_confirmation: string | null
          pickup_status: string
          updated_at: string
          vin: string
          year: number | null
        }
        Insert: {
          created_at?: string
          delivery_confirmation?: string | null
          delivery_status?: string
          id?: string
          job_id: string
          make: string
          model: string
          pickup_confirmation?: string | null
          pickup_status?: string
          updated_at?: string
          vin: string
          year?: number | null
        }
        Update: {
          created_at?: string
          delivery_confirmation?: string | null
          delivery_status?: string
          id?: string
          job_id?: string
          make?: string
          model?: string
          pickup_confirmation?: string | null
          pickup_status?: string
          updated_at?: string
          vin?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_in_transit_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_org_admin: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "dispatcher"
        | "provider"
        | "consumer"
        | "dealer"
        | "wholesaler"
      inspection_status: "pending" | "in_progress" | "completed" | "failed"
      inventory_status:
        | "available"
        | "pending_inspection"
        | "in_transit"
        | "sold"
        | "auction_ready"
        | "maintenance"
      job_status:
        | "pending"
        | "assigned"
        | "en_route"
        | "on_site"
        | "completed"
        | "cancelled"
      payment_method:
        | "cash"
        | "credit_card"
        | "check"
        | "insurance"
        | "motor_club"
      service_type:
        | "tow"
        | "jumpstart"
        | "lockout"
        | "fuel_delivery"
        | "tire_change"
        | "winch_out"
        | "transport"
      vehicle_condition:
        | "excellent"
        | "good"
        | "fair"
        | "poor"
        | "damaged"
        | "salvage"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
