import Layout from "../components/Layout";
import WelcomeHeader from "../components/Dashboard/WelcomeHeader";
import EventCountList from "../components/Dashboard/EventCountList";

const IndexPage = () => {
	return (
		<Layout title="Home | Auvid">
			<WelcomeHeader />
			<section className="mt-8">
				<header>
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Latest actions
					</h3>
				</header>

				<EventCountList />
			</section>
		</Layout>
	);
};

export default IndexPage;
