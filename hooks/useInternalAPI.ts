import axiosFetcher from '@/utils/swr'
import useSWR from 'swr'

export interface Config {
  refreshInterval: number
}

/**
 * Hook that leverages useSWR and custom axios fetcher to retrieve data
 * from our server.
 * @param apiPath - if apiPath is not provided we assume conditional GET
 */
function useInternalAPI(apiPath?: string, config?: Config) {
  if (apiPath && !apiPath.includes('/api'))
    throw new Error('Path must start with "/api"')

  const { data, error, isLoading } = useSWR(
    apiPath ? apiPath : null,
    axiosFetcher,
    {
      ...config
    }
  )

  return {
    data,
    isLoading,
    error
  }
}

export default useInternalAPI
