// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
import { User } from '@supabase/auth-helpers-nextjs'

import { Database, Json } from '../supabase/types/public'

type Enums = Database['public']['Enums']

/**
 * User's profile data
 */
export interface Profile {
  id: User['id']
  username: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  updated_at: string | null
}

/**
 * Models base event in the database
 */
export interface Event {
  id: string
  created_at: string
  description: string | null
  metadata: Json | null
  profile: Profile['id'] | Profile // can be a Profile id or full object
  updated_at: string | null
}

/**
 * Profile with event relations
 */
export interface ProfileWithEvents extends Profile {
  events: Event[]
}

/**
 * For transcription events
 */
export interface Transcription {
  id: string
  event_id: Event['id']
  type: Enums['transcription_type']
}

/**
 * For summary events
 */
export interface Summary {
  id: string
  event_id: Event['id']
}

/**
 * For note events
 */
export interface Note {
  event_id: Event['id']
  has_summary: boolean
  id: string
  type: Enums['note_action_type']
}

/**
 * User data with profile
 */
export interface FullUser extends User {
  profile: Profile
}

/**
 * User data with profile and event relations
 */
export interface FullUserWithEvents extends FullUser {
  events: Event[]
}

/**
 * Models a Supabase file
 */
export interface NoteFile {
  id: string
  name: string
  last_accessed_at: string
  created_at: string
  updated_at: string
  metadata: {
    size: number
    last_modified: string
  }
  contents: string | null
}

/**
 * Models a file on the client side
 */
export interface File {
  id: number
  name: string
  ext: string
}
