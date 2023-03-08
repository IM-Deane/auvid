import type { NextApiRequest, NextApiResponse } from "next";
import type { Database } from "../../../supabase/types/public";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const supabase = createServerSupabaseClient<Database>({ req, res });

		const {
			data: { session },
		} = await supabase.auth.getSession();

		const { data, error } = await supabase
			.from("events")
			.select("*")
			.eq("profile_id", session.user.id);

		if (error) {
			console.log(error);
			res.status(500).json({ error: error.message });
			return;
		}

		res.status(200).json({ events: data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;
