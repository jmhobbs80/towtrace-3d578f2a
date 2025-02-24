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
      admin_profiles: {
        Row: {
          created_at: string
          id: string
          super_admin: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          super_admin?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          super_admin?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          driver_id: string
          heading: number | null
          id: string
          location: Json
          organization_id: string
          speed: number | null
          timestamp: string
        }
        Insert: {
          accuracy?: number | null
          driver_id: string
          heading?: number | null
          id?: string
          location: Json
          organization_id: string
          speed?: number | null
          timestamp?: string
        }
        Update: {
          accuracy?: number | null
          driver_id?: string
          heading?: number | null
          id?: string
          location?: Json
          organization_id?: string
          speed?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          job_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          job_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          job_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          driver_id: string | null
          dropoff_location: string | null
          id: number
          pickup_location: string | null
          status: string | null
          tenant_id: string
          vin: string
        }
        Insert: {
          created_at?: string
          driver_id?: string | null
          dropoff_location?: string | null
          id?: number
          pickup_location?: string | null
          status?: string | null
          tenant_id: string
          vin: string
        }
        Update: {
          created_at?: string
          driver_id?: string | null
          dropoff_location?: string | null
          id?: number
          pickup_location?: string | null
          status?: string | null
          tenant_id?: string
          vin?: string
        }
        Relationships: []
      }
      motor_club_invoices: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          motor_club_reference: string | null
          organization_id: string
          paid_at: string | null
          quickbooks_invoice_id: string | null
          status: string
          submitted_at: string | null
          synced_at: string | null
          tow_request_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          motor_club_reference?: string | null
          organization_id: string
          paid_at?: string | null
          quickbooks_invoice_id?: string | null
          status?: string
          submitted_at?: string | null
          synced_at?: string | null
          tow_request_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          motor_club_reference?: string | null
          organization_id?: string
          paid_at?: string | null
          quickbooks_invoice_id?: string | null
          status?: string
          submitted_at?: string | null
          synced_at?: string | null
          tow_request_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motor_club_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motor_club_invoices_tow_request_id_fkey"
            columns: ["tow_request_id"]
            isOneToOne: false
            referencedRelation: "tow_requests"
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
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          company_name: string
          current_location: Json | null
          id: string
          organization_id: string | null
          phone_number: string
          service_area: Json
          status: string | null
          user_id: string
          vehicle_details: Json
        }
        Insert: {
          company_name: string
          current_location?: Json | null
          id?: string
          organization_id?: string | null
          phone_number: string
          service_area: Json
          status?: string | null
          user_id: string
          vehicle_details: Json
        }
        Update: {
          company_name?: string
          current_location?: Json | null
          id?: string
          organization_id?: string | null
          phone_number?: string
          service_area?: Json
          status?: string | null
          user_id?: string
          vehicle_details?: Json
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_trips: {
        Row: {
          created_at: string | null
          distance_miles: number | null
          end_location: Json | null
          end_time: string | null
          id: string
          organization_id: string | null
          provider_id: string
          quickbooks_invoice_id: string | null
          start_location: Json
          start_time: string
          status: string | null
          tow_request_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          distance_miles?: number | null
          end_location?: Json | null
          end_time?: string | null
          id?: string
          organization_id?: string | null
          provider_id: string
          quickbooks_invoice_id?: string | null
          start_location: Json
          start_time?: string
          status?: string | null
          tow_request_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          distance_miles?: number | null
          end_location?: Json | null
          end_time?: string | null
          id?: string
          organization_id?: string | null
          provider_id?: string
          quickbooks_invoice_id?: string | null
          start_location?: Json
          start_time?: string
          status?: string | null
          tow_request_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_trips_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_trips_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_trips_tow_request_id_fkey"
            columns: ["tow_request_id"]
            isOneToOne: false
            referencedRelation: "tow_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quickbooks_settings: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          organization_id: string
          realm_id: string | null
          refresh_token: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          organization_id: string
          realm_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          organization_id?: string
          realm_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quickbooks_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      route_schedules: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          provider_id: string | null
          scheduled_time: string
          status: string | null
          tow_request_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          provider_id?: string | null
          scheduled_time: string
          status?: string | null
          tow_request_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          provider_id?: string | null
          scheduled_time?: string
          status?: string | null
          tow_request_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_schedules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_schedules_tow_request_id_fkey"
            columns: ["tow_request_id"]
            isOneToOne: false
            referencedRelation: "tow_requests"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "tow_jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tow_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tow_jobs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tow_requests: {
        Row: {
          amount: number | null
          assigned_at: string | null
          billing_status: string | null
          completed_at: string | null
          created_at: string
          customer_feedback: Json | null
          customer_notes: string | null
          description: string | null
          driver_checkin: Json | null
          equipment_check: Json | null
          estimated_arrival: string | null
          id: string
          last_status_change: string | null
          location: Json
          organization_id: string | null
          priority_level: string | null
          provider_id: string | null
          service_type: string | null
          status: string | null
          tags: string[] | null
          time_window: Json | null
          user_id: string
          vehicle_photos: string[] | null
        }
        Insert: {
          amount?: number | null
          assigned_at?: string | null
          billing_status?: string | null
          completed_at?: string | null
          created_at?: string
          customer_feedback?: Json | null
          customer_notes?: string | null
          description?: string | null
          driver_checkin?: Json | null
          equipment_check?: Json | null
          estimated_arrival?: string | null
          id?: string
          last_status_change?: string | null
          location: Json
          organization_id?: string | null
          priority_level?: string | null
          provider_id?: string | null
          service_type?: string | null
          status?: string | null
          tags?: string[] | null
          time_window?: Json | null
          user_id: string
          vehicle_photos?: string[] | null
        }
        Update: {
          amount?: number | null
          assigned_at?: string | null
          billing_status?: string | null
          completed_at?: string | null
          created_at?: string
          customer_feedback?: Json | null
          customer_notes?: string | null
          description?: string | null
          driver_checkin?: Json | null
          equipment_check?: Json | null
          estimated_arrival?: string | null
          id?: string
          last_status_change?: string | null
          location?: Json
          organization_id?: string | null
          priority_level?: string | null
          provider_id?: string | null
          service_type?: string | null
          status?: string | null
          tags?: string[] | null
          time_window?: Json | null
          user_id?: string
          vehicle_photos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_provider_profile"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tow_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_routes: {
        Row: {
          actual_distance: number | null
          actual_duration: number | null
          completed_at: string | null
          created_at: string
          estimated_distance: number | null
          estimated_duration: number | null
          id: string
          organization_id: string
          provider_id: string | null
          route_points: Json
          status: string
          updated_at: string
        }
        Insert: {
          actual_distance?: number | null
          actual_duration?: number | null
          completed_at?: string | null
          created_at?: string
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          organization_id: string
          provider_id?: string | null
          route_points: Json
          status?: string
          updated_at?: string
        }
        Update: {
          actual_distance?: number | null
          actual_duration?: number | null
          completed_at?: string | null
          created_at?: string
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          organization_id?: string
          provider_id?: string | null
          route_points?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_routes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_routes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
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
      vehicles: {
        Row: {
          created_at: string
          id: string
          last_maintenance_date: string | null
          license_plate: string
          maintenance_history: Json | null
          make: string
          mileage: number | null
          model: string
          next_maintenance_date: string | null
          organization_id: string
          status: string
          type: string
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_maintenance_date?: string | null
          license_plate: string
          maintenance_history?: Json | null
          make: string
          mileage?: number | null
          model: string
          next_maintenance_date?: string | null
          organization_id: string
          status?: string
          type: string
          updated_at?: string
          vin?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          last_maintenance_date?: string | null
          license_plate?: string
          maintenance_history?: Json | null
          make?: string
          mileage?: number | null
          model?: string
          next_maintenance_date?: string | null
          organization_id?: string
          status?: string
          type?: string
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "dispatcher" | "provider" | "consumer"
      job_status:
        | "pending"
        | "assigned"
        | "en_route"
        | "on_site"
        | "completed"
        | "cancelled"
      service_type:
        | "tow"
        | "jumpstart"
        | "lockout"
        | "fuel_delivery"
        | "tire_change"
        | "winch_out"
        | "transport"
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
