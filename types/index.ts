export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

/**
 * Expected query param format for event search
 * @example { "note": true, "transcription": true }
 */
export type EventCountSearchParams = {
  [key: string]: boolean
}
