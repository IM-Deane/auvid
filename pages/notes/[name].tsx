import { useState, useEffect } from "react";

import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";

import {
	PaperClipIcon,
	PencilSquareIcon,
	XCircleIcon,
} from "@heroicons/react/20/solid";

import Layout from "../../components/Layout";

import { Note } from "../../interfaces";

const NoteDetails = ({ fileData }: { fileData: Note }) => {
	const [file, setFile] = useState<Note>(fileData);

	console.log(file);

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
								{file.metadata.size} bytes
							</dd>
						</div>
						<div className="sm:col-span-2">
							<dt className="text-sm font-medium text-gray-500">Summary</dt>
							<dd className="mt-1 text-sm text-gray-900">
								Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
								incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
								consequat sint. Sit id mollit nulla mollit nostrud in ea officia
								proident. Irure nostrud pariatur mollit ad adipisicing
								reprehenderit deserunt qui eu.
							</dd>
						</div>
						<div className="sm:col-span-2">
							<dt className="text-sm font-medium text-gray-500">Attachments</dt>
							<dd className="mt-1 text-sm text-gray-900">
								<ul
									role="list"
									className="divide-y divide-gray-200 rounded-md border border-gray-200"
								>
									<li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
										<div className="flex w-0 flex-1 items-center">
											<PaperClipIcon
												className="h-5 w-5 flex-shrink-0 text-gray-400"
												aria-hidden="true"
											/>
											<span className="ml-2 w-0 flex-1 truncate">
												resume_back_end_developer.pdf
											</span>
										</div>
										<div className="ml-4 flex-shrink-0">
											<a
												href="#"
												className="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Download
											</a>
										</div>
									</li>
									<li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
										<div className="flex w-0 flex-1 items-center">
											<PaperClipIcon
												className="h-5 w-5 flex-shrink-0 text-gray-400"
												aria-hidden="true"
											/>
											<span className="ml-2 w-0 flex-1 truncate">
												coverletter_back_end_developer.pdf
											</span>
										</div>
										<div className="ml-4 flex-shrink-0">
											<a
												href="#"
												className="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Download
											</a>
										</div>
									</li>
								</ul>
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

	console.log(ctx.params.name.toString());
	const userID = session.user.id;
	// get file matching ID
	const { data, error } = await supabase.storage.from("notes").list(userID, {
		search: ctx.params.name.toString(),
	});

	// TODO: get files inner contents

	if (error) throw new Error(error.message);

	if (!data) throw new Error("File not found");

	return {
		props: {
			fileData: data[0],
		},
	};
};

export default NoteDetails;
