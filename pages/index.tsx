import { CheckCircleIcon } from "@heroicons/react/20/solid";

import Layout from "../components/Layout";

type Feature = {
	id: number;
	name: string;
	description: string;
};

const features: Feature[] = [
	{
		id: 0,
		name: "Audio Transcription",
		description:
			"Upload audio files and our AI-powered platform will convert them to text.",
	},
	{
		id: 1,
		name: "Expert Notes",
		description:
			"Watching an educational video on YouTube? Listening to an intense podcast on Spotify? Auvid can summarize the content for you!",
	},
	{
		id: 2,
		name: "Enhanced Summaries",
		description:
			"Optionally summarize transcription files allowing you to quickly get up to speed.",
	},
	{
		id: 3,
		name: "File Storage",
		description: "Cloud-based storage for transcription files and summaries.",
	},
];

const IndexPage = () => {
	return (
		<Layout title="Home | AuvidAI">
			<h1 className="text-2xl font-semibold text-gray-900">
				Welcome to Auvid! 🔊
			</h1>
			<section className="mt-4 mb-8">
				<p className="text-md font-light italic text-gray-900">
					<span className="font-medium italic">
						Auvid (pronounced 'ah-vid'):
					</span>{" "}
					is a web-based service that transcribes and summarizes audio and video
					files.
				</p>
			</section>

			<section className="my-4">
				<header className="border-b border-indigo-300 pb-3 mb-7">
					<h2 className="text-lg font-medium leading-6 text-gray-900">
						Features:
					</h2>
				</header>
				<div className="overflow-hidden bg-white shadow sm:rounded-md">
					<ul role="list" className="divide-y divide-gray-200 py-4">
						{features.map((feature) => (
							<div className="flex items-center h-full">
								<div className="flex-none w-15">
									<CheckCircleIcon
										className="ml-3 mr-1.5 h-5 w-5 flex-shrink-0 text-indigo-400"
										aria-hidden="true"
									/>
								</div>
								<li className="grow">
									<div className="flex items-center px-4 py-4 sm:px-6">
										<div className="flex items-center min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
											<div>
												<p className="truncate text-sm font-medium text-indigo-600">
													{feature.name}
												</p>
											</div>
											<div className="hidden md:block">
												<div>
													<p className="mt-2 text-sm text-gray-500">
														{feature.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								</li>
							</div>
						))}
					</ul>
				</div>
			</section>
		</Layout>
	);
};

export default IndexPage;
