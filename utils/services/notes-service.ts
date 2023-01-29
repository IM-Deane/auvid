import axios, { AxiosResponse } from "axios";

class NotesService {
	private service: any;

	constructor() {
		this.service = axios.create({
			baseURL: "/api/notes",
			headers: {
				Accept: "application/json",
			},
		});
	}

	/**
	 * Find the user's current note count
	 * @returns {AxiosResponse} response object containing all events
	 */
	getCurrentNotes = async (): Promise<AxiosResponse> => {
		// TODO: thi is slow, should probably cache the note files
		return await this.service.get("/");
	};

	/**
	 * Upload a new note to storage
	 * @returns {AxiosResponse} response object containing all events
	 */
	uploadNote = async (
		filenameWithExt,
		transcribedText,
		summarizedText,
		filetype,
		documentTitle
	): Promise<AxiosResponse> => {
		return await axios.post("/save", {
			filename: filenameWithExt,
			fullText: transcribedText,
			summary: summarizedText, // this can be empty
			filetype: filetype,
			documentTitle,
		});
	};

	/**
	 * Generates a summary of the transcribed text
	 * @returns {AxiosResponse} response object containing all events
	 */
	createNoteSummary = async (transcribedText): Promise<AxiosResponse> => {
		return await axios.post("/summarize", { transcribedText });
	};
}

export default new NotesService();
