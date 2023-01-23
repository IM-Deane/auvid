import { useState, useEffect } from "react";

import { GetServerSidePropsContext } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Link from "next/link";

import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/20/solid";

import Alert from "../components/Alert";
import Layout from "../components/Layout";

const NotesList = ({ fileList, user }) => {
	const [files, setFiles] = useState<any[]>(fileList);
	const [showAlert, setShowAlert] = useState(false);
	const [error, setError] = useState({
		status: false,
		message: "",
	});

	const supabase = useSupabaseClient();

	const handleAlertDismiss = () => setShowAlert(false);

	// delete single file
	const handleDeleteFile = async (filename) => {
		try {
			const { error } = await supabase.storage
				.from("notes")
				.remove([`${user.id}/${filename}`]);

			if (error) throw new Error(error.message);

			const updatedFiles = files.filter((file) => file.name !== filename);
			setFiles(updatedFiles);
		} catch (error) {
			console.log(error);
			setError({
				status: true,
				message: "There was a problem deleting the file!",
			});
		} finally {
			setShowAlert(true);
		}
	};

	// TODO: remove all file from user's folder
	const handleClearAllFiles = async () => {
		// TODO: create list of all file paths in user's folder
		// const { data, error } = await supabase.storage
		// 	.from("notes")
		// 	.remove([`${user.id}/${filename}`]);
	};

	useEffect(() => {
		// hide alert after 5 seconds
		if (showAlert) setTimeout(() => setShowAlert(false), 5000);
	}, [showAlert]);

	return (
		<Layout title="Notes | RustleAI">
			<div className="my-4 h-10">
				{showAlert && (
					<Alert
						handleAlertDismiss={handleAlertDismiss}
						text={error.status ? error.message : "File successfully deleted!"}
						isError={error.status}
					/>
				)}
			</div>
			<h1 className="mb-5 text-2xl font-semibold text-gray-900">Notes</h1>

			<ul
				role="list"
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{files.map((file) => (
					<li
						key={file.id}
						className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
					>
						<div className="flex w-full items-center justify-between space-x-6 p-6">
							<div className="flex-1 truncate">
								<div className="flex items-center space-x-3">
									<h3 className="truncate text-sm font-medium text-gray-900">
										{file.name}
									</h3>
									<span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
										Size: {file.metadata.size} bytes
									</span>
								</div>
								{/* TODO: add description? */}
								<p className="mt-1 truncate text-sm text-gray-500">
									Last accessed:{" "}
									{new Date(file.last_accessed_at).toDateString()}
								</p>
							</div>
						</div>
						<div>
							<div className="-mt-px flex divide-x divide-gray-200">
								<div className="flex w-0 flex-1">
									<button
										onClick={() => handleDeleteFile(file.name)}
										className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
									>
										<XCircleIcon
											className="h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
										<span className="ml-3">Remove</span>
									</button>
								</div>
								<div className="-ml-px flex w-0 flex-1">
									<Link
										href={`/notes/${file.name}`}
										className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
									>
										<PencilSquareIcon
											className="h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
										<span className="ml-3">Edit</span>
									</Link>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
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
	// get all files from user folder
	const { data, error } = await supabase.storage.from("notes").list(userID, {
		sortBy: { column: "created_at", order: "asc" },
	});

	if (error) throw new Error(error.message);

	// filter out the placeholder file
	const fileList = data.filter(
		(file) => file.name !== ".emptyFolderPlaceholder"
	);

	return {
		props: {
			fileList,
			user: session.user,
		},
	};
};

export default NotesList;
