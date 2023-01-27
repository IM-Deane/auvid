import { useState, useEffect } from "react";

import { GetServerSidePropsContext } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Layout from "../../components/Layout";

import { Note } from "../../interfaces";

const NoteDetails = ({ fileData, user }: { fileData: Note; user: any }) => {
	const [file, _] = useState<Note>(fileData);
	const [fileToDownload, setFileToDownload] = useState<any>("");

	const supabase = useSupabaseClient();

	useEffect(() => {
		const downloadFileLocally = async () => {
			try {
				// download file from storage
				const { data, error } = await supabase.storage
					.from("notes")
					.download(`${user.id}/${file.name}`);

				if (error) throw new Error("Error downloading file");

				// create file from Blob
				const myFile = new File([data], file.name, {
					type: data.type,
				});

				// save URL that can be used to download the file locally
				setFileToDownload(URL.createObjectURL(myFile));
			} catch (error) {
				console.log(error);
			}
		};
		downloadFileLocally();
	}, []);

	return (
		<Layout title="Notes | RustleAI">
			<div className="overflow-hidden bg-white shadow sm:rounded-lg">
				<div className="px-4 py-5 sm:px-6">
					<h1 className="text-lg font-medium leading-6 text-gray-900">
						{file.name}
					</h1>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">ID: {file.id}</p>
				</div>
				<div className="border-t border-gray-200 px-4 py-5 sm:px-6">
					<dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Filename</dt>
							<dd className="mt-1 text-sm text-gray-900">{file.name}</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">Created at</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{new Date(file.created_at).toDateString()}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">
								Last accessed
							</dt>
							<dd className="mt-1 text-sm text-gray-900">
								{new Date(file.last_accessed_at).toDateString()}
							</dd>
						</div>
						<div className="sm:col-span-1">
							<dt className="text-sm font-medium text-gray-500">File Size</dt>
							<dd className="mt-1 text-sm text-gray-900">
								<span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
									{file.metadata.size} bytes
								</span>
							</dd>
						</div>
						<div className="sm:col-span-2">
							<dt className="text-sm font-medium text-gray-500">Contents</dt>
							{/* render file contents and adhere to formatting */}
							<dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900 px-3">
								{file.contents}
							</dd>
						</div>
						<div className="sm:col-span-2">
							<dd className="float-right mt-1 text-sm text-gray-900">
								<a
									href={fileToDownload}
									download={file.name}
									className="inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Download File
								</a>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</Layout>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabase = createServerSupabaseClient(ctx);
	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	const userID = session.user.id;
	// get file matching ID
	const { data, error } = await supabase.storage.from("notes").list(userID, {
		search: ctx.params.name.toString(),
	});

	if (error) throw new Error(error.message);
	if (!data) throw new Error("File not found");

	// download file to get it's inner contents
	const downloadResponse = await supabase.storage
		.from("notes")
		.download(`${userID}/${ctx.params.name.toString()}`);

	if (downloadResponse.error) throw new Error("Error downloading file");
	if (!downloadResponse.data) throw new Error("File not found");

	// create new object with response data and file contents
	const fileData = { ...data[0] };
	fileData["contents"] = await downloadResponse.data.text();

	return {
		props: {
			fileData,
			user: session.user,
		},
	};
};

export default NoteDetails;
