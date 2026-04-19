export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_email_snapshot: string | null
          actor_user_id: string | null
          created_at: string | null
          id: string
          ip_prefix: string | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          tenant_id: string | null
          user_agent_short: string | null
        }
        Insert: {
          action: string
          actor_email_snapshot?: string | null
          actor_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_prefix?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          tenant_id?: string | null
          user_agent_short?: string | null
        }
        Update: {
          action?: string
          actor_email_snapshot?: string | null
          actor_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_prefix?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          tenant_id?: string | null
          user_agent_short?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip_prefix: string | null
          kind: string
          success: boolean | null
          tenant_slug: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip_prefix?: string | null
          kind: string
          success?: boolean | null
          tenant_slug?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip_prefix?: string | null
          kind?: string
          success?: boolean | null
          tenant_slug?: string | null
        }
        Relationships: []
      }
      data_deletion_requests: {
        Row: {
          executed_at: string | null
          id: string
          reason: string | null
          requested_at: string | null
          requested_by: string | null
          scheduled_for: string
          status: Database["public"]["Enums"]["deletion_status"] | null
          target_user_id: string | null
          tenant_id: string
        }
        Insert: {
          executed_at?: string | null
          id?: string
          reason?: string | null
          requested_at?: string | null
          requested_by?: string | null
          scheduled_for: string
          status?: Database["public"]["Enums"]["deletion_status"] | null
          target_user_id?: string | null
          tenant_id: string
        }
        Update: {
          executed_at?: string | null
          id?: string
          reason?: string | null
          requested_at?: string | null
          requested_by?: string | null
          scheduled_for?: string
          status?: Database["public"]["Enums"]["deletion_status"] | null
          target_user_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_deletion_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_deletion_requests_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_deletion_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      module_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          is_required: boolean | null
          kind: Database["public"]["Enums"]["section_kind"]
          module_id: string
          order_index: number
          title: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          kind: Database["public"]["Enums"]["section_kind"]
          module_id: string
          order_index: number
          title: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          kind?: Database["public"]["Enums"]["section_kind"]
          module_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_sections_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          content: Json | null
          created_at: string | null
          duration_min: number | null
          goal: string | null
          id: string
          order_index: number | null
          phase: Database["public"]["Enums"]["module_phase"]
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          duration_min?: number | null
          goal?: string | null
          id?: string
          order_index?: number | null
          phase: Database["public"]["Enums"]["module_phase"]
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          duration_min?: number | null
          goal?: string | null
          id?: string
          order_index?: number | null
          phase?: Database["public"]["Enums"]["module_phase"]
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      onboarding_tracks: {
        Row: {
          created_at: string | null
          id: string
          name: string
          role_target: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          role_target?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          role_target?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_tracks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          body: string | null
          body_purged_at: string | null
          created_at: string | null
          delivery_status: string | null
          id: string
          module_id: string | null
          sent_at: string | null
          sent_by: string | null
          sent_to_user_id: string | null
          subject: string | null
          tenant_id: string
        }
        Insert: {
          body?: string | null
          body_purged_at?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          module_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to_user_id?: string | null
          subject?: string | null
          tenant_id: string
        }
        Update: {
          body?: string | null
          body_purged_at?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          module_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to_user_id?: string | null
          subject?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_sent_to_user_id_fkey"
            columns: ["sent_to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      section_completions: {
        Row: {
          attempts: number | null
          completed_at: string | null
          id: string
          module_id: string
          passed: boolean
          section_id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          id?: string
          module_id: string
          passed?: boolean
          section_id: string
          tenant_id: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          id?: string
          module_id?: string
          passed?: boolean
          section_id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "section_completions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_completions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "module_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_completions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          active_seats: number | null
          current_period_end: string | null
          plan: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          active_seats?: number | null
          current_period_end?: string | null
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          active_seats?: number | null
          current_period_end?: string | null
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_module_customizations: {
        Row: {
          created_at: string | null
          is_enabled: boolean | null
          module_id: string
          overrides: Json | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          is_enabled?: boolean | null
          module_id: string
          overrides?: Json | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          is_enabled?: boolean | null
          module_id?: string
          overrides?: Json | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_module_customizations_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_module_customizations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          billing_email: string | null
          created_at: string | null
          data_retention_months: number | null
          deleted_at: string | null
          id: string
          name: string
          org_nummer: string | null
          phone: string | null
          plan: string | null
          slug: string
        }
        Insert: {
          address?: string | null
          billing_email?: string | null
          created_at?: string | null
          data_retention_months?: number | null
          deleted_at?: string | null
          id?: string
          name: string
          org_nummer?: string | null
          phone?: string | null
          plan?: string | null
          slug: string
        }
        Update: {
          address?: string | null
          billing_email?: string | null
          created_at?: string | null
          data_retention_months?: number | null
          deleted_at?: string | null
          id?: string
          name?: string
          org_nummer?: string | null
          phone?: string | null
          plan?: string | null
          slug?: string
        }
        Relationships: []
      }
      track_modules: {
        Row: {
          is_required: boolean | null
          module_id: string
          order_index: number
          track_id: string
        }
        Insert: {
          is_required?: boolean | null
          module_id: string
          order_index: number
          track_id: string
        }
        Update: {
          is_required?: boolean | null
          module_id?: string
          order_index?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_modules_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "onboarding_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tracks: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          due_date: string | null
          id: string
          ready_for_duty: boolean | null
          started_at: string | null
          tenant_id: string
          track_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          completed_at?: string | null
          due_date?: string | null
          id?: string
          ready_for_duty?: boolean | null
          started_at?: string | null
          tenant_id: string
          track_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          completed_at?: string | null
          due_date?: string | null
          id?: string
          ready_for_duty?: boolean | null
          started_at?: string | null
          tenant_id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tracks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "onboarding_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tracks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          deleted_at: string | null
          department: string | null
          email: string
          end_date: string | null
          id: string
          invited_by: string | null
          last_active_at: string | null
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          scheduled_deletion_at: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          suspended_until: string | null
          tenant_id: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          email: string
          end_date?: string | null
          id?: string
          invited_by?: string | null
          last_active_at?: string | null
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          scheduled_deletion_at?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          suspended_until?: string | null
          tenant_id: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          department?: string | null
          email?: string
          end_date?: string | null
          id?: string
          invited_by?: string | null
          last_active_at?: string | null
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          scheduled_deletion_at?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          suspended_until?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_user_context: {
        Args: { p_email: string; p_tenant_slug: string }
        Returns: {
          full_name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          tenant_id: string
          user_id: string
        }[]
      }
      jwt_app_user_id: { Args: never; Returns: string }
      jwt_tenant_id: { Args: never; Returns: string }
      jwt_user_role: { Args: never; Returns: string }
    }
    Enums: {
      deletion_status: "scheduled" | "cancelled" | "executed"
      module_phase: "for_forste_vakt" | "forste_uke" | "fortlopende"
      section_kind: "intro" | "content" | "scenario" | "quiz" | "reflection"
      user_role: "admin" | "ansatt"
      user_status: "invited" | "active" | "suspended" | "deleted_soft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      deletion_status: ["scheduled", "cancelled", "executed"],
      module_phase: ["for_forste_vakt", "forste_uke", "fortlopende"],
      section_kind: ["intro", "content", "scenario", "quiz", "reflection"],
      user_role: ["admin", "ansatt"],
      user_status: ["invited", "active", "suspended", "deleted_soft"],
    },
  },
} as const
