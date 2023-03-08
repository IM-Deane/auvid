export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					avatar_url: string | null;
					first_name: string | null;
					id: string;
					last_name: string | null;
					updated_at: string | null;
					username: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					first_name?: string | null;
					id: string;
					last_name?: string | null;
					updated_at?: string | null;
					username?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
					updated_at?: string | null;
					username?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			handle_new_transcription_event: {
				Args: {
					event_description: string;
					event_meta: Json;
					event_type: string;
				};
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
