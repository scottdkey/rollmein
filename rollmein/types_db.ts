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
      group: {
        Row: {
          created_at: string | null
          id: string
          lock_after_out: boolean
          members_can_update: boolean
          name: string
          relations: Json | null
          roll_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lock_after_out?: boolean
          members_can_update?: boolean
          name: string
          relations?: Json | null
          roll_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lock_after_out?: boolean
          members_can_update?: boolean
          name?: string
          relations?: Json | null
          roll_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_user_id_fk"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          id: number
          name: string
          run_on: string
        }
        Insert: {
          id?: number
          name: string
          run_on: string
        }
        Update: {
          id?: number
          name?: string
          run_on?: string
        }
        Relationships: []
      }
      player: {
        Row: {
          created_at: string
          dps: boolean
          group_id: string | null
          healer: boolean
          id: string
          in_the_roll: boolean
          locked: boolean
          name: string | null
          tank: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dps?: boolean
          group_id?: string | null
          healer?: boolean
          id?: string
          in_the_roll?: boolean
          locked?: boolean
          name?: string | null
          tank?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dps?: boolean
          group_id?: string | null
          healer?: boolean
          id?: string
          in_the_roll?: boolean
          locked?: boolean
          name?: string | null
          tank?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_id_fk"
            columns: ["group_id"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_user_id_fk"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          apple_id: string | null
          created_at: string | null
          email: string
          github_id: string | null
          google_id: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          apple_id?: string | null
          created_at?: string | null
          email: string
          github_id?: string | null
          google_id?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          apple_id?: string | null
          created_at?: string | null
          email?: string
          github_id?: string | null
          google_id?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_options: {
        Row: {
          created_at: string | null
          theme: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          theme?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          theme?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "useroptions_user_id_fk"
            columns: ["user_id"]
            referencedRelation: "user"
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
