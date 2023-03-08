import fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const supabase = createServerSupabaseClient({ req, res });
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user)
			return res.status(401).json({
				error: "not_authenticated",
				message:
					"The user does not have an active session or is not authenticated",
			});

		// get user id
		const userID = user.id;
		const { filename, documentTitle, fullText, summary } = req.body;

		// convert filename to filepath
		const filenameWithExt = filename.replace(/\s+/g, "-").toLowerCase();
		const tempFilePath = `temp/${filenameWithExt}`;

		// create a write stream (in append mode)
		const writeStream = fs.createWriteStream(tempFilePath, { flags: "a" });

		// 1. Append the document title
		writeStream.write(`${documentTitle}\n\n`, (err) => {
			if (err) throw new Error(err.message);

			console.log("ADDED: [ DOCUMENT TITLE ]");
		});

		// 2. If a summary exists append to file
		if (summary)
			writeStream.write(`Summary:\n${summary}\n\n`, (err) => {
				if (err) throw new Error(err.message);

				console.log("ADDED: [ SUMMARY ]");
			});

		// 3. Append transcript
		writeStream.write(`Full Transcript:\n${fullText}\n\n`, (err) => {
			if (err) throw new Error(err.message);
			console.log("ADDED: [ TRANSCRIPT ]");
		});

		writeStream.end(); // finished writing to file

		writeStream.on("finish", () => {
			writeStream.close();
			console.log("FINISHED WRITING TO FILE...");

			fs.readFile(tempFilePath, "utf8", async (err, data) => {
				if (err) throw new Error(err.message);

				console.log("UPLOADING CONTENTS TO WEB STORAGE...");

				// 4. save the file to user folder (prefixed by user id)
				const { error } = await supabase.storage
					.from("notes")
					.upload(`${userID}/${filenameWithExt}`, data, {
						cacheControl: "3600", // cache for 1 hour
						contentType: "text/plain",
						upsert: true, // overwrite existing file
					});

				if (error) throw new Error(error.message);

				console.log("SUCCESSFULLY UPLOADED FILE...");

				res.status(200).json({
					message: "Successfully uploaded file",
					filename: filenameWithExt,
				});

				console.log("REMOVING TEMPORARY FILES...");

				// delete file from temp folder
				fs.unlink(tempFilePath, (err) => {
					if (err) throw new Error(err.message);

					console.log("DONE.");
				});
			});
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export default handler;
