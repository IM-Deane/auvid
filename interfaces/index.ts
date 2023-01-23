// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
import { User } from "@supabase/auth-helpers-nextjs";

export interface FullUser extends User {
	profile: {
		id: string;
		username: string;
		first_name: string;
		last_name: string;
		avatar_url: string;
		updated_at: string | null;
	};
}

export interface Note {
	id: string;
	name: string;
	last_accessed_at: string;
	created_at: string;
	updated_at: string;
	metadata: {
		size: number;
		last_modified: string;
	};
	contents: string | null;
}
