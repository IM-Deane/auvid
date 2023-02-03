import axios, { AxiosResponse } from "axios";
import useSWR from "swr";

import { EventCountSearchParams } from "../../types/index";

class AnalyticsService {
	private service: any;
	private fetcher = async ([url, params]) =>
		await this.service.get(url, { params });

	constructor() {
		this.service = axios.create({
			baseURL: "/api/events",
			headers: {
				Accept: "application/json",
			},
		});

		this.fetcher = this.fetcher.bind(this);
	}

	/**
	 * Get all analytics events related to the user
	 * @returns {AxiosResponse} response object containing all events
	 */
	getEvents = async (): Promise<AxiosResponse> => {
		// TODO: this may need SWR
		return await this.service.get("/");
	};

	/**
	 * Get a count for the specified event(s) related to the user
	 * @param {object} params object containing the event types to count
	 * @returns {object} object containing all events
	 */
	getEventCounts = (params: EventCountSearchParams) => {
		const { data, isLoading, error } = useSWR(
			["/search", params],
			this.fetcher
		);

		return {
			data,
			isLoading,
			error: error,
		};
	};

	/**
	 * Creates a new transcription event in the database.
	 * @param {string} filename original name of the audio/video file being transcribed
	 * @param {string} transcriptionType type of transcription (audio, video, or meeting)
	 * @returns {AxiosResponse} response object containing the transcription event
	 */
	createTranscriptionEvent = async (
		filename: string,
		transcriptionType: string,
		metadata: object = {}
	): Promise<AxiosResponse> => {
		return await this.service.post("/transcriptions", {
			filename: filename,
			type: transcriptionType,
			metadata,
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
	 * @param {string} filename name of the audio/video file being transcribed
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

	/**
	 * Creates a new notes download event in the database.
	 * @param {string} filename name of the audio/video file being transcribed
	 * @param {string} hasSummary There are a few cases where summaries aren’t added to notes.
	 * We would like to keep tabs on whether they do or don’t.
	 * @returns {AxiosResponse} response object containing the upload event
	 */
	createNotesDownloadEvent = async (
		filename: string,
		hasSummary: boolean
	): Promise<AxiosResponse> => {
		return await this.service.post("/notes/download", {
			filename,
			has_summary: hasSummary,
		});
	};
}

export default new AnalyticsService();
