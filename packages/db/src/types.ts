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
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
