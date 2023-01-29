import axios, { AxiosResponse } from "axios";

class AnalyticsService {
	private service: any;

	constructor() {
		this.service = axios.create({
			baseURL: "/api/events",
			headers: {
				Accept: "application/json",
			},
		});
	}

	/**
	 * Creates a new transcription event in the database and
	 * returns the event object in the response
	 * @param {string} filename original name of the audio/video file being transcribed
	 */
	createTranscriptionEvent = async (
		filename: string
	): Promise<AxiosResponse> => {
		return await this.service.post("/transcriptions", filename);
	};
}

export default new AnalyticsService();
