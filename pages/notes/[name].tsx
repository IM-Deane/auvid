import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import useInternalAPI from '@/hooks/useInternalAPI'
import AnalyticsService from '@/utils/services/analytics-service'
import prettyBytes from 'pretty-bytes'
import siteConfig from 'site.config'

import Layout from '@/components/Layout'
import LoadingSkeleton from '@/components/cards/LoadingSkeleton'

const NoteDetails = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [fileToDownload] = useState<any>('')

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    setLoading(false)
  }, [router.isReady])

  /**
   * This isn't perfect as we can't tell if the user actually downloaded the file.
   * So we're essentially just tracking the event of the user clicking the download button.
   * @param filename name of the current file
   * @returns
   */
  const handleFileDownloadEvent = async (filename) => {
    await AnalyticsService.createNotesDownloadEvent(
      filename,
      file['hasSummary']
    )
  }

  const {
    data: file,
    error,
    isLoading
  } = useInternalAPI(!loading ? `/api/notes/${router.query.name}` : '')

  if (!file || isLoading) return <LoadingSkeleton count={1} large />
  if (error) return error

  return (
    <Layout title={`Notes | ${siteConfig.siteName}`}>
      <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h1 className='text-lg font-medium leading-6 text-gray-900'>
            {file.name}
          </h1>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>ID: {file.id}</p>
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Filename</dt>
              <dd className='mt-1 text-sm text-gray-900'>{file.name}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Created at</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {new Date(file.created_at).toDateString()}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                Last accessed
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {new Date(file.last_accessed_at).toDateString()}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>File Size</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                  {prettyBytes(file.metadata.size)}
                </span>
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>Contents</dt>
              {/* render file contents and adhere to formatting */}
              <dd className='mt-1 whitespace-pre-wrap text-sm text-gray-900 px-3'>
                {file.contents}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dd className='float-right mt-1 text-sm text-gray-900'>
                <a
                  onClick={() => handleFileDownloadEvent(file.name)}
                  href={fileToDownload}
                  download={file.name}
                  className='inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Download File
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  )
}

export default NoteDetails
