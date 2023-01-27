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
				</div>
			)}
		</Layout>
	);
};

export default AudioUpload;
