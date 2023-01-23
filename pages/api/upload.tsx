import fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";

import middleware from "../../middleware/middleware";
import nc from "next-connect";
import { spawn } from "child_process";

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

		const timestamp = new Date().toISOString();
		const filename = `${timestamp}-${files.file.originalFilename}`;

		// create temp file
		const oldPath = files.file.filepath;
		const newPath = `./temp/${filename}`;
		mv(oldPath, newPath, (err: any) => err && console.log(err));

		// use python to transcribe file's audio to text
		const python = spawn("python", ["main.py", newPath]);

		let transcribedText;
		python.stdout.on("data", (data) => {
			transcribedText = data.toString();
		});

		// handle errors
		python.stderr.on("data", (data) => {
			console.log(`stderr: ${data}`);
		});

		// in closing event we are sure that stream from child process is closed
		python.on("close", (code) => {
			console.log(`child process close all stdio with code ${code}`);
			// send data to browser
			res.status(200).json({
				result: "File uploaded and transcribed successfully",
				files,
				filename,
				transcribedText,
			});

			// cleanup temp file
			fs.unlink(newPath, (err) => {
				if (err) {
					console.error(err);
					throw new Error("Error removing audio file.");
				}
			});
		});
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
