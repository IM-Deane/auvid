import { File } from '@/supabase/types/index'

export const fileTypes: File[] = [
  { id: 0, name: 'TXT', ext: '.txt' },
  { id: 1, name: 'PDF', ext: '.pdf' },
  { id: 2, name: 'LOG', ext: '.log' },
  { id: 3, name: 'RTF', ext: '.rtf' },
  { id: 4, name: 'MD', ext: '.md' }
]

export enum NoteAction {
  uploaded = 'uploaded',
  downloaded = 'downloaded',
  deleted = 'deleted',
  edited = 'edited'
}

export enum TranscriptionType {
  audio = 'audio',
  video = 'video',
  meeting = 'meeting'
}
