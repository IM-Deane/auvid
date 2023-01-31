import { useRouter } from "next/router";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

import LoginForm from "../../components/LoginForm";

function login() {
	const supabase = useSupabaseClient();
	const router = useRouter();
	supabase.auth.getSession().then(({ data }) => {
		if (data.session) {
			router.push("/");
		}
	});

	return (
		<div>
			<LoginForm />
		</div>
	);
}

export default login;
