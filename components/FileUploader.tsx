import React, { useState } from "react";

import axios from "axios";

function FileUploader({ handleResult }) {
	const [selectedFile, setFile] = useState<File>();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleFileUpload = async () => {
		if (!selectedFile) return;

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await axios.post(
				"http://localhost:3000/api/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (!response.data) throw new Error("Error uploading file");

			console.log(response.data);
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
		}
	};

	return (
		<div className="mt-2">
			<label
				htmlFor="audio-file"
				className="block text-sm font-medium text-gray-700"
			>
				Upload Audio
			</label>
			<div className="relative my-2 rounded-md">
				<input
					type="file"
					name="audio-file"
					id="audio-file"
					className="block w-1/6 pl-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					accept="audio/*"
					onChange={handleFileChange}
				/>
			</div>
			<div className="mt-2">
				<button
					type="button"
					onClick={handleFileUpload}
					className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Upload file
				</button>
			</div>
		</div>
	);
}

export default FileUploader;
