import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Database } from "../../../supabase/types/public";
import { TranscriptionType } from "../../../utils/enums";

import { v4 } from "uuid";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const supabase = createServerSupabaseClient<Database>({ req, res });
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user)
			return res.status(401).json({
				error: "not_authenticated",
				message:
					"The user does not have an active session or is not authenticated",
			});

		const { filename, type, metadata } = req.body;

		if (!filename || !type)
			return res.status(400).json({
				error: "missing_data",
				message: "Missing filename or type",
			});
		else if (!(type in TranscriptionType)) {
			return res.status(400).json({
				error: "invalid_data",
				message: "Invalid transcription type",
			});
		}

		const requestConfig = {
			request_id: v4(),
			headers: req.headers,
			url: req.url,
			method: req.method,
			data: metadata ? metadata : req.body,
		};

		const { data, error } = await supabase.rpc(
			"handle_new_transcription_event",
			{
				event_description: `Transcribed text from ${filename}`,
				event_meta: requestConfig,
				event_type: type,
			}
		);

		if (error) throw error;

		res
			.status(200)
			.json({ event: data, message: "Transcription event created" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

export default handler;
