import { useState, useEffect } from "react";

import axios from "axios";

import { useRouter } from "next/router";

import FileUploader from "../components/FileUploader";
import Layout from "../components/Layout";
import Alert from "../components/Alert";
import LoadingButton from "../components/LoadingButton";

const AudioUpload = () => {
	const [loading, setLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [transcribedText, setTranscribedText] = useState("");
	const [summarizedText, setSummarizedText] = useState("");
	const [uploadedFile, setUploadedFile] = useState("");
	const [isEditing, setIsEditing] = useState(false); // used to render text form
	const [error, setError] = useState({
		status: false,
		message: "",
	});

	const router = useRouter();

	const handleUploadResult = (data) => {
		if (!data) {
			setError({ status: true, message: "Error uploading file" });
		} else {
			setError({ status: false, message: "" }); // reset error status
		}

		setTranscribedText(data.transcribedText);
		setUploadedFile(data.filename);
		setShowAlert(true);
		setIsEditing(true);
	};

	const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUploadedFile(e.target.value);
	};

	const handleAlertDismiss = () => setShowAlert(false);

	const handleSummarizeText = async () => {
		setLoading(true);

		try {
			const response = await axios.post("http://localhost:3000/api/summarize", {
				transcribedText,
			});

			if (!response.data) throw new Error("Error summarizing text");

			setSummarizedText(response.data);
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
		} finally {
			setLoading(false);
		}
	};

	const handleSaveNotes = async () => {
		setIsSaving(true);

		try {
			if (!uploadedFile || !transcribedText)
				throw new Error("Missing required fields");

			const { data } = await axios.post(
				"http://localhost:3000/api/notes/save",
				{
					filename: uploadedFile,
					fullText: transcribedText,
					notes: summarizedText, // this can be empty
				}
			);

			if (!data) throw new Error("Error saving notes");

			setShowAlert(true);
			// redirect to notes page after 3 seconds
			setTimeout(() => (router.push(`/notes/${data.filename}`), 3000));
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
			setError({ status: true, message: "Error saving notes" });
			setShowAlert(true);
			console.log(error.config);
		} finally {
			setIsSaving(false);
		}
	};

	useEffect(() => {
		// hide alert after 5 seconds
		if (showAlert) setTimeout(() => setShowAlert(false), 5000);
	}, [showAlert]);

	return (
		<Layout title="Upload Audio | RustleAI">
			<div className="my-4 h-10">
				{showAlert && (
					<Alert
						handleAlertDismiss={handleAlertDismiss}
						text={error.status ? error.message : "File uploaded successfully"}
						isError={error.status}
					/>
				)}
			</div>
			<h1 className="text-2xl font-semibold text-gray-900">Audio</h1>
			<FileUploader handleResult={handleUploadResult} />
			{/* render section after file upload */}
			{isEditing && (
				<div className="mt-5">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Filename:
						</label>
						<div className="mt-1">
							<input
								type="text"
								name="filename"
								id="filename"
								value={uploadedFile}
								onChange={handleUploadFileChange}
								minLength={5}
								maxLength={50}
								className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								aria-describedby="filename-input"
							/>
						</div>
						<p className="mt-2 text-sm text-gray-500" id="filename-description">
							A memorable name for your file
						</p>
					</div>

					<div className="mt-3">
						<h2 className="text-xl my-6 font-semibold text-dark-900">
							Transcribed Text:
						</h2>
						{summarizedText && (
							<div className="my-4">
								<h3 className="text-l font-semibold text-dark-900">TLDR:</h3>
								<p className="text-lg text-black bg-yellow-200 p-3">
									{summarizedText}
								</p>
							</div>
						)}
						<h3 className="text-xl font-semibold text-dark-900">Full Text:</h3>
						<p className="text-xl text-black p-3">{transcribedText}</p>
					</div>
					{/* only show button if there's enough text to summarize  */}
					{transcribedText.length > 15 && (
						<div className="mt-4">
							<LoadingButton
								isLoading={loading}
								text={summarizedText ? "Try again" : "Summarize"}
								loadingText="Summarizing..."
								handleClick={handleSummarizeText}
							/>
						</div>
					)}

					<div className="mt-4">
						<LoadingButton
							isLoading={isSaving}
							text="Save to notes"
							loadingText="Saving..."
							handleClick={handleSaveNotes}
						/>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default AudioUpload;
