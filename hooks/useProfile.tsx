import { useState, useEffect } from "react";

import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { Database } from "../types/supabase";
import { FullUser } from "../interfaces";

// fetches the user's profile data from the database
const useProfile = (): FullUser["profile"] => {
	const [profile, setProfile] = useState<any>();

	const supabase = useSupabaseClient<Database>();
	const user = useUser();

	useEffect(() => {
		getProfile();
	}, []);

	const getProfile = async () => {
		try {
			let { data, error, status } = await supabase
				.from("profiles")
				.select(`username, website, avatar_url`)
				.eq("id", user.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setProfile(data);
			}

			return { data: profile, error: null };
		} catch (error) {
			alert("Error loading user data!");
			console.log(error);
		}
	};

	return profile;
};

export default useProfile;
