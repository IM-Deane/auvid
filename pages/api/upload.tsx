import { NextApiRequest, NextApiResponse } from "next";

import middleware from "../../middleware/middleware";
import nc from "next-connect";

const mv = require("mv");

// add files to request
interface ApiRequest extends NextApiRequest {
	files: any;
}

const handler = nc<ApiRequest, NextApiResponse>({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(500).end("Something broke!");
	},
	onNoMatch: (req, res) => {
		res.status(404).end("Page is not found");
	},
});

handler.use(middleware);

handler.post(async (req, res) => {
	try {
		const { files } = req;

		// validate audio file
		if (!files || !files.file.mimetype.includes("audio/")) {
			res.status(400).json({ message: "Invalid file detected." });
			return;
		}

		// add file to public/uploads
		const oldPath = files.file.filepath;
		const newPath = `./public/uploads/${files.file.originalFilename}`;
		mv(oldPath, newPath, (err: any) => {
			throw new Error(err); // something went wrong during upload
		});

		res.status(200).json({ result: "File uploaded successfully", files });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
});

// turn off default Next.js body parser
export const config = {
	api: {
		bodyParser: false,
	},
};

export default handler;
