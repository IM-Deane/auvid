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
	 * Creates a new transcription event in the database.
	 * @param {string} filename original name of the audio/video file being transcribed
	 * @param {string} transcriptionType type of transcription (audio, video, or meeting)
	 * @returns {AxiosResponse} response object containing the transcription event
	 */
	createTranscriptionEvent = async (
		filename: string,
		transcriptionType: string
	): Promise<AxiosResponse> => {
		return await this.service.post("/transcriptions", {
			filename: filename,
			type: transcriptionType,
		});
	};

	/**
	 * Creates a new summaries event in the database and
	 * returns the event object in the response
	 * @param {string} filename original name of the audio/video file being transcribed
	 * @returns {AxiosResponse} response object containing the summaries event
	 */
	createSummariesEvent = async (filename: string): Promise<AxiosResponse> => {
		return await this.service.post("/summaries", { filename });
	};

	/**
	 * Creates a new notes uploaded event in the database.
	 * @param {string} filename original name of the audio/video file being transcribed
	 * @param {string} hasSummary There are a few cases where summaries aren’t added to notes.
	 * We would like to keep tabs on whether they do or don’t.
	 * @returns {AxiosResponse} response object containing the upload event
	 */
	createNotesUploadEvent = async (
		filename: string,
		hasSummary: boolean
	): Promise<AxiosResponse> => {
		return await this.service.post("/notes/upload", {
			filename,
			has_summary: hasSummary,
		});
	};
}

export default new AnalyticsService();
