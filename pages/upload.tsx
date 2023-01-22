import { useState } from "react";

import FileUploader from "../components/FileUploader";
import Layout from "../components/Layout";
import Alert from "../components/Alert";

const AudioUpload = () => {
	const [showAlert, setShowAlert] = useState(false);
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

		setShowAlert(true);
	};

	const handleAlertDismiss = () => setShowAlert(false);

	return (
		<Layout title="Upload Audio | RustleAI">
			<h1 className="text-2xl font-semibold text-gray-900">Add new audio</h1>
			<FileUploader handleResult={handleUploadResult} />
			{showAlert && (
				<Alert
					handleAlertDismiss={handleAlertDismiss}
					text={error.status ? error.message : "File uploaded successfully"}
					isError={error.status}
				/>
			)}
		</Layout>
	);
};

export default AudioUpload;
