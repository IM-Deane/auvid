import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";

import { File } from "../interfaces";

import LoadingButton from "./LoadingButton";
import SelectInput from "./SelectInput";

import { fileTypes } from "../utils/enums";

function FileUploadCard({ fileData, setShowAlert, setError }) {
	const { transcribedText } = fileData;

	const [filename, setFilename] = useState<string>(fileData.filename);
	const [documentTitle, setDocumentTitle] = useState<string>("");
	const [summarizedText, setSummarizedText] = useState("");
	const [filetype, setFileType] = useState<File>(fileTypes[0]); // default is TXT
	const [loading, setLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [wordCount, setWordCount] = useState<number>(0);

	const [filenameError, setFilenameError] = useState<string>("");
	const [documentTitleError, setDocumentTitleError] = useState<string>("");

	const router = useRouter();

	const getTranscriptionWordCount = () => {
		if (!transcribedText) return;

		const words = transcribedText.trim().split(" ");
		setWordCount(words.length);
	};

	const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (filenameError) setFilenameError(""); // clear error

		setFilename(e.target.value);
	};

	const handleDocumentTitleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (documentTitleError) setDocumentTitleError(""); // clear error

		setDocumentTitle(e.target.value);
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
			if (!filename) {
				setFilenameError("Filename is required");
				throw new Error("Filename is required");
			} else if (!transcribedText) {
				throw new Error("Transcribed text is required");
			} else if (!documentTitle) {
				setDocumentTitleError("Document title is required");
				throw new Error("Document title is required");
			}

			// add selected extension to filename
			const filenameWithExt = `${filename}${filetype.ext}`;

			const { data } = await axios.post(
				"http://localhost:3000/api/notes/save",
				{
					filename: filenameWithExt,
					fullText: transcribedText,
					notes: summarizedText, // this can be empty
					filetype: filetype.ext,
					documentTitle,
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
		getTranscriptionWordCount();
	}, []);

	return (
		<div>
			<div className="overflow-hidden bg-white shadow sm:rounded-lg">
				<div className="px-4 py-5 sm:px-6">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						2. Confirm Details
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						Filename, summary, and transcription.
					</p>
				</div>
				<div className="border-t border-gray-200 px-4 py-5 sm:p-0">
					<dl className="sm:divide-y sm:divide-gray-200">
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">Filename</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
								<input
									type="text"
									name="filename"
									id="filename"
									value={filename}
									onChange={handleFileNameChange}
									minLength={5}
									maxLength={50}
									required
									className={`block w-full rounded-md border-${
										filenameError ? "red" : "gray"
									}-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
									aria-describedby="filename-input"
								/>
								<p
									className={`mt-2 text-sm text-${
										filenameError ? "red" : "gray"
									}-500`}
									id="filename-description"
								>
									{filenameError
										? filenameError
										: "Choose a memorable name for your file"}
								</p>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">File Type</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								<SelectInput
									label=""
									selected={filetype}
									setSelected={setFileType}
									width="w-1/4"
								/>
							</dd>
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dt className="text-sm font-medium text-gray-500">
								Document Title
							</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
								<input
									type="text"
									name="documentTitle"
									id="documentTitle"
									value={documentTitle}
									onChange={handleDocumentTitleChange}
									minLength={5}
									maxLength={50}
									required
									className={`block w-full rounded-md border-${
										documentTitleError ? "red" : "gray"
									}-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
									aria-describedby="document-title"
								/>
								<p
									className={`mt-2 text-sm text-${
										documentTitleError ? "red" : "gray"
									}-500`}
									id="document-title-description"
								>
									{documentTitleError
										? documentTitleError
										: "The title of your document"}
								</p>
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
							<dt className="text-sm font-medium text-gray-500">
								Full Transcription{" "}
								{wordCount === 1
									? `(${wordCount} word)`
									: `(${wordCount} words)`}
							</dt>
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								{transcribedText}
							</dd>
						</div>
						<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
							<dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
								<div className="mt-4 float-right">
									<LoadingButton
										isLoading={isSaving}
										text="Save note"
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
