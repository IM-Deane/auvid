import { useState, useEffect } from "react";

import Alert from "../components/Alert";
import FileDataCard from "../components/FileDataCard";
import FileUploader from "../components/FileUploader";
import FileUploadTabs from "../components/FileUploaders/FileUploadTabs";
import Layout from "../components/Layout";
import VideoLinkUploader from "../components/FileUploaders/VideoLinkUploader";

import { SpeakerWaveIcon, VideoCameraIcon } from "@heroicons/react/20/solid";

const AudioUpload = () => {
	const [showAlert, setShowAlert] = useState(false);
	const [transcribedText, setTranscribedText] = useState("");
	const [uploadedFile, setUploadedFile] = useState("");
	const [isEditing, setIsEditing] = useState(false); // used to render text form
	const [currentTab, setCurrentTab] = useState(0); // used to render text form
	const [tabs, setTabs] = useState([
		{ id: 0, name: "Video", icon: VideoCameraIcon, current: true },
		{ id: 1, name: "Audio", icon: SpeakerWaveIcon, current: false },
	]);
	const [error, setError] = useState({
		status: false,
		message: "",
	});

	// const tabs = [
	// 	{ id: 0, name: "Video", icon: VideoCameraIcon, current: true },
	// 	{ id: 1, name: "Audio", icon: SpeakerWaveIcon, current: false },
	// ];

	const handleTabChange = (tabId) => {
		const newTabs = tabs.map((t) => {
			if (t.id === tabId) {
				return { ...t, current: true };
			} else {
				return { ...t, current: false };
			}
		});

		setTabs(newTabs);
	};

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
			<FileUploadTabs tabs={tabs} handleTabChange={handleTabChange} />
			{/* render chosen uploader */}
			<div className="mb-7 py-5 px-8">
				{tabs.map((tab) => {
					if (tab.current && tab.name === "Video") {
						return <VideoLinkUploader handleResult={handleUploadResult} />;
					} else if (tab.current && tab.name === "Audio") {
						return <FileUploader handleResult={handleUploadResult} />;
					}
				})}
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
