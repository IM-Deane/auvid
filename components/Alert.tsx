import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function Alert({
	handleAlertDismiss,
	text = "Successfully uploaded",
	isError = false,
}) {
	const alertType = isError ? "red" : "green";

	return (
		<div className={`rounded-md my-5 bg-${alertType}-50 p-4`}>
			<div className="flex">
				<div className="flex-shrink-0">
					<CheckCircleIcon
						className={`h-5 w-5 text-${alertType}-400`}
						aria-hidden="true"
					/>
				</div>
				<div className="ml-3">
					<p className={`text-sm font-medium text-${alertType}-800`}>{text}</p>
				</div>
				<div className="ml-auto pl-3">
					<div className="-mx-1.5 -my-1.5">
						<button
							type="button"
							className={`inline-flex rounded-md bg-${alertType}-50 p-1.5 text-${alertType}-500 hover:bg-${alertType}-100 focus:outline-none focus:ring-2 focus:ring-${alertType}-600 focus:ring-offset-2 focus:ring-offset-${alertType}-50`}
							onClick={handleAlertDismiss}
						>
							<span className="sr-only">Dismiss</span>
							<XMarkIcon className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
