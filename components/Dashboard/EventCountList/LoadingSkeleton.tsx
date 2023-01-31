import React from "react";

function LoadingSkeleton({ count }) {
	const cardList = Array(count).fill(1);

	return (
		<div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{cardList.map((i) => (
				<div className="relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-indigo-300/10 before:to-transparent isolate overflow-hidden shadow-xl shadow-black/5 before:border-t before:border-indigo-400/10">
					<div key={i} className="space-y-5 rounded-2xl bg-indigo-300 p-4">
						<div className="h-24 rounded-lg bg-indigo-100/10"></div>
						<div className="space-y-3" />
					</div>
				</div>
			))}
		</div>
	);
}

export default LoadingSkeleton;
