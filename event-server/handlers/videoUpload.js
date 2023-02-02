const fs = require("fs");

const mv = require("mv");

const EventEmitterManagerService = require("../utils/event-service");
const VideoService = require("../utils/video-service");

/**
 * Handles file upload and video transcription
 * @param {*} req Handles the request from the client
 * @param {*} res Handles the response to the client
 */
async function uploadAndTranscribeVideo(req, res) {
	const { videoURL, guid } = req.body;
	const sseEmitter = EventEmitterManagerService.getEmitter(guid);

	if (!videoURL) {
		res.status(400).json({ message: "No video URL provided!" });
		return;
	} else if (!guid) {
		res.status(400).json({ message: "No GUID provided!" });
		return;
	}

	try {
		const output = await VideoService.extractAudio(videoURL);
		// TODO: remove unused properties from object once we're done testing
		const audioFileObject = output.requested_downloads[0];
		audioFileObject.video = {
			id: output.id,
			title: output.fulltitle,
			original_url: videoURL,
		};

		res.status(200).json({
			result: "Video successfully transcribed!",
			data: audioFileObject,
			// filename: filenameNoExt,
			// transcribedText,
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
