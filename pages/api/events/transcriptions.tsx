import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { v4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		// Create authenticated Supabase Client
		const supabase = createServerSupabaseClient({ req, res });
		// Check for session
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session)
			return res.status(401).json({
				error: "not_authenticated",
				message:
					"The user does not have an active session or is not authenticated",
			});

		const userId = session.user.id;
		const { filename } = req.body;

		const requestConfig = {
			request_id: v4(), // unique id for request
			headers: req.headers,
			url: req.url,
			method: req.method,
			data: req.body,
		};

		// create transcription event using prisma nested create
		const event = await prisma.events.create({
			data: {
				description: `Transcribed text from ${filename}`, // has no extension
				metadata: requestConfig,
				profile: {
					connect: { id: userId },
				},
				transcriptions: {
					create: {}, // will reference uuid created by DB
				},
			},
			select: {
				id: true,
				created_at: true,
				description: true,
				profile: true,
				transcriptions: true,
			},
		});

		res.status(200).json({ event, message: "Transcription event created" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;
