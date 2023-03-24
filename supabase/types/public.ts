export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
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
          type: Database['public']['Enums']['note_action_type']
        }
        Insert: {
          event_id: string
          has_summary?: boolean
          id?: string
          type?: Database['public']['Enums']['note_action_type']
        }
        Update: {
          event_id?: string
          has_summary?: boolean
          id?: string
          type?: Database['public']['Enums']['note_action_type']
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
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
          type: Database['public']['Enums']['transcription_type']
        }
        Insert: {
          event_id: string
          id?: string
          type?: Database['public']['Enums']['transcription_type']
        }
        Update: {
          event_id?: string
          id?: string
          type?: Database['public']['Enums']['transcription_type']
        }
      }
    }
    Views: {
      events_per_user_current_month: {
        Row: {
          event_count: number | null
          profile_id: string | null
        }
      }
    }
    Functions: {
      get_current_month_event_count: {
        Args: { profile_id: string }
        Returns: number
      }
      handle_new_note_event: {
        Args: {
          event_description: string
          event_meta: Json
          event_type: Database['public']['Enums']['note_action_type']
          note_has_summary: boolean
        }
        Returns: string
      }
      handle_new_summary_event: {
        Args: { event_description: string; event_meta: Json }
        Returns: string
      }
      handle_new_transcription_event: {
        Args: {
          event_description: string
          event_meta: Json
          event_type: Database['public']['Enums']['transcription_type']
        }
        Returns: string
      }
    }
    Enums: {
      note_action_type: 'uploaded' | 'downloaded' | 'deleted' | 'updated'
      transcription_type: 'audio' | 'video' | 'meeting'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
