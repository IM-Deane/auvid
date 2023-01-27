import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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

		// get user id
		const userID = session.user.id;
		const { filename, fullText, notes, filetype } = req.body;

		// convert filename to filepath
		const textFilename = filename.replace(/\s+/g, "-").toLowerCase();

		// save to user folder (prefixed by user id)
		const { error } = await supabase.storage
			.from("notes")
			.upload(`${userID}/${textFilename}`, fullText);

		if (error) {
			console.log(error);
			throw new Error("Error uploading transcript!");
		}

		if (notes) {
			const notesFilename =
				filename.replace(/\s+/g, "-").toLowerCase() + `-notes${filetype}`;

			const { error } = await supabase.storage
				.from("notes")
				.upload(`${userID}/${notesFilename}`, notes);

			if (error) {
				console.log(error);
				throw new Error("Error uploading notes!");
			}
		}

		res
			.status(200)
			.json({ message: "Successfully uploaded files", filename: textFilename });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export default handler;
