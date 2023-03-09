import useSWR from 'swr'
import axiosFetcher from '../api/swr'

/**
 * Fetches current user's profile data.
 * @returns {object} `profile`, `isLoading`, `isError`
 */
export function useProfile() {
  const fetcher = async (url) => await axiosFetcher(url)

  const { data, error, isLoading } = useSWR('/api/users/profiles', fetcher)

  return {
    profile: data,
    isLoading,
    isError: error
  }
}

export default useProfile
