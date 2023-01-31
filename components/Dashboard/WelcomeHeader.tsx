import React from "react";

import useProfile from "../../hooks/useProfile";

function WelcomeHeader() {
	const { profile, isLoading, isError } = useProfile();

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error!</p>;

	return (
		<header>
			<h1 className="text-2xl font-semibold text-gray-900">
				Welcome{" "}
				{profile?.first_name ? `${profile.first_name}!` : "to Auvid! 🔊"}
			</h1>
		</header>
	);
}

export default WelcomeHeader;
