import React, { useState } from "react";

import axios from "axios";

function FileUploader({ handleResult }) {
	const [selectedFile, setFile] = useState<File>();
	const [loading, setLoading] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleFileUpload = async () => {
		if (!selectedFile) return;
		setLoading(true);

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
		} finally {
			setLoading(false);
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
					disabled={loading}
					className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					{loading && (
						<svg className="h-4 w-4 animate-spin" viewBox="3 3 18 18">
							<path
								className="fill-blue-800"
								d="M12 5C8.13401 5 5 8.13401 5 12c0 3.866 3.13401 7 7 7 3.866.0 7-3.134 7-7 0-3.86599-3.134-7-7-7zM3 12c0-4.97056 4.02944-9 9-9 4.9706.0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056.0-9-4.0294-9-9z"
							></path>
							<path
								className="fill-blue-100"
								d="M16.9497 7.05015c-2.7336-2.73367-7.16578-2.73367-9.89945.0-.39052.39052-1.02369.39052-1.41421.0-.39053-.39053-.39053-1.02369.0-1.41422 3.51472-3.51472 9.21316-3.51472 12.72796.0C18.7545 6.02646 18.7545 6.65962 18.364 7.05015c-.390599999999999.39052-1.0237.39052-1.4143.0z"
							></path>
						</svg>
					)}
					<span>{loading ? "Loading..." : "Upload file"}</span>
				</button>
			</div>
		</div>
	);
}

export default FileUploader;
