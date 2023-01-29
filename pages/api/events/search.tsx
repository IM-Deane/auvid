import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { EventCountSearchParams } from "../../../types";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

		let params: EventCountSearchParams = {};

		const filterByProfileId = {
			where: {
				event: {
					profile_id: session.user.id,
				},
			},
		};

		// let transcriptions: number = 0;
		// let summaries: number = 0;
		// let notes: number = 0;
		Object.entries(req.query).forEach(async ([key, value]) => {
			// convert string to boolean and assign to params
			params[key] = !!value;

			// if (key === "transcriptions" && value) {
			// 	transcriptions = await prisma.transcriptions.count(filterByProfileId);
			// } else if (key === "summaries" && value) {
			// 	summaries = await prisma.summaries.count(filterByProfileId);
			// } else if (key === "notes" && value) {
			// 	notes = await prisma.notes.count(filterByProfileId);
			// }
		});

		const eventsWithCount = await prisma.events.findMany({
			where: {
				profile_id: session.user.id,
			},
			select: {
				_count: {
					select: { ...params }, // use params to specify relations
				},
			},
		});

		res.status(200).json(eventsWithCount[0]._count);
		// res.status(200).json({ counts: { transcriptions, summaries, notes } });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;
