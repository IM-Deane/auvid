import { useEffect, useState } from "react";

import Link from "next/link";

import Layout from "../components/Layout";

import AnalyticsService from "../utils/services/analytics-service";
import NotesService from "../utils/services/notes-service";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

import { Profile, NoteFile } from "../interfaces";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

import { EnvelopeOpenIcon } from "@heroicons/react/24/outline";

type EventCounts = {
	[key: string]: number;
};

const IndexPage = () => {
	const [profile, setProfile] = useState<Profile>(null);
	const [eventCounts, setEventCounts] = useState<EventCounts>({});
	const [currentNotes, setCurrentNotes] = useState<NoteFile[]>([]);

	useEffect(() => {
		const getInitialData = async () => {
			try {
				const res = await AnalyticsService.getEvents();
				const countResponse = await AnalyticsService.getEventCounts({
					transcriptions: true,
					summaries: true,
					notes: true,
				});
				const noteResponse = await NotesService.getCurrentNotes();

				setEventCounts(countResponse.data.counts);
				setProfile(res.data.profile);
				setCurrentNotes(noteResponse.data);
			} catch (error) {
				console.log(error);
			}
		};
		getInitialData();
	}, []);

	return (
		<Layout title="Home | Auvid">
			<h1 className="text-2xl font-semibold text-gray-900">
				Welcome{" "}
				{profile?.first_name ? `${profile.first_name}!` : "to Auvid! 🔊"}
			</h1>

			<section className="mt-8">
				<header>
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Latest actions
					</h3>
				</header>

				<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{eventCounts &&
						Object.entries(eventCounts).map(([key, value]) => (
							<div
								key={key + Date.now().toLocaleString()}
								className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
							>
								<dt>
									<div className="absolute rounded-md bg-indigo-500 p-3">
										<EnvelopeOpenIcon
											className="h-6 w-6 text-white"
											aria-hidden="true"
										/>
									</div>
									<p className="ml-16 truncate text-sm font-medium text-gray-500">
										Total {key.charAt(0).toUpperCase() + key.slice(1)}
									</p>
								</dt>
								<dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
									<p className="text-2xl font-semibold text-gray-900">
										{value}
									</p>
									<p
										className={classNames(
											value > 0 ? "text-green-600" : "text-red-600",
											"ml-2 flex items-baseline text-sm font-semibold"
										)}
									>
										{value > 0 ? (
											<ArrowUpIcon
												className="h-5 w-5 flex-shrink-0 self-center text-green-500"
												aria-hidden="true"
											/>
										) : (
											<ArrowDownIcon
												className="h-5 w-5 flex-shrink-0 self-center text-red-500"
												aria-hidden="true"
											/>
										)}

										<span className="sr-only">
											{" "}
											{value > 0 ? "Increased" : "Decreased"} by{" "}
										</span>
										{value}
									</p>
									<div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
										{key === "notes" && (
											<div className="text-sm">
												<Link
													href="/notes"
													className="font-medium text-indigo-600 hover:text-indigo-500"
												>
													{" "}
													View all
													<span className="sr-only"> {key} stats</span>
												</Link>
											</div>
										)}
									</div>
								</dd>
							</div>
						))}
				</dl>
			</section>

			<section className="mt-8">
				<header>
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Note events
					</h3>
				</header>

				<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					<div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
						<dt>
							<div className="absolute rounded-md bg-indigo-500 p-3">
								<EnvelopeOpenIcon
									className="h-6 w-6 text-white"
									aria-hidden="true"
								/>
							</div>
							<p className="ml-16 truncate text-sm font-medium text-gray-500">
								Total notes created
							</p>
						</dt>
						<dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
							<p className="text-2xl font-semibold text-gray-900">
								{eventCounts.notes}
							</p>
							<p
								className={classNames(
									"increase" === "increase" ? "text-green-600" : "text-red-600",
									"ml-2 flex items-baseline text-sm font-semibold"
								)}
							>
								{"increase" === "increase" ? (
									<ArrowUpIcon
										className="h-5 w-5 flex-shrink-0 self-center text-green-500"
										aria-hidden="true"
									/>
								) : (
									<ArrowDownIcon
										className="h-5 w-5 flex-shrink-0 self-center text-red-500"
										aria-hidden="true"
									/>
								)}

								<span className="sr-only">
									{" "}
									{"increase" === "increase"
										? "Increased"
										: "Decreased"} by{" "}
								</span>
								{"increase"}
							</p>
							<div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6" />
						</dd>
					</div>
				</dl>
				<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					<div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
						<dt>
							<div className="absolute rounded-md bg-indigo-500 p-3">
								<EnvelopeOpenIcon
									className="h-6 w-6 text-white"
									aria-hidden="true"
								/>
							</div>
							<p className="ml-16 truncate text-sm font-medium text-gray-500">
								Current notes
							</p>
						</dt>
						<dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
							<p className="text-2xl font-semibold text-gray-900">
								{currentNotes.length}
							</p>
							<p
								className={classNames(
									"increase" === "increase" ? "text-green-600" : "text-red-600",
									"ml-2 flex items-baseline text-sm font-semibold"
								)}
							>
								{"increase" === "increase" ? (
									<ArrowUpIcon
										className="h-5 w-5 flex-shrink-0 self-center text-green-500"
										aria-hidden="true"
									/>
								) : (
									<ArrowDownIcon
										className="h-5 w-5 flex-shrink-0 self-center text-red-500"
										aria-hidden="true"
									/>
								)}

								<span className="sr-only">
									{" "}
									{"increase" === "increase"
										? "Increased"
										: "Decreased"} by{" "}
								</span>
								{"increase"}
							</p>
							<div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
								<div className="text-sm">
									<Link
										href="/notes"
										className="font-medium text-indigo-600 hover:text-indigo-500"
									>
										{" "}
										View all
										<span className="sr-only"> Note stats</span>
									</Link>
								</div>
							</div>
						</dd>
					</div>
				</dl>
				<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					<div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
						<dt>
							<div className="absolute rounded-md bg-indigo-500 p-3">
								<EnvelopeOpenIcon
									className="h-6 w-6 text-white"
									aria-hidden="true"
								/>
							</div>
							<p className="ml-16 truncate text-sm font-medium text-gray-500">
								Latest note
							</p>
						</dt>
						<dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
							<p className="text-l font-semibold text-gray-900">
								{currentNotes[0]?.name}
							</p>
							<p
								className={classNames(
									"increase" === "increase" ? "text-green-600" : "text-red-600",
									"ml-2 flex items-baseline text-sm font-semibold"
								)}
							>
								{"increase" === "increase" ? (
									<ArrowUpIcon
										className="h-5 w-5 flex-shrink-0 self-center text-green-500"
										aria-hidden="true"
									/>
								) : (
									<ArrowDownIcon
										className="h-5 w-5 flex-shrink-0 self-center text-red-500"
										aria-hidden="true"
									/>
								)}

								<span className="sr-only">
									{" "}
									{"increase" === "increase"
										? "Increased"
										: "Decreased"} by{" "}
								</span>
								{"increase"}
							</p>
							<div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
								<div className="text-sm">
									<Link
										href={`/notes/${currentNotes[0]?.name}`}
										className="font-medium text-indigo-600 hover:text-indigo-500"
									>
										{" "}
										View
										<span className="sr-only">Latest note</span>
									</Link>
								</div>
							</div>
						</dd>
					</div>
				</dl>
			</section>
		</Layout>
	);
};

export default IndexPage;
