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
		const { filename, documentTitle, fullText, notes } = req.body;

		// convert filename to filepath
		const filenameWithExt = filename.replace(/\s+/g, "-").toLowerCase();
		const tempFilePath = `temp/${filenameWithExt}`;

		// 1. Append the document title
		let fileContent = `${documentTitle}\n\n`;

		// 2. If a notes summary exists, append to string
		if (notes) fileContent += `Summary:\n\n${notes.trim()}\n\n`;

		// 3. Add the full transcript to string
		fileContent += `Full Transcript:\n\n${fullText.trim()}`;

		// write file to temp folder
		fs.writeFile(tempFilePath, fileContent, (err) => {
			if (err) throw new Error(err.message);

			// read contents from temp file
			fs.readFile(tempFilePath, "utf8", async (err, data) => {
				if (err) throw new Error(err.message);

				// 4. save the file to user folder (prefixed by user id)
				const { error } = await supabase.storage
					.from("notes")
					.upload(`${userID}/${filenameWithExt}`, data);

				if (error) throw new Error(error.message);

				res.status(200).json({
					message: "Successfully uploaded file",
					filename: filenameWithExt,
				});

				// delete file from temp folder
				fs.unlink(tempFilePath, (err) => {
					if (err) throw new Error(err.message);
				});
			});
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export default handler;
