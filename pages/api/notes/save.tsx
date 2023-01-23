import fs from "fs";

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

		const { filename, fullText, notes } = req.body;

		// convert filename to filepath
		const textFilename = filename.replace(/\s+/g, "-").toLowerCase() + ".txt";
		const textFilePath = "./public/uploads/" + textFilename;

		// create temp file for transcript file
		fs.writeFile(textFilePath, fullText, async (err) => {
			if (err) {
				console.log(err);
				throw new Error("Error creating transcript file!");
			}

			// save to user folder (prefixed by user id)
			const { data, error } = await supabase.storage
				.from("notes")
				.upload(`${userID}/${textFilename}`, textFilePath);

			if (error) {
				console.log(error);
				throw new Error("Error uploading transcript!");
			}

			console.log(`Saved full transcript to ${data.path}`);
		});

		if (notes) {
			const notesFilename =
				filename.replace(/\s+/g, "-").toLowerCase() + "-notes.txt";
			const notesFilePath = "./public/uploads/" + notesFilename;

			fs.writeFile(notesFilePath, notes, async (err) => {
				if (err) {
					console.error(err);
					throw new Error("Error creating notes file!");
				}

				const { data, error } = await supabase.storage
					.from("notes")
					.upload(`${userID}/${notesFilename}`, notesFilePath);

				if (error) {
					console.log(error);
					throw new Error("Error uploading notes!");
				}
				console.log(`Saved notes to ${data.path}`);
			});
		}

		res.status(200).json({ message: "Successfully uploaded files" });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
};

export default handler;
