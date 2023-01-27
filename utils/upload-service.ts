import axios from "axios";

/**
 *
 * @param {File} file file data being uploaded
 * @param {string} guid client id for server setn events
 * @param {number} onUploadProgress progress of the upload as a number
 * @returns {Promise<AxiosResponse<any>>} response from the server
 */
async function uploadAudioFileService(
	file: File,
	guid: string,
	onUploadProgress
) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("guid", guid);

	return axios.post("http://localhost:5000/api/upload-audio", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		responseType: "json",
		onUploadProgress, // track upload progress for audio file (not transcription progress)
	});
}

export default uploadAudioFileService;
