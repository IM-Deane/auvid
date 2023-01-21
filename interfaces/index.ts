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
