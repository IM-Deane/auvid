import axios from "axios";

/**
 * Reusable data fetcher to be paired with `useSWR`.
 * @param {string} url route to fetch data from
 * @param {*} args any additional arguments to pass to axios
 * @returns {object}
 */
const axiosFetcher = (url: string, ...args) =>
	axios.get(url, ...args).then((res) => res.data);

export default axiosFetcher;
