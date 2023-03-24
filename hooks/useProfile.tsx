import useSWR from 'swr'

import axiosFetcher from '../utils/swr'

/**
 * Fetches current user's profile data.
 */
export function useProfile() {
  const { data, error, isLoading } = useSWR('/api/users/profile', axiosFetcher)

  return {
    userWithProfile: data,
    isLoading,
    error
  }
}

export default useProfile
