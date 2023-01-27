import { useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";

import { File } from "../interfaces";

import LoadingButton from "./LoadingButton";
import SelectInput from "./SelectInput";

import { fileTypes } from "../utils/enums";

function FileUploadCard({ fileData, setShowAlert, setError }) {
	const { transcribedText } = fileData;

	const [filename, setFilename] = useState(fileData.filename);
	const [summarizedText, setSummarizedText] = useState("");
	const [filetype, setFileType] = useState<File>(fileTypes[0]); // default is PDF
	const [loading, setLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const router = useRouter();

	const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilename(e.target.value);
	};

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
			if (!filename || !transcribedText)
				throw new Error("Missing required fields");

			const { data } = await axios.post(
				"http://localhost:3000/api/notes/save",
				{
					filename: filename,
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

	return (
		<div>
			<div className="overflow-hidden bg-white shadow sm:rounded-lg">
				<div className="px-4 py-5 sm:px-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Upload Overview
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						Filename, summary, and transcription.
					</p>
				</div>
				<div className="border-t border-gray-200 px-4 py-5 sm:p-0">
					<dl className="sm:divide-y sm:divide-gray-200">
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							{/* <dt className="text-sm font-medium text-gray-500">Filename</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								{filename}
							</dd> */}

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
										value={filename}
										onChange={handleFileNameChange}
										minLength={5}
										maxLength={50}
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										aria-describedby="filename-input"
									/>
								</div>
								<p
									className="mt-2 text-sm text-gray-500"
									id="filename-description"
								>
									Choose a memorable name for your file
								</p>
							</div>
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">File Type</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								<SelectInput
									label=""
									selected={filetype}
									setSelected={setFileType}
									width="w-1/2"
								/>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">Summary</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								{summarizedText}
							</dd>
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
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">Full Text</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								{transcribedText}
							</dd>
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
								<div className="mt-4 float-right">
									<LoadingButton
										isLoading={isSaving}
										text="Save to notes"
										loadingText="Saving..."
										handleClick={handleSaveNotes}
									/>
								</div>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	);
}

export default FileUploadCard;
