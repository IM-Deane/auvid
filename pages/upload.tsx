import { useState, useEffect } from "react";

import FileUploader from "../components/FileUploader";
import FileDataCard from "../components/FileDataCard";
import Layout from "../components/Layout";
import Alert from "../components/Alert";

const AudioUpload = () => {
	const [showAlert, setShowAlert] = useState(false);
	const [transcribedText, setTranscribedText] = useState("");
	const [uploadedFile, setUploadedFile] = useState("");
	const [isEditing, setIsEditing] = useState(false); // used to render text form
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
		setIsEditing(true);
	};

	const handleAlertDismiss = () => setShowAlert(false);

	useEffect(() => {
		// hide alert after 5 seconds
		if (showAlert) setTimeout(() => setShowAlert(false), 5000);
	}, [showAlert]);

	return (
		<Layout title="Add new note | RustleAI">
			<div className="my-4 h-10">
				{showAlert && (
					<Alert
						handleAlertDismiss={handleAlertDismiss}
						text={error.status ? error.message : "File uploaded successfully"}
						isError={error.status}
					/>
				)}
			</div>
			<h1 className="text-2xl font-semibold text-gray-900">New Note:</h1>

			<div className="my-7 py-5 px-8">
				<FileUploader handleResult={handleUploadResult} />
			</div>
			{/* render section after file upload */}
			{isEditing && (
				<div className="mt-4 mb-7 py-5 px-8">
					<FileDataCard
						fileData={{
							filename: uploadedFile,
							transcribedText,
						}}
						setShowAlert={setShowAlert}
						setError={setError}
					/>

					{/* <div>
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
					</div> */}

					{/* <div className="mt-3">
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
					</div> */}
					{/* only show button if there's enough text to summarize  */}
					{/* {transcribedText.length > 15 && (
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
					</div>*/}
				</div>
			)}
		</Layout>
	);
};

export default AudioUpload;
