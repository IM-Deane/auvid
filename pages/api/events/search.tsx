import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { EventCountSearchParams } from "../../../types";

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

		let params: EventCountSearchParams = {};

		const filterByProfileId = {
			where: {
				event: {
					profile_id: session.user.id,
				},
			},
		};

		// map over query params and return an array of promises
		const promises = Object.entries(req.query).map(async ([key, value]) => {
			// convert string to boolean and assign to params
			params[key] = !!value;

			if (key === "transcriptions" && value) {
				return await prisma.transcriptions.count(filterByProfileId);
			} else if (key === "summaries" && value) {
				return await prisma.summaries.count(filterByProfileId);
			} else if (key === "notes" && value) {
				return await prisma.notes.count(filterByProfileId);
			}
		});

		// destructure and assign (note: order matters!)
		const [transcriptions, summaries, notes] = await Promise.all(promises);

		res.status(200).json({ transcriptions, summaries, notes });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;
