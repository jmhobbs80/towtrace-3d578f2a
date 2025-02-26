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
      admin_audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_state: Json | null
          previous_state: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_state?: Json | null
          previous_state?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_state?: Json | null
          previous_state?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          amount: number
          auction_item_id: string
          bidder_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          amount: number
          auction_item_id: string
          bidder_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          amount?: number
          auction_item_id?: string
          bidder_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_item_id_fkey"
            columns: ["auction_item_id"]
            isOneToOne: false
            referencedRelation: "auction_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_items: {
        Row: {
          auction_id: string
          created_at: string | null
          current_bid: number | null
          current_winner_id: string | null
          id: string
          reserve_price: number | null
          starting_price: number
          status: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          auction_id: string
          created_at?: string | null
          current_bid?: number | null
          current_winner_id?: string | null
          id?: string
          reserve_price?: number | null
          starting_price: number
          status?: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          auction_id?: string
          created_at?: string | null
          current_bid?: number | null
          current_winner_id?: string | null
          id?: string
          reserve_price?: number | null
          starting_price?: number
          status?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_items_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_items_current_winner_id_fkey"
            columns: ["current_winner_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_items_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_results: {
        Row: {
          auction_id: string | null
          buyer_id: string | null
          created_at: string | null
          delivery_status: string | null
          id: string
          payment_status: string | null
          seller_id: string | null
          status: string | null
          transaction_date: string | null
          updated_at: string | null
          vehicle_id: string | null
          winning_bid_amount: number | null
        }
        Insert: {
          auction_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          payment_status?: string | null
          seller_id?: string | null
          status?: string | null
          transaction_date?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          winning_bid_amount?: number | null
        }
        Update: {
          auction_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          payment_status?: string | null
          seller_id?: string | null
          status?: string | null
          transaction_date?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          winning_bid_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_results_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_results_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_results_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_results_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          minimum_participants: number | null
          organization_id: string
          start_time: string
          status: Database["public"]["Enums"]["auction_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          minimum_participants?: number | null
          organization_id: string
          start_time: string
          status?: Database["public"]["Enums"]["auction_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          minimum_participants?: number | null
          organization_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["auction_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_notifications: {
        Row: {
          bid_id: string
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          bid_id: string
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          bid_id?: string
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bid"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "load_bids"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_access_tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          impound_id: string | null
          last_accessed_at: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          impound_id?: string | null
          last_accessed_at?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          impound_id?: string | null
          last_accessed_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_access_tokens_impound_id_fkey"
            columns: ["impound_id"]
            isOneToOne: false
            referencedRelation: "impounded_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_trades: {
        Row: {
          created_at: string | null
          destination_dealer: string | null
          id: string
          notes: string | null
          source_dealer: string
          status: Database["public"]["Enums"]["trade_status"]
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          destination_dealer?: string | null
          id?: string
          notes?: string | null
          source_dealer: string
          status?: Database["public"]["Enums"]["trade_status"]
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          destination_dealer?: string | null
          id?: string
          notes?: string | null
          source_dealer?: string
          status?: Database["public"]["Enums"]["trade_status"]
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_trades_destination_dealer_fkey"
            columns: ["destination_dealer"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_trades_source_dealer_fkey"
            columns: ["source_dealer"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_trades_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      driver_invites: {
        Row: {
          created_at: string
          created_by: string
          email: string | null
          expires_at: string
          id: string
          metadata: Json | null
          organization_id: string
          phone: string | null
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          created_by: string
          email?: string | null
          expires_at?: string
          id?: string
          metadata?: Json | null
          organization_id: string
          phone?: string | null
          status?: string
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string
          email?: string | null
          expires_at?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          phone?: string | null
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_invites_organization_id_fkey"
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
      driver_presence: {
        Row: {
          created_at: string | null
          driver_id: string
          id: string
          last_seen: string | null
          location: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          id?: string
          last_seen?: string | null
          location?: Json | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          id?: string
          last_seen?: string | null
          location?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_toggles: {
        Row: {
          category: Database["public"]["Enums"]["feature_category"]
          created_at: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          metadata: Json | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["feature_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["feature_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
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
      impound_lots: {
        Row: {
          address: Json
          capacity: number | null
          created_at: string | null
          daily_rate: number
          id: string
          late_fee_rate: number
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          address: Json
          capacity?: number | null
          created_at?: string | null
          daily_rate?: number
          id?: string
          late_fee_rate?: number
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          address?: Json
          capacity?: number | null
          created_at?: string | null
          daily_rate?: number
          id?: string
          late_fee_rate?: number
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "impound_lots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      impound_notifications: {
        Row: {
          created_at: string | null
          id: string
          impound_id: string | null
          message: string
          metadata: Json | null
          organization_id: string | null
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          impound_id?: string | null
          message: string
          metadata?: Json | null
          organization_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          impound_id?: string | null
          message?: string
          metadata?: Json | null
          organization_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "impound_notifications_impound_id_fkey"
            columns: ["impound_id"]
            isOneToOne: false
            referencedRelation: "impounded_vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impound_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      impound_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          date_range: unknown
          id: string
          metrics: Json
          organization_id: string | null
          report_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_range: unknown
          id?: string
          metrics?: Json
          organization_id?: string | null
          report_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_range?: unknown
          id?: string
          metrics?: Json
          organization_id?: string | null
          report_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "impound_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      impounded_vehicles: {
        Row: {
          created_at: string | null
          daily_rate: number
          id: string
          impound_date: string
          insurance_claim_number: string | null
          lot_id: string
          metadata: Json | null
          notes: string | null
          organization_id: string
          police_report_number: string | null
          release_authorization_by: string | null
          release_authorization_date: string | null
          release_date: string | null
          status: Database["public"]["Enums"]["impound_status"]
          total_fees: number
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          daily_rate: number
          id?: string
          impound_date?: string
          insurance_claim_number?: string | null
          lot_id: string
          metadata?: Json | null
          notes?: string | null
          organization_id: string
          police_report_number?: string | null
          release_authorization_by?: string | null
          release_authorization_date?: string | null
          release_date?: string | null
          status?: Database["public"]["Enums"]["impound_status"]
          total_fees?: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          daily_rate?: number
          id?: string
          impound_date?: string
          insurance_claim_number?: string | null
          lot_id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id?: string
          police_report_number?: string | null
          release_authorization_by?: string | null
          release_authorization_date?: string | null
          release_date?: string | null
          status?: Database["public"]["Enums"]["impound_status"]
          total_fees?: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "impounded_vehicles_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "impound_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impounded_vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impounded_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
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
      inspection_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category"]
          checklist_items: Json
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["template_category"]
          checklist_items?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["template_category"]
          checklist_items?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          auction_result_id: string | null
          auction_status: string | null
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
          auction_result_id?: string | null
          auction_status?: string | null
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
          auction_result_id?: string | null
          auction_status?: string | null
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
            foreignKeyName: "inventory_vehicles_auction_result_id_fkey"
            columns: ["auction_result_id"]
            isOneToOne: false
            referencedRelation: "auction_results"
            referencedColumns: ["id"]
          },
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
      job_earnings: {
        Row: {
          created_at: string | null
          fee_percentage: number | null
          fee_type: string
          flat_fee: number | null
          id: string
          job_id: string
          organization_id: string
          platform_fee: number
          provider_amount: number
          status: string
          surge_multiplier: number | null
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          fee_percentage?: number | null
          fee_type: string
          flat_fee?: number | null
          id?: string
          job_id: string
          organization_id: string
          platform_fee: number
          provider_amount: number
          status?: string
          surge_multiplier?: number | null
          total_amount: number
        }
        Update: {
          created_at?: string | null
          fee_percentage?: number | null
          fee_type?: string
          flat_fee?: number | null
          id?: string
          job_id?: string
          organization_id?: string
          platform_fee?: number
          provider_amount?: number
          status?: string
          surge_multiplier?: number | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_earnings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_earnings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      load_bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string
          id: string
          load_id: string
          notes: string | null
          organization_id: string
          proposed_dates: Json | null
          status: Database["public"]["Enums"]["bid_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string
          id?: string
          load_id: string
          notes?: string | null
          organization_id: string
          proposed_dates?: Json | null
          status?: Database["public"]["Enums"]["bid_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string
          id?: string
          load_id?: string
          notes?: string | null
          organization_id?: string
          proposed_dates?: Json | null
          status?: Database["public"]["Enums"]["bid_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "load_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "load_bids_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "load_bids_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loads: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          delivery_date: string
          delivery_location: Json
          description: string | null
          dimensions: Json | null
          id: string
          load_type: Database["public"]["Enums"]["load_type"]
          metadata: Json | null
          organization_id: string
          photos: string[] | null
          pickup_date: string
          pickup_location: Json
          price_range: Json | null
          requirements: Json | null
          status: string
          title: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          delivery_date: string
          delivery_location: Json
          description?: string | null
          dimensions?: Json | null
          id?: string
          load_type?: Database["public"]["Enums"]["load_type"]
          metadata?: Json | null
          organization_id: string
          photos?: string[] | null
          pickup_date: string
          pickup_location: Json
          price_range?: Json | null
          requirements?: Json | null
          status?: string
          title: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          delivery_date?: string
          delivery_location?: Json
          description?: string | null
          dimensions?: Json | null
          id?: string
          load_type?: Database["public"]["Enums"]["load_type"]
          metadata?: Json | null
          organization_id?: string
          photos?: string[] | null
          pickup_date?: string
          pickup_location?: Json
          price_range?: Json | null
          requirements?: Json | null
          status?: string
          title?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          notification_types: string[] | null
          phone_number: string | null
          push_enabled: boolean | null
          sms_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          notification_types?: string[] | null
          phone_number?: string | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          notification_types?: string[] | null
          phone_number?: string | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      offline_sync_queue: {
        Row: {
          action: string
          created_at: string | null
          data: Json | null
          entity_id: string | null
          entity_type: string
          error: string | null
          id: string
          retry_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          data?: Json | null
          entity_id?: string | null
          entity_type: string
          error?: string | null
          id?: string
          retry_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          data?: Json | null
          entity_id?: string | null
          entity_type?: string
          error?: string | null
          id?: string
          retry_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      organization_addons: {
        Row: {
          addon_id: string | null
          created_at: string | null
          id: string
          organization_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          addon_id?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          addon_id?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "subscription_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_addons_organization_id_fkey"
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
      organization_roles: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          organization_id: string | null
          role_type: Database["public"]["Enums"]["organization_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organization_id?: string | null
          role_type: Database["public"]["Enums"]["organization_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          organization_id?: string | null
          role_type?: Database["public"]["Enums"]["organization_type"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_roles_organization_id_fkey"
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
          average_rating: number | null
          billing_details: Json | null
          billing_settings: Json | null
          created_at: string
          id: string
          member_count: number | null
          name: string
          public_pricing_settings: Json | null
          service_area: Json | null
          settings: Json | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_period_end: string | null
          subscription_period_start: string | null
          subscription_plan_id: string | null
          subscription_status: string
          subscription_tier: string
          tow_provider_enabled: boolean | null
          trial_end: string | null
          type: Database["public"]["Enums"]["organization_type"] | null
          updated_at: string
          vehicle_count: number | null
        }
        Insert: {
          accounting_settings?: Json | null
          average_rating?: number | null
          billing_details?: Json | null
          billing_settings?: Json | null
          created_at?: string
          id?: string
          member_count?: number | null
          name: string
          public_pricing_settings?: Json | null
          service_area?: Json | null
          settings?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_period_start?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          tow_provider_enabled?: boolean | null
          trial_end?: string | null
          type?: Database["public"]["Enums"]["organization_type"] | null
          updated_at?: string
          vehicle_count?: number | null
        }
        Update: {
          accounting_settings?: Json | null
          average_rating?: number | null
          billing_details?: Json | null
          billing_settings?: Json | null
          created_at?: string
          id?: string
          member_count?: number | null
          name?: string
          public_pricing_settings?: Json | null
          service_area?: Json | null
          settings?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_period_start?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          tow_provider_enabled?: boolean | null
          trial_end?: string | null
          type?: Database["public"]["Enums"]["organization_type"] | null
          updated_at?: string
          vehicle_count?: number | null
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          created_at: string | null
          id: string
          last_attempted: string | null
          metadata: Json | null
          notification_type: string
          organization_id: string
          payment_id: string
          retry_count: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_attempted?: string | null
          metadata?: Json | null
          notification_type: string
          organization_id: string
          payment_id: string
          retry_count?: number | null
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_attempted?: string | null
          metadata?: Json | null
          notification_type?: string
          organization_id?: string
          payment_id?: string
          retry_count?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      preferred_transporters: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          priority: number | null
          transporter_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          priority?: number | null
          transporter_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          priority?: number | null
          transporter_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preferred_transporters_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferred_transporters_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_email_verification_sent: string | null
          last_name: string | null
          last_seen: string | null
          last_two_factor_verification: string | null
          notification_preferences: Json | null
          phone_number: string | null
          preferences: Json | null
          title: string | null
          two_factor_backup_codes: string[] | null
          two_factor_enabled: boolean | null
          two_factor_recovery_codes: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_email_verification_sent?: string | null
          last_name?: string | null
          last_seen?: string | null
          last_two_factor_verification?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          preferences?: Json | null
          title?: string | null
          two_factor_backup_codes?: string[] | null
          two_factor_enabled?: boolean | null
          two_factor_recovery_codes?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_email_verification_sent?: string | null
          last_name?: string | null
          last_seen?: string | null
          last_two_factor_verification?: string | null
          notification_preferences?: Json | null
          phone_number?: string | null
          preferences?: Json | null
          title?: string | null
          two_factor_backup_codes?: string[] | null
          two_factor_enabled?: boolean | null
          two_factor_recovery_codes?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_code_redemptions: {
        Row: {
          id: string
          metadata: Json | null
          organization_id: string
          promo_code_id: string | null
          redeemed_at: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          organization_id: string
          promo_code_id?: string | null
          redeemed_at?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          organization_id?: string
          promo_code_id?: string | null
          redeemed_at?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          times_used: number | null
          trial_days: number | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          times_used?: number | null
          trial_days?: number | null
          type?: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          times_used?: number | null
          trial_days?: number | null
          type?: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_balances: {
        Row: {
          available_balance: number
          created_at: string | null
          id: string
          last_payout_at: string | null
          organization_id: string
          pending_balance: number
          total_earnings: number
          updated_at: string | null
        }
        Insert: {
          available_balance?: number
          created_at?: string | null
          id?: string
          last_payout_at?: string | null
          organization_id: string
          pending_balance?: number
          total_earnings?: number
          updated_at?: string | null
        }
        Update: {
          available_balance?: number
          created_at?: string | null
          id?: string
          last_payout_at?: string | null
          organization_id?: string
          pending_balance?: number
          total_earnings?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_balances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_payouts: {
        Row: {
          amount: number
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          organization_id: string
          payout_method: string
          processed_at: string | null
          reference_number: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          payout_method: string
          processed_at?: string | null
          reference_number?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          payout_method?: string
          processed_at?: string | null
          reference_number?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_service_rates: {
        Row: {
          base_rate: number
          created_at: string | null
          id: string
          minimum_fee: number | null
          organization_id: string | null
          per_mile_rate: number | null
          service_type: Database["public"]["Enums"]["tow_service_type"]
          updated_at: string | null
        }
        Insert: {
          base_rate?: number
          created_at?: string | null
          id?: string
          minimum_fee?: number | null
          organization_id?: string | null
          per_mile_rate?: number | null
          service_type: Database["public"]["Enums"]["tow_service_type"]
          updated_at?: string | null
        }
        Update: {
          base_rate?: number
          created_at?: string | null
          id?: string
          minimum_fee?: number | null
          organization_id?: string | null
          per_mile_rate?: number | null
          service_type?: Database["public"]["Enums"]["tow_service_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_service_rates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      quickbooks_connections: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          is_connected: boolean | null
          organization_id: string
          realm_id: string
          refresh_token: string
          settings: Json | null
          token_expires_at: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          organization_id: string
          realm_id: string
          refresh_token: string
          settings?: Json | null
          token_expires_at: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          organization_id?: string
          realm_id?: string
          refresh_token?: string
          settings?: Json | null
          token_expires_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quickbooks_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quickbooks_sync_logs: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          error_message: string | null
          id: string
          organization_id: string
          processed_at: string | null
          quickbooks_id: string | null
          retries: number | null
          status: string
          sync_type: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          error_message?: string | null
          id?: string
          organization_id: string
          processed_at?: string | null
          quickbooks_id?: string | null
          retries?: number | null
          status?: string
          sync_type: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          id?: string
          organization_id?: string
          processed_at?: string | null
          quickbooks_id?: string | null
          retries?: number | null
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quickbooks_sync_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      release_checklist_items: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          id: string
          impound_id: string | null
          item_type: string
          notes: string | null
          required: boolean | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          impound_id?: string | null
          item_type: string
          notes?: string | null
          required?: boolean | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          impound_id?: string | null
          item_type?: string
          notes?: string | null
          required?: boolean | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "release_checklist_items_impound_id_fkey"
            columns: ["impound_id"]
            isOneToOne: false
            referencedRelation: "impounded_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_facilities: {
        Row: {
          address: Json
          capacity: number | null
          contact_info: Json | null
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          address: Json
          capacity?: number | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          address?: Json
          capacity?: number | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_facilities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_items: {
        Row: {
          actual_cost: number | null
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          labor_hours: number | null
          notes: string | null
          parts_used: Json | null
          photos: string[] | null
          repair_order_id: string
          status: Database["public"]["Enums"]["repair_item_status"]
          type: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          labor_hours?: number | null
          notes?: string | null
          parts_used?: Json | null
          photos?: string[] | null
          repair_order_id: string
          status?: Database["public"]["Enums"]["repair_item_status"]
          type: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          labor_hours?: number | null
          notes?: string | null
          parts_used?: Json | null
          photos?: string[] | null
          repair_order_id?: string
          status?: Database["public"]["Enums"]["repair_item_status"]
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_items_repair_order_id_fkey"
            columns: ["repair_order_id"]
            isOneToOne: false
            referencedRelation: "repair_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_orders: {
        Row: {
          actual_completion_date: string | null
          created_at: string
          estimated_completion_date: string | null
          facility_id: string
          id: string
          notes: string | null
          organization_id: string
          status: Database["public"]["Enums"]["repair_item_status"]
          total_cost: number | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          actual_completion_date?: string | null
          created_at?: string
          estimated_completion_date?: string | null
          facility_id: string
          id?: string
          notes?: string | null
          organization_id: string
          status?: Database["public"]["Enums"]["repair_item_status"]
          total_cost?: number | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          actual_completion_date?: string | null
          created_at?: string
          estimated_completion_date?: string | null
          facility_id?: string
          id?: string
          notes?: string | null
          organization_id?: string
          status?: Database["public"]["Enums"]["repair_item_status"]
          total_cost?: number | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_orders_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "repair_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "inventory_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_features: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          feature_name: string
          id: string
          is_addon: boolean | null
          organization_type: Database["public"]["Enums"]["organization_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          feature_name: string
          id?: string
          is_addon?: boolean | null
          organization_type: Database["public"]["Enums"]["organization_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          feature_name?: string
          id?: string
          is_addon?: boolean | null
          organization_type?: Database["public"]["Enums"]["organization_type"]
        }
        Relationships: []
      }
      route_optimizations: {
        Row: {
          created_at: string | null
          driver_id: string | null
          end_location: Json
          estimated_distance: number | null
          estimated_duration: number | null
          id: string
          job_id: string | null
          optimization_score: number | null
          start_location: Json
          updated_at: string | null
          waypoints: Json[] | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          end_location: Json
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          job_id?: string | null
          optimization_score?: number | null
          start_location: Json
          updated_at?: string | null
          waypoints?: Json[] | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          end_location?: Json
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          job_id?: string | null
          optimization_score?: number | null
          start_location?: Json
          updated_at?: string | null
          waypoints?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "route_optimizations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_addons: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          limits: Json | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limits?: Json | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          addon_price: number | null
          addon_roles: Database["public"]["Enums"]["organization_type"][] | null
          base_price: number
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          interval: string
          is_active: boolean | null
          limits: Json | null
          name: string
          organization_type:
            | Database["public"]["Enums"]["organization_type"]
            | null
          per_user_price: number | null
          per_vehicle_price: number | null
          premium_listing: boolean | null
          premium_listing_fee: number | null
          price: number
          public_jobs_commission: number | null
          public_jobs_enabled: boolean | null
          public_jobs_flat_fee: number | null
          tier: string | null
          updated_at: string | null
          volume_discount: Json | null
        }
        Insert: {
          addon_price?: number | null
          addon_roles?:
            | Database["public"]["Enums"]["organization_type"][]
            | null
          base_price?: number
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id: string
          interval: string
          is_active?: boolean | null
          limits?: Json | null
          name: string
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          per_user_price?: number | null
          per_vehicle_price?: number | null
          premium_listing?: boolean | null
          premium_listing_fee?: number | null
          price: number
          public_jobs_commission?: number | null
          public_jobs_enabled?: boolean | null
          public_jobs_flat_fee?: number | null
          tier?: string | null
          updated_at?: string | null
          volume_discount?: Json | null
        }
        Update: {
          addon_price?: number | null
          addon_roles?:
            | Database["public"]["Enums"]["organization_type"][]
            | null
          base_price?: number
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean | null
          limits?: Json | null
          name?: string
          organization_type?:
            | Database["public"]["Enums"]["organization_type"]
            | null
          per_user_price?: number | null
          per_vehicle_price?: number | null
          premium_listing?: boolean | null
          premium_listing_fee?: number | null
          price?: number
          public_jobs_commission?: number | null
          public_jobs_enabled?: boolean | null
          public_jobs_flat_fee?: number | null
          tier?: string | null
          updated_at?: string | null
          volume_discount?: Json | null
        }
        Relationships: []
      }
      subscription_usage: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          organization_id: string | null
          period_end: string
          period_start: string
          pricing_tier: string | null
          updated_at: string | null
          usage_count: number | null
          usage_type: string
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          organization_id?: string | null
          period_end: string
          period_start: string
          pricing_tier?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_type?: string
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          organization_id?: string | null
          period_end?: string
          period_start?: string
          pricing_tier?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
            foreignKeyName: "tow_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      transporter_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          created_by: string
          id: string
          job_id: string
          organization_id: string
          rating: Database["public"]["Enums"]["provider_rating"]
          transporter_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          job_id: string
          organization_id: string
          rating: Database["public"]["Enums"]["provider_rating"]
          transporter_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          job_id?: string
          organization_id?: string
          rating?: Database["public"]["Enums"]["provider_rating"]
          transporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transporter_ratings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "tow_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transporter_ratings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transporter_ratings_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_attempts: {
        Row: {
          attempt_time: string | null
          device_info: Json | null
          id: string
          ip_address: string | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          attempt_time?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          attempt_time?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
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
      vehicle_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          driver_id: string
          ended_at: string | null
          id: string
          started_at: string | null
          status: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          driver_id: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          driver_id?: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
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
      vehicle_damage_reports: {
        Row: {
          created_at: string
          damage_locations: Json
          description: string | null
          id: string
          inspector_id: string
          photos: string[] | null
          repair_estimate: number | null
          severity: Database["public"]["Enums"]["vehicle_damage_severity"]
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          damage_locations: Json
          description?: string | null
          id?: string
          inspector_id: string
          photos?: string[] | null
          repair_estimate?: number | null
          severity: Database["public"]["Enums"]["vehicle_damage_severity"]
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          damage_locations?: Json
          description?: string | null
          id?: string
          inspector_id?: string
          photos?: string[] | null
          repair_estimate?: number | null
          severity?: Database["public"]["Enums"]["vehicle_damage_severity"]
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicle_inspections: {
        Row: {
          assignment_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          inspection_data: Json | null
          inspection_date: string | null
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          inspector_id: string
          notes: string | null
          photos: string[] | null
          status: Database["public"]["Enums"]["inspection_status"] | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          assignment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          inspection_data?: Json | null
          inspection_date?: string | null
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          inspector_id: string
          notes?: string | null
          photos?: string[] | null
          status?: Database["public"]["Enums"]["inspection_status"] | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          assignment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          inspection_data?: Json | null
          inspection_date?: string | null
          inspection_type?: Database["public"]["Enums"]["inspection_type"]
          inspector_id?: string
          notes?: string | null
          photos?: string[] | null
          status?: Database["public"]["Enums"]["inspection_status"] | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_inspections_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "vehicle_assignments"
            referencedColumns: ["id"]
          },
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
      vin_scan_logs: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          scan_method: string
          scan_timestamp: string
          user_id: string | null
          vin: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          scan_method: string
          scan_timestamp: string
          user_id?: string | null
          vin: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          scan_method?: string
          scan_timestamp?: string
          user_id?: string | null
          vin?: string
        }
        Relationships: [
          {
            foreignKeyName: "vin_scan_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      fleet_analytics: {
        Row: {
          active_assignments: number | null
          active_vehicles: number | null
          in_maintenance: number | null
          organization_id: string | null
          total_vehicles: number | null
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
    }
    Functions: {
      calculate_optimal_route: {
        Args: {
          p_start_lat: number
          p_start_lng: number
          p_end_lat: number
          p_end_lng: number
          p_driver_id: string
        }
        Returns: {
          optimized_route: Json
          estimated_duration: number
          estimated_distance: number
          optimization_score: number
        }[]
      }
      calculate_platform_fees: {
        Args: {
          organization_id: string
          total_amount: number
          is_surge?: boolean
        }
        Returns: Record<string, unknown>
      }
      calculate_repair_order_total: {
        Args: {
          repair_order_id: string
        }
        Returns: number
      }
      calculate_storage_fees: {
        Args: {
          impound_id: string
        }
        Returns: number
      }
      calculate_tow_cost: {
        Args: {
          provider_id: string
          service_type: Database["public"]["Enums"]["tow_service_type"]
          distance_miles?: number
          is_peak_hours?: boolean
        }
        Returns: number
      }
      check_subscription_limit: {
        Args: {
          org_id: string
          limit_name: string
        }
        Returns: boolean
      }
      complete_vehicle_assignment: {
        Args: {
          assignment_id: string
        }
        Returns: {
          assigned_by: string | null
          created_at: string
          driver_id: string
          ended_at: string | null
          id: string
          started_at: string | null
          status: string
          updated_at: string
          vehicle_id: string
        }
      }
      create_damage_report: {
        Args: {
          vehicle_id_param: string
          inspector_id_param: string
          damage_locations_param: Json
          severity_param: Database["public"]["Enums"]["vehicle_damage_severity"]
          description_param?: string
          repair_estimate_param?: number
          photos_param?: string[]
        }
        Returns: {
          created_at: string
          damage_locations: Json
          description: string | null
          id: string
          inspector_id: string
          photos: string[] | null
          repair_estimate: number | null
          severity: Database["public"]["Enums"]["vehicle_damage_severity"]
          updated_at: string
          vehicle_id: string
        }
      }
      generate_customer_access_token: {
        Args: {
          _impound_id: string
          _email: string
          _expires_in?: unknown
        }
        Returns: string
      }
      generate_impound_metrics: {
        Args: {
          _organization_id: string
          _start_date: string
          _end_date: string
        }
        Returns: Json
      }
      get_repair_stats: {
        Args: {
          org_id: string
        }
        Returns: {
          total_orders: number
          completed_orders: number
          average_cost: number
          total_cost: number
        }[]
      }
      get_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_vehicle_damage_reports: {
        Args: {
          vehicle_id_param: string
        }
        Returns: {
          id: string
          vehicle_id: string
          inspector_id: string
          damage_locations: Json
          severity: Database["public"]["Enums"]["vehicle_damage_severity"]
          description: string
          repair_estimate: number
          photos: string[]
          created_at: string
          updated_at: string
        }[]
      }
      has_feature_access: {
        Args: {
          org_id: string
          feature_key: string
        }
        Returns: boolean
      }
      has_organization_permission: {
        Args: {
          org_id: string
          required_roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_subscription_usage: {
        Args: {
          org_id: string
          feature: string
        }
        Returns: undefined
      }
      is_internal_employee: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_master_overwatch_admin: {
        Args: Record<PropertyKey, never>
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
      is_organization_member: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      is_overwatch_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_type: string
          entity_type: string
          entity_id: string
          previous_state?: Json
          new_state?: Json
          metadata?: Json
        }
        Returns: string
      }
      log_vin_scan: {
        Args: {
          p_vin: string
          p_scan_method: string
          p_confidence?: number
          p_metadata?: Json
        }
        Returns: string
      }
      process_job_earnings: {
        Args: {
          job_id: string
          total_amount: number
          is_surge?: boolean
        }
        Returns: string
      }
      requires_two_factor: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      validate_customer_access_token: {
        Args: {
          _token: string
        }
        Returns: {
          is_valid: boolean
          impound_id: string
        }[]
      }
      validate_driver_invite: {
        Args: {
          token_input: string
        }
        Returns: {
          is_valid: boolean
          organization_id: string
          message: string
        }[]
      }
      validate_promo_code: {
        Args: {
          code_input: string
          user_id_input: string
        }
        Returns: {
          is_valid: boolean
          message: string
          trial_days: number
          discount_percent: number
        }[]
      }
    }
    Enums: {
      admin_account_type:
        | "overwatch_admin"
        | "super_admin"
        | "support_agent"
        | "billing_manager"
      app_role:
        | "admin"
        | "dispatcher"
        | "provider"
        | "consumer"
        | "dealer"
        | "wholesaler"
        | "overwatch_admin"
        | "super_admin"
        | "support_agent"
        | "billing_manager"
        | "fleet_manager"
      auction_status: "draft" | "scheduled" | "live" | "ended" | "canceled"
      bid_status: "pending" | "accepted" | "rejected" | "expired"
      feature_category:
        | "core"
        | "billing"
        | "dispatch"
        | "inventory"
        | "auction"
        | "reporting"
      impound_status:
        | "impounded"
        | "waiting_for_payment"
        | "pending_release"
        | "released"
        | "unclaimed"
      inspection_status: "pending" | "in_progress" | "completed" | "failed"
      inspection_type: "pre_trip" | "post_trip"
      inventory_status:
        | "available"
        | "pending_inspection"
        | "in_transit"
        | "sold"
        | "auction_ready"
        | "maintenance"
        | "pending_repair"
        | "in_repair"
        | "in_auction"
        | "sold_at_auction"
      job_status:
        | "pending"
        | "assigned"
        | "en_route"
        | "on_site"
        | "completed"
        | "cancelled"
      load_type: "vehicle" | "cargo" | "equipment"
      organization_type: "dealer" | "wholesaler" | "transporter" | "hybrid"
      payment_method:
        | "cash"
        | "credit_card"
        | "check"
        | "insurance"
        | "motor_club"
      pricing_type: "flat_rate" | "per_mile" | "surge"
      promo_code_type: "trial" | "discount" | "other"
      provider_rating: "1" | "2" | "3" | "4" | "5"
      repair_item_status: "pending" | "in_progress" | "completed" | "cancelled"
      service_type:
        | "tow"
        | "jumpstart"
        | "lockout"
        | "fuel_delivery"
        | "tire_change"
        | "winch_out"
        | "transport"
      template_category: "general" | "mechanical" | "body" | "safety"
      tow_service_type: "light_duty" | "heavy_duty" | "roadside_assistance"
      trade_status: "pending" | "accepted" | "rejected" | "completed"
      vehicle_condition:
        | "excellent"
        | "good"
        | "fair"
        | "poor"
        | "damaged"
        | "salvage"
      vehicle_damage_severity: "none" | "minor" | "moderate" | "severe"
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
