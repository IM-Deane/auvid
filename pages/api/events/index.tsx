import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import prisma from "../../../utils/prisma-client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		// Create authenticated Supabase Client
		const supabase = createServerSupabaseClient({ req, res });

		const {
			data: { session },
		} = await supabase.auth.getSession();

		const events = await prisma.events.findMany({
			where: {
				profile_id: session.user.id,
			},
			include: {
				profile: true,
			},
		});

		res.status(200).json({ events, profile: events[0].profile });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;
