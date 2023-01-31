import React, { ReactNode, useState, Fragment } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import { Dialog, Disclosure, Transition } from "@headlessui/react";

import {
	Bars3Icon,
	DocumentDuplicateIcon,
	BookOpenIcon,
	HomeIcon,
	UserCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
	{ name: "Dashboard", icon: HomeIcon, current: true, href: "/" },
	{
		name: "About",
		icon: BookOpenIcon,
		current: false,
		href: "/about",
	},
	{
		name: "Notes",
		icon: DocumentDuplicateIcon,
		current: false,
		children: [
			{ name: "Overview", href: "/notes" },
			{ name: "Add Note", href: "/upload" },
		],
	},
	{
		name: "Account",
		icon: UserCircleIcon,
		current: false,
		children: [
			{ name: "Overview", href: "/account" },
			{ name: "Billing", href: "#" },
			{ name: "Settings", href: "#" },
		],
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

type Props = {
	children?: ReactNode;
	title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const router = useRouter();

	navigation.forEach((item) => {
		if (item.href === router.pathname) {
			item.current = true;
		} else {
			item.current = false;
		}
	});

	return (
		<div>
			<Head>
				<title>{title}</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-40 md:hidden"
						onClose={setSidebarOpen}
					>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>

						<div className="fixed inset-0 z-40 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute top-0 right-0 -mr-12 pt-2">
											<button
												type="button"
												className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XMarkIcon
													className="h-6 w-6 text-white"
													aria-hidden="true"
												/>
											</button>
										</div>
									</Transition.Child>
									<div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
										<div className="flex flex-shrink-0 items-center px-4">
											<img
												className="h-8 w-auto"
												src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
												alt="RustleAI"
											/>
										</div>
										<nav className="mt-5 space-y-1 px-2">
											{navigation.map((item) =>
												!item.children ? (
													<div key={item.name}>
														<Link
															href={item.href}
															className={classNames(
																item.current
																	? "bg-gray-900 text-white"
																	: "text-gray-300 hover:bg-gray-700 hover:text-white",
																"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
															)}
														>
															<item.icon
																className={classNames(
																	item.current
																		? "text-gray-300"
																		: "text-gray-400 group-hover:text-gray-300",
																	"mr-3 flex-shrink-0 h-6 w-6"
																)}
																aria-hidden="true"
															/>
															{item.name}
														</Link>
													</div>
												) : (
													<Disclosure
														as="div"
														key={item.name}
														className="space-y-1"
													>
														{({ open }) => (
															<>
																<Disclosure.Button
																	className={classNames(
																		item.current
																			? "bg-gray-900 text-white"
																			: "text-gray-300 hover:bg-gray-700 hover:text-white",
																		"group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
																	)}
																>
																	<item.icon
																		className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
																		aria-hidden="true"
																	/>
																	<span className="flex-1">{item.name}</span>
																	<svg
																		className={classNames(
																			open
																				? "text-gray-400 rotate-90"
																				: "text-gray-300",
																			"ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400"
																		)}
																		viewBox="0 0 20 20"
																		aria-hidden="true"
																	>
																		<path
																			d="M6 6L14 10L6 14V6Z"
																			fill="currentColor"
																		/>
																	</svg>
																</Disclosure.Button>
																<Disclosure.Panel className="space-y-1">
																	{item.children.map((subItem) => (
																		<Disclosure.Button
																			key={subItem.name}
																			as="a"
																			href={subItem.href}
																			className="group bg-gray-700 flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-300 hover:bg-gray-500 hover:text-white"
																		>
																			{subItem.name}
																		</Disclosure.Button>
																	))}
																</Disclosure.Panel>
															</>
														)}
													</Disclosure>
												)
											)}
										</nav>
									</div>
									<div className="flex flex-shrink-0 bg-gray-700 p-4">
										<a href="#" className="group block flex-shrink-0">
											<div className="flex items-center">
												<div>
													<img
														className="inline-block h-10 w-10 rounded-full"
														src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
														alt=""
													/>
												</div>
												<div className="ml-3">
													<p className="text-base font-medium text-white">
														Test User
													</p>
													<p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
														View profile
													</p>
												</div>
											</div>
										</a>
									</div>
								</Dialog.Panel>
							</Transition.Child>
							<div className="w-14 flex-shrink-0">
								{/* Force sidebar to shrink to fit close icon */}
							</div>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex min-h-0 flex-1 flex-col bg-gray-800">
						<div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
							<div className="flex flex-shrink-0 items-center px-4">
								<img
									className="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
									alt="Your Company"
								/>
							</div>
							<nav className="mt-5 flex-1 space-y-1 px-2">
								{navigation.map((item) =>
									!item.children ? (
										<div key={item.name}>
											<Link
												href={item.href}
												className={classNames(
													item.current
														? "bg-gray-900 text-white"
														: "text-gray-300 hover:bg-gray-700 hover:text-white",
													"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
												)}
											>
												<item.icon
													className={classNames(
														item.current
															? "text-gray-300"
															: "text-gray-400 group-hover:text-gray-300",
														"mr-3 flex-shrink-0 h-6 w-6"
													)}
													aria-hidden="true"
												/>
												{item.name}
											</Link>
										</div>
									) : (
										<Disclosure as="div" key={item.name} className="space-y-1">
											{({ open }) => (
												<>
													<Disclosure.Button
														className={classNames(
															item.current
																? "bg-gray-900 text-white"
																: "text-gray-300 hover:bg-gray-700 hover:text-white",
															"group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
														)}
													>
														<item.icon
															className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
															aria-hidden="true"
														/>
														<span className="flex-1">{item.name}</span>
														<svg
															className={classNames(
																open
																	? "text-gray-400 rotate-90"
																	: "text-gray-300",
																"ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400"
															)}
															viewBox="0 0 20 20"
															aria-hidden="true"
														>
															<path
																d="M6 6L14 10L6 14V6Z"
																fill="currentColor"
															/>
														</svg>
													</Disclosure.Button>
													<Disclosure.Panel className="space-y-1">
														{item.children.map((subItem) => (
															<Disclosure.Button
																key={subItem.name}
																as="a"
																href={subItem.href}
																className="group bg-gray-700 flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-300 hover:bg-gray-500 hover:text-white"
															>
																{subItem.name}
															</Disclosure.Button>
														))}
													</Disclosure.Panel>
												</>
											)}
										</Disclosure>
									)
								)}
							</nav>
						</div>
						<div className="flex flex-shrink-0 bg-gray-700 p-4">
							<Link
								href="/account"
								className="group block w-full flex-shrink-0"
							>
								<div className="flex items-center">
									<div>
										<img
											className="inline-block h-9 w-9 rounded-full"
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-white">Test User</p>
										<p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
											View profile
										</p>
									</div>
								</div>
							</Link>
						</div>
					</div>
				</div>
				<div className="flex flex-1 flex-col md:pl-64">
					<div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
						<button
							type="button"
							className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<main className="flex-1">
						<div className="py-6">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
								{children}
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default Layout;
