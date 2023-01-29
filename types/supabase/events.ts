export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  events: {
    Tables: {
      events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          profile_id?: string
          updated_at?: string | null
        }
      }
      notes: {
        Row: {
          event_id: string
          has_summary: boolean
          id: string
          type: Database["events"]["Enums"]["note_action_type"]
        }
        Insert: {
          event_id: string
          has_summary?: boolean
          id?: string
          type?: Database["events"]["Enums"]["note_action_type"]
        }
        Update: {
          event_id?: string
          has_summary?: boolean
          id?: string
          type?: Database["events"]["Enums"]["note_action_type"]
        }
      }
      summaries: {
        Row: {
          event_id: string
          id: string
        }
        Insert: {
          event_id: string
          id?: string
        }
        Update: {
          event_id?: string
          id?: string
        }
      }
      transcriptions: {
        Row: {
          event_id: string
          id: string
          type: Database["events"]["Enums"]["transcription_type"]
        }
        Insert: {
          event_id: string
          id?: string
          type?: Database["events"]["Enums"]["transcription_type"]
        }
        Update: {
          event_id?: string
          id?: string
          type?: Database["events"]["Enums"]["transcription_type"]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      note_action_type: "uploaded" | "downloaded"
      transcription_type: "audio" | "video" | "meeting"
    }
  }
}
