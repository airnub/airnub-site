export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contact_leads: {
        Row: {
          id: string;
          created_at: string;
          full_name: string | null;
          email: string;
          company: string | null;
          message: string | null;
          source: "airnub" | "speckit";
          consent: boolean | null;
          user_agent: string | null;
          ip_hash: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
          email: string;
          company?: string | null;
          message?: string | null;
          source?: "airnub" | "speckit";
          consent?: boolean | null;
          user_agent?: string | null;
          ip_hash?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string | null;
          email?: string;
          company?: string | null;
          message?: string | null;
          source?: "airnub" | "speckit";
          consent?: boolean | null;
          user_agent?: string | null;
          ip_hash?: string | null;
        };
        Relationships: [];
      };
      lead_actions: {
        Row: {
          id: string;
          lead_id: string;
          status: "new" | "replied" | "ignored" | "handoff";
          assignee: string | null;
          note: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          lead_id: string;
          status: "new" | "replied" | "ignored" | "handoff";
          assignee?: string | null;
          note?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          lead_id?: string;
          status?: "new" | "replied" | "ignored" | "handoff";
          assignee?: string | null;
          note?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_actions_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "contact_leads";
            referencedColumns: ["id"];
          }
        ];
      };
      runtime_flags: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
