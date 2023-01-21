import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";

import { FullUser } from "../interfaces";

export default function Account({ user }: { user: FullUser }) {
	const supabase = useSupabaseClient<Database>();
	const [loading, setLoading] = useState(false);

	// user data
	const [email, setEmail] = useState<FullUser["email"]>("");
	const [username, setUsername] =
		useState<FullUser["profile"]["username"]>(null);
	const [avatar_url, setAvatarUrl] =
		useState<FullUser["profile"]["avatar_url"]>(null);
	const [firstName, setFirstName] =
		useState<FullUser["profile"]["first_name"]>(null);
	const [lastName, setLastName] =
		useState<FullUser["profile"]["last_name"]>(null);

	console.log(user);

	async function updateUser() {
		try {
			setLoading(true);
			if (!user) throw new Error("No user found");

			const updates = {
				id: user.id,
				username,
				first_name: firstName,
				last_name: lastName,
				avatar_url,
				updated_at: new Date().toISOString(),
			};

			let { error } = await supabase.from("profiles").upsert(updates);
			if (error) throw error;
			alert("Profile updated!");
		} catch (error) {
			alert("Error updating the data!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className="space-y-8 divide-y divide-gray-200">
			<div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
				<div className="space-y-6 sm:space-y-5">
					<div>
						<h3 className="text-lg font-medium leading-6 text-gray-900">
							Profile
						</h3>
					</div>

					<div className="space-y-6 sm:space-y-5">
						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>
								Username
							</label>
							<div className="mt-1 sm:col-span-2 sm:mt-0">
								<div className="flex max-w-lg rounded-md shadow-sm">
									<input
										type="text"
										name="username"
										id="username"
										autoComplete="username"
										className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
							<label
								htmlFor="photo"
								className="block text-sm font-medium text-gray-700"
							>
								Photo
							</label>
							<div className="mt-1 sm:col-span-2 sm:mt-0">
								<div className="flex items-center">
									<span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
										<svg
											className="h-full w-full text-gray-300"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
									</span>
									<button
										type="button"
										className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Change
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
					<div>
						<h3 className="text-lg font-medium leading-6 text-gray-900">
							Personal Information
						</h3>
					</div>
					<div className="space-y-6 sm:space-y-5">
						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
							<label
								htmlFor="first-name"
								className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>
								First name
							</label>
							<div className="mt-1 sm:col-span-2 sm:mt-0">
								<input
									type="text"
									name="first-name"
									id="first-name"
									autoComplete="given-name"
									className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
								/>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
							<label
								htmlFor="last-name"
								className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>
								Last name
							</label>
							<div className="mt-1 sm:col-span-2 sm:mt-0">
								<input
									type="text"
									name="last-name"
									id="last-name"
									autoComplete="family-name"
									className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
								/>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
							>
								Email address
							</label>
							<div className="mt-1 sm:col-span-2 sm:mt-0">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="pt-5">
				<div className="flex justify-end">
					<button
						type="button"
						className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Save
					</button>
				</div>
			</div>
		</form>
	);
}
