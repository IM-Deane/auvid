import Link from "next/link";
import Layout from "../components/Layout";

const AboutPage = () => (
	<Layout title="About | RustleAI">
		<h1 className="text-2xl font-semibold text-gray-900">About</h1>
		<p>This is the about page</p>
		<p>
			<Link href="/">Go home</Link>
		</p>
	</Layout>
);

export default AboutPage;
