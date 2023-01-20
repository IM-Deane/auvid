import Link from "next/link";

import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import Layout from "../components/Layout";
import Account from "../components/Account";

const AccountPage = () => {
	const session = useSession();
	const supabase = useSupabaseClient();

	return !session ? (
		<Auth
			supabaseClient={supabase}
			appearance={{ theme: ThemeSupa }}
			theme="dark"
		/>
	) : (
		<Layout title="Account | RustleAI">
			<h1>Account</h1>
			<Account session={session} />
			<p>
				<Link href="/">Go home</Link>
			</p>
		</Layout>
	);
};

export default AccountPage;
