import React, { useState } from "react";

import UploadService from "../../utils/services/upload-service";
import AnalyticsService from "../../utils/services/analytics-service";

import LoadingButton from "../LoadingButton";

import { TranscriptionType } from "../../utils/enums";

function VideoLinkUploader({ handleResult }) {
	const [videoURLInput, setVideoURLInput] = useState<string>("");
	const [videoInputError, setVideoInputError] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [isProcessingVideo, setIsProcessingVideo] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [transcribeProgress, setTranscribeProgress] = useState<number>(1);
	const [completionTime, setCompletionTime] = useState<number>(0);

	const handleVideoInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		if (videoInputError) setVideoInputError("");

		setVideoURLInput(event.target.value);
	};

	/**
	 * Handles file upload and transcription progress updates
	 */
	const handleSubmit = (): void => {
		if (!videoURLInput) {
			setVideoInputError("Please enter a valid video URL.");
			return;
		} else if (!videoURLInput.includes("youtube.com")) {
			setVideoInputError("Please enter a valid YouTube video URL.");
			return;
		}

		try {
			new URL(videoURLInput);
		} catch (_) {
			setVideoInputError("Video URL must contain http or https.");
			return;
		}

		setUploadProgress(0);
		setIsProcessingVideo(true);

		// establish SSE connection
		const eventSrc = new EventSource(
			`${process.env.NEXT_PUBLIC_SSE_URL}/api/events/progress`
		);

		let guidValue = null;

		// initial client ID event
		eventSrc.addEventListener("GUID", (event) => {
			guidValue = event.data;

			// progress updates for this client
			eventSrc.addEventListener(guidValue, (event) => {
				const { progress } = JSON.parse(event.data);

				if (transcribeProgress !== progress) {
					setTranscribeProgress(progress);
				}
				if (progress === 100) {
					setTranscribeProgress(progress);
					eventSrc.close(); // transcription complete
				}
			});

			uploadVideoByURL(
				videoURLInput,
				guidValue,
				// calculate progress for initial upload (not transcription). Might not need this.
				(fileUploadEvent) =>
					setUploadProgress(
						Math.round((100 * fileUploadEvent.loaded) / fileUploadEvent.total)
					)
			);
		});

		eventSrc.onerror = (event) => {
			console.log("An error occurred while attempting to connect.", event);

			eventSrc.close();
			setTranscribeProgress(1);
		};

		if (transcribeProgress === 100) eventSrc.close();
	};

	/**
	 * Sends a request to the server to transcribe video via URL
	 * @param videoURL
	 * @param guid used to identify the client for server event emitter
	 * @param uploadProgress a callback function that updates upload progress
	 */
	const uploadVideoByURL = async (
		videoURL: string,
		guid: string,
		uploadProgress: Function
	) => {
		setLoading(true);

		try {
			const response = await UploadService.newVideo(
				videoURL,
				guid,
				uploadProgress
			);
			console.log("video response", response);

			// side effect: track transcription usage
			await AnalyticsService.createTranscriptionEvent(
				response.data.filename,
				TranscriptionType.video
			);

			setCompletionTime(response.data.completionTimeInSeconds);

			handleResult(response.data);
		} catch (error) {
			if (error.response) {
				// response with status code other than 2xx
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// no response from server
				console.log(error.request);
			} else {
				// something wrong with request
				console.log(error);
			}
			console.log(error.config);

			// reset state
			setUploadProgress(0);
			setTranscribeProgress(1);
			setIsProcessingVideo(false);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Method that calculates and sets the total progress of the upload
	 * and transcription process.
	 */
	const getTotalProgress = () => {
		const progress = Math.round(
			((uploadProgress + transcribeProgress) / 200) * 100
		);
		return progress;
	};

	// Render TailwindCSS classes based on whether there is an error
	const getInputFieldClasses = (): string =>
		videoInputError
			? "block w-full rounded-md text-red-900 border-red-300 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
			: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

	return (
		<div className="mt-2">
			<div className="mt-5 md:col-span-2 md:mt-0 flex flex-col items-center">
				{/* Progress bar */}
				<div className="my-6 py-5 w-full">
					{isProcessingVideo && (
						<div className="min-h-24">
							<h4 className="sr-only">Status</h4>
							<p className="text-sm font-medium text-gray-900">
								{uploadProgress < 100 && transcribeProgress < 100
									? "Transcribing video..."
									: ""}
							</p>
							<div className="mt-6" aria-hidden="true">
								{/* upload segment */}
								<div className="overflow-hidden rounded-full bg-gray-200">
									<div
										className="h-2 rounded-full bg-indigo-600"
										style={{
											width: `${getTotalProgress()}%`,
										}}
									/>
								</div>
								<div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
									<div className="text-indigo-600">Finding video</div>
									<div
										className={`text-center ${
											uploadProgress === 100 ? "text-indigo-600" : ""
										}`}
									>
										Extracting audio
									</div>
									<div
										className={`text-center ${
											transcribeProgress >= 50 ? "text-indigo-600" : ""
										}`}
									>
										Saving changes
									</div>
									<div
										className={`text-right ${
											transcribeProgress === 100 ? "text-indigo-600" : ""
										}`}
									>
										Completed
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="w-1/2 shadow sm:overflow-hidden sm:rounded-md">
					<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
						<div className="w-full">
							<label
								htmlFor="video-link"
								className="block text-lg font-medium text-gray-700 mb-4"
							>
								Enter YouTube video link
							</label>
							<div className="mt-1">
								<input
									type="text"
									name="video-link"
									id="video-link"
									required
									minLength={10}
									maxLength={80}
									value={videoURLInput}
									onChange={handleVideoInputChange}
									className={getInputFieldClasses()}
									placeholder="https://www.youtube.com/funny-podcast-episode-6"
									aria-describedby="video-description"
								/>
							</div>
							{completionTime ? (
								<p
									className="mt-2 text-sm text-gray-500"
									id="video-completion-time"
								>
									{completionTime}
								</p>
							) : (
								<p
									className={`mt-2 text-sm text-${
										videoInputError ? "red" : "gray"
									}-500" id="video-description`}
								>
									{videoInputError
										? videoInputError
										: "We will transcribe the video at the provided link."}
								</p>
							)}
						</div>
					</div>

					<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
						<LoadingButton
							isLoading={loading}
							text="Transcribe Video"
							loadingText="Processing..."
							handleClick={handleSubmit}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VideoLinkUploader;
