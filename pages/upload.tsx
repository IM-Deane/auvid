import { useState } from "react";

import axios from "axios";

import FileUploader from "../components/FileUploader";
import Layout from "../components/Layout";
import Alert from "../components/Alert";
import LoadingButton from "../components/LoadingButton";

const AudioUpload = () => {
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [transcribedText, setTranscribedText] = useState("");
	const [summarizedText, setSummarizedText] = useState("");
	const [uploadedFile, setUploadedFile] = useState("");
	const [error, setError] = useState({
		status: false,
		message: "",
	});

	const handleUploadResult = (data) => {
		if (!data) {
			setError({ status: true, message: "Error uploading file" });
		} else {
			setError({ status: false, message: "" }); // reset error status
		}

		setTranscribedText(data.transcribedText);
		setUploadedFile(data.filename);
		setShowAlert(true);
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
			{uploadedFile && (
				<div className="mt-5">
					<div>
						<p className="text-base text-black">
							File: <strong>{uploadedFile}</strong>
						</p>
					</div>

					<div className="mt-3">
						<h2 className="text-xl font-semibold text-dark-900">
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
					<div className="mt-4">
						<LoadingButton
							isLoading={loading}
							text={summarizedText ? "Try again" : "Summarize"}
							loadingText="Summarizing..."
							handleClick={handleSummarizeText}
						/>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default AudioUpload;
