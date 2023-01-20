import { invokeSaveAsDialog } from "recordrtc";

import { useRecorderPermission } from "../hooks";

function AudioRecorder() {
	const recorder = useRecorderPermission("audio");

	const startRecording = async () => {
		recorder.startRecording();
	};
	const stopRecording = async () => {
		await recorder.stopRecording();
		let blob = await recorder.getBlob();

		const formData = new FormData();
		formData.append("key", blob);

		// TODO: send to server

		// xhr.send(formData);

		invokeSaveAsDialog(blob, "recording.wav");
	};

	return (
		<div>
			<h1>Audio Recorder</h1>

			<button onClick={startRecording}> Start recording</button>
			<button onClick={stopRecording}> Stop recording</button>
		</div>
	);
}

export default AudioRecorder;
