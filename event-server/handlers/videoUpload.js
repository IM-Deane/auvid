const fs = require("fs");
const https = require("https");
const { spawn } = require("child_process");

const EventEmitterManagerService = require("../utils/event-service");
const VideoService = require("../utils/video-service");

/**
 * Handles file upload and video transcription
 * @param {*} req Handles the request from the client
 * @param {*} res Handles the response to the client
 */
async function uploadAndTranscribeVideo(req, res) {
	const { videoURL, guid } = req.body;

	if (!videoURL) {
		res.status(400).json({ message: "No video URL provided!" });
		return;
	} else if (!guid) {
		res.status(400).json({ message: "No GUID provided!" });
		return;
	}

	try {
		const sseEmitter = EventEmitterManagerService.getEmitter(guid);
		const output = await VideoService.extractAudio(videoURL);

		// TODO: remove unused properties from object once we're done testing
		const audioFileObject = output.requested_downloads[0];
		const filename = audioFileObject._filename;
		const videoThumbnail = output.thumbnail;

		audioFileObject.video = {
			id: output.id,
			title: output.fulltitle,
			original_url: videoURL,
		};

		let tempInputFilePath = "";
		let transcriptionProgress = 0;
		let transcribedText = "";
		let totalTimeInSeconds = 0;
		https.get(audioFileObject.url, (downloadResponse) => {
			tempInputFilePath = `./temp/${filename}`;
			const audioFileSize = audioFileObject.filesize;

			const writeStream = fs.createWriteStream(tempInputFilePath);

			let totalDownloadTime = 0;
			const downloadStartTime = Date.now();
			downloadResponse.pipe(writeStream).on("finish", () => {
				const downloadEndTime = Date.now();
				totalDownloadTime = downloadEndTime - downloadStartTime;
				console.log(
					`Finished downloading audio file in ${totalDownloadTime}ms`
				);

				const transcriptionStartTime = Date.now();
				let transcriptionEndTime = null;
				// transcription pipeline
				const python = spawn("python", ["python/main.py", tempInputFilePath]);
				python.stdout
					.on("data", (chunk) => {
						// send progress event to client
						sseEmitter.write(`event: ${guid}\n`);
						sseEmitter.write(`data: ${JSON.stringify({ progress: 75 })}`);
						sseEmitter.write("\n\n");
						sseEmitter.flush(); // end of update

						transcribedText += chunk; // add to buffer
					})
					.on("end", () => {
						// send final progress update to client
						sseEmitter.write(`event: ${guid}\n`);
						sseEmitter.write(`data: ${JSON.stringify({ progress: 100 })}`);
						sseEmitter.write("\n\n");
						sseEmitter.flush();

						transcriptionEndTime = Date.now();
					})
					.on("close", () => {
						const filenameNoExt = filename.substring(
							0,
							filename.lastIndexOf(".")
						);

						const totalTranscriptionTime =
							transcriptionEndTime - transcriptionStartTime;
						const millisecondTotal = totalDownloadTime + totalTranscriptionTime;
						totalTimeInSeconds = ((millisecondTotal % 60000) / 1000).toFixed(2);

						res.status(200).json({
							result: "Video successfully transcribed!",
							filename: filenameNoExt,
							transcribedText: transcribedText.toString(),
							videoMetadata: audioFileObject,
							completionTimeInSeconds: totalTimeInSeconds,
							videoThumbnail,
						});

						// remove temp file
						fs.unlink(tempInputFilePath, (err) => console.error(err));
					})
					.on("error", (err) => {
						console.log(`TranscriptionError: ${err}`);
					});
			});
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: "Encountered error while processing video!" });
	}
}

module.exports = {
	uploadAndTranscribeVideo,
};
