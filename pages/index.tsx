import Layout from "../components/Layout";

import FileUploader from "../components/FileUploader";

const IndexPage = () => (
	<Layout title="Home | RustleAI">
		<h1>Hello RustleAI 👋</h1>
		<FileUploader />
	</Layout>
);

export default IndexPage;
