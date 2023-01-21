import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Layout from "../components/Layout";
import Account from "../components/Account";

import { FullUser } from "../interfaces";

const AccountPage = ({ user }: { user: FullUser }) => {
	return (
		<Layout title="Account | RustleAI">
			<div className="mt-5">
				<Account user={user} />
			</div>
		</Layout>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabase = createServerSupabaseClient(ctx);
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	// Run queries with RLS on the server
	const { data } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", session.user.id)
		.single();

	// combine user and profile data
	const userData = {
		...session.user,
		profile: { ...data },
	};

	return {
		props: {
			initialSession: session,
			user: userData,
		},
	};
};

export default AccountPage;
