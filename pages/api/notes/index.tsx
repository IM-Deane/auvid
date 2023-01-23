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

		if (!session)
			return res.status(401).json({
				error: "not_authenticated",
				message:
					"The user does not have an active session or is not authenticated",
			});

		const userID = session.user.id;
		// get all files from user folder
		const { data, error } = await supabase.storage.from("notes").list(userID, {
			sortBy: { column: "created_at", order: "asc" },
		});

		if (error) throw new Error(error.message);

		// filter out the placeholder file
		const filteredData = data.filter(
			(file) => file.name !== ".emptyFolderPlaceholder"
		);

		res.status(200).json(filteredData);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default handler;
