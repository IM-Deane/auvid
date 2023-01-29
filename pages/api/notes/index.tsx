import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		// Create authenticated Supabase Client
		const supabase = createServerSupabaseClient({ req, res });
		// Check for session
		const {
			data: { session },
		} = await supabase.auth.getSession();

		// get user id
		const userId = session.user.id;

		// get user's notes
		const { data, error } = await supabase.storage
			.from("notes")
			.list(userId, { sortBy: { column: "created_at", order: "desc" } });

		if (error) throw new Error(error.message);

		const notes = data.filter(
			(note) => note.name !== ".emptyFolderPlaceholder" // ignore empty folder placeholder
		);

		res.status(200).json(notes);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export default handler;
