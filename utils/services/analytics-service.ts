import axios, { AxiosResponse } from "axios";

import { EventCountSearchParams } from "../../types/index";

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
	 * Get all analytics events related to the user
	 * @returns {AxiosResponse} response object containing all events
	 */
	getEvents = async (): Promise<AxiosResponse> => {
		return await this.service.get("/");
	};

	/**
	 * Get a count for the specified event(s) related to the user
	 * @param {object} params object containing the event types to count
	 * @returns {AxiosResponse} response object containing all events
	 */
	getEventCounts = async (
		params: EventCountSearchParams
	): Promise<AxiosResponse> => {
		return await this.service.get("/search", { params });
	};

	/**
	 * Creates a new transcription event in the database and
	 * returns the event object in the response
	 * @param {string} filename original name of the audio/video file being transcribed
	 * @returns {AxiosResponse} response object containing the transcription event
	 */
	createTranscriptionEvent = async (
		filename: string
	): Promise<AxiosResponse> => {
		return await this.service.post("/transcriptions", filename);
	};
}

export default new AnalyticsService();
