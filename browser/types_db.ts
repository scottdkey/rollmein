export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user: {
        Row: {
          created_at: string
          dps: boolean
          healer: boolean
          id: string
          tank: boolean
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          dps?: boolean
          healer?: boolean
          id: string
          tank?: boolean
          updated_at?: string
          username?: string
        }
        Update: {
          created_at?: string
          dps?: boolean
          healer?: boolean
          id?: string
          tank?: boolean
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
