import React from "react";

import Link from "next/link";
import prettyBytes from "pretty-bytes";

import {
	PencilSquareIcon,
	PlusCircleIcon,
	XCircleIcon,
} from "@heroicons/react/20/solid";
import LoadingSkeleton from "../cards/LoadingSkeleton";

function NotesList({ notes, isLoading, setShowModal, handleDeleteFile }) {
	if (isLoading) return <LoadingSkeleton count={6} large />;

	return (
		<>
			<header className="flex justify-center items-center">
				<h1 className="flex-auto w-64 mb-5 text-2xl font-semibold text-gray-900">
					Notes
				</h1>
				{notes.length > 0 && (
					<span
						onClick={() => setShowModal(true)}
						className="flex-none w-32 cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
					>
						Clear All
					</span>
				)}
			</header>

			<ul
				role="list"
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{!notes.length ? (
					<p>
						Nothing to see here...{" "}
						<Link href="/upload">
							<span className="font-medium text-indigo-600 hover:text-indigo-500">
								Add a new note <PlusCircleIcon className="w-4 h-4 inline" />
							</span>
						</Link>
					</p>
				) : (
					notes.map((note) => (
						<li
							key={note.created_at}
							className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
						>
							<div className="flex w-full items-center justify-between space-x-6 p-6">
								<div className="flex-1 truncate">
									<div className="flex items-center space-x-3">
										<h3 className="truncate text-sm font-medium text-gray-900">
											{note.name}
										</h3>
										<span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
											Size: {prettyBytes(note.metadata.size)}
										</span>
									</div>
									{/* TODO: add description? */}
									<p className="mt-1 truncate text-sm text-gray-500">
										Created on: {new Date(note.created_at).toDateString()}
									</p>
								</div>
							</div>
							<div>
								<div className="-mt-px flex divide-x divide-gray-200">
									<div className="flex w-0 flex-1">
										<button
											onClick={() => handleDeleteFile(note.name)}
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
											href={`/notes/${note.name}`}
											className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
										>
											<PencilSquareIcon
												className="h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
											<span className="ml-3">View</span>
										</Link>
									</div>
								</div>
							</div>
						</li>
					))
				)}
			</ul>
		</>
	);
}

export default NotesList;
