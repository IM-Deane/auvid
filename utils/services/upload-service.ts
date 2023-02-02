import axios, { AxiosResponse } from "axios";

class UploadService {
	private service: any;

	constructor() {
		this.service = axios.create({
			baseURL: `${process.env.NEXT_PUBLIC_SSE_URL}/api`,
			headers: {
				Accept: "application/json",
			},
		});
	}

	/**
	 * Upload a new audio file to the event server
	 * @param {File} file file data being uploaded
	 * @param {string} guid client id for server sent events
	 * @param {number} onUploadProgress progress of the upload as a number
	 */
	newAudioFile = async (
		file: File,
		guid: string,
		onUploadProgress
	): Promise<AxiosResponse> => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("guid", guid);

		return this.service.post("/upload-audio", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			responseType: "json",
			onUploadProgress, // track upload progress for audio file (not transcription progress)
		});
	};

	/**
	 * Upload a new video file to the event server via a link.
	 * @param {string} videoURL a link to the video
	 * @param {string} guid client id for server sent events
	 * @param {number} onUploadProgress progress of the upload as a number
	 * @returns {Promise<AxiosResponse<any>>} response from the server
	 */
	newVideo = async (
		videoURL: string,
		guid: string,
		onUploadProgress
	): Promise<AxiosResponse> => {
		return this.service.post(
			"/upload-video",
			{
				videoURL,
				guid,
			},
			{
				responseType: "json",
				onUploadProgress,
			}
		);
	};
}

export default new UploadService();
