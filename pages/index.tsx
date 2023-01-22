import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import Layout from "../components/Layout";

const IndexPage = () => {
	const session = useSession();
	const supabase = useSupabaseClient();

	return !session ? (
		<Auth
			supabaseClient={supabase}
			appearance={{ theme: ThemeSupa }}
			theme="dark"
		/>
	) : (
		<Layout title="Home | RustleAI">
			<h1 className="text-2xl font-semibold text-gray-900">
				Hello RustleAI 👋
			</h1>
		</Layout>
	);
};

export default IndexPage;
