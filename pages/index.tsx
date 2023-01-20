import { useState } from "react";

import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import Layout from "../components/Layout";

import FileUploader from "../components/FileUploader";
import Alert from "../components/Alert";

const IndexPage = () => {
	const [showAlert, setShowAlert] = useState(false);
	const [error, setError] = useState({
		status: false,
		message: "",
	});

	const session = useSession();
	const supabase = useSupabaseClient();

	const handleUploadResult = (data) => {
		if (!data) {
			setError({ status: true, message: "Error uploading file" });
		} else {
			setError({ status: false, message: "" }); // reset error status
		}

		setShowAlert(true);
	};

	const handleAlertDismiss = () => setShowAlert(false);

	return !session ? (
		<Auth
			supabaseClient={supabase}
			appearance={{ theme: ThemeSupa }}
			theme="dark"
		/>
	) : (
		<Layout title="Home | RustleAI">
			<h1>Hello RustleAI 👋</h1>
			<FileUploader handleResult={handleUploadResult} />
			{showAlert && (
				<Alert
					handleAlertDismiss={handleAlertDismiss}
					text={error.status ? error.message : "File uploaded successfully"}
					isError={error.status}
				/>
			)}
		</Layout>
	);
};

export default IndexPage;
