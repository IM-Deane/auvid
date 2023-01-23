import { useState, useEffect } from "react";

import Link from "next/link";

import axios from "axios";

import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/20/solid";

import Layout from "../components/Layout";

const NotesList = () => {
	const [files, setFiles] = useState<any[]>([]);

	useEffect(() => {
		const getUserFiles = async () => {
			try {
				const { data } = await axios.get("http://localhost:3000/api/notes");

				if (!data) throw new Error("Error fetching files");

				setFiles(data);
			} catch (error) {
				console.log(error);
			}
		};
		getUserFiles();
	}, []);

	return (
		<Layout title="Notes | RustleAI">
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
									<h3 className=" text-sm font-medium text-gray-900">
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
									<button className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
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

export default NotesList;
