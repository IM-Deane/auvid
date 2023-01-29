import React from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import LoginForm from "../../components/LoginForm";

function login() {
	return (
		<div>
			<LoginForm />
		</div>
	);
}

// export async function getServerSideProps(ctx) {
// 	const supabase = createServerSupabaseClient(ctx);
// 	const { data: session } = await supabase.auth.getSession();

// 	if (session) {
// 		return {
// 			redirect: {
// 				destination: "/",
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: {},
// 	};
// }

export default login;
