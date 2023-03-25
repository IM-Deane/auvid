import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { File } from '@/supabase/types/index'
import toast from 'react-hot-toast'

import { trimEdgesAndCapitalizeFirstLetter } from '../utils'
import { fileTypes } from '../utils/enums'
import AnalyticsService from '../utils/services/analytics-service'
import NotesService from '../utils/services/notes-service'
import LoadingButton from './LoadingButton'
import SelectInput from './SelectInput'
import ToastAlert from './ToastAlert'

function FileUploadCard({ fileData }) {
  let { transcribedText } = fileData
  // format transcription
  transcribedText = trimEdgesAndCapitalizeFirstLetter(transcribedText)

  const [filename, setFilename] = useState<string>(fileData.filename)
  const [documentTitle, setDocumentTitle] = useState<string>('')
  const [summarizedText, setSummarizedText] = useState<string>('')
  const [filetype, setFileType] = useState<File>(fileTypes[0]) // default is TXT
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [transcriptWordCount, setTranscriptWordCount] = useState<number>(0)
  const [summaryWordCount, setSummaryWordCount] = useState<number>(0)

  const [filenameError, setFilenameError] = useState<string>('')
  const [documentTitleError, setDocumentTitleError] = useState<string>('')

  const router = useRouter()

  const getWordCounts = () => {
    if (!transcribedText) return

    if (summarizedText) {
      const summaryWords = summarizedText.trim().split(' ')
      setSummaryWordCount(summaryWords.length)
    }

    const words = transcribedText.trim().split(' ')
    setTranscriptWordCount(words.length)
  }

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filenameError) setFilenameError('')

    setFilename(e.target.value)
  }

  const handleDocumentTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (documentTitleError) setDocumentTitleError('')

    setDocumentTitle(e.target.value)
  }

  const handleSummarizeText = async () => {
    setLoading(true)

    try {
      // summary event relies on the success of the summary request so we group together
      const [summary] = await Promise.all([
        NotesService.createNoteSummary(transcribedText),
        AnalyticsService.createSummariesEvent(filename)
      ])

      const formattedNotes = trimEdgesAndCapitalizeFirstLetter(summary.data)
      setSummarizedText(formattedNotes)

      toast.custom(({ visible }) => (
        <ToastAlert
          type='success'
          isOpen={visible}
          title='Your transcription has been summarized'
          message='We also prefer to keep things short and sweet. 😁'
        />
      ))
    } catch (error) {
      if (error.response) {
        // response with status code other than 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // no response from server
        console.log(error.request)
      } else {
        // something wrong with request
        console.log(error)
      }
      console.log(error.config)

      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          isOpen={visible}
          title='It seems our servers perfer long-form content 😅'
          message={error.message}
        />
      ))
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)

    try {
      // validate data
      if (!filename) {
        setFilenameError('Filename is required')
        throw new Error('Filename is required')
      } else if (!transcribedText) {
        throw new Error('Transcribed text is required')
      } else if (!documentTitle) {
        setDocumentTitleError('Document title is required')
        throw new Error('Document title is required')
      }

      const filenameWithExt = `${filename}${filetype.ext}`

      // note upload events rely on the success of the notes request so we group together
      const hasSummary = summarizedText ? true : false
      const [uploadResponse] = await Promise.all([
        NotesService.uploadNote(
          filenameWithExt,
          transcribedText,
          summarizedText, // this can be empty
          filetype.ext,
          documentTitle
        ),
        AnalyticsService.createNotesUploadEvent(filename, hasSummary)
      ])

      toast.custom(({ visible }) => (
        <ToastAlert
          type='success'
          isOpen={visible}
          title='Your notes been saved!'
          message="We're glad you like our work. 😎"
        />
      ))
      // redirect to notes page after 3 seconds
      setTimeout(
        () => (router.push(`/notes/${uploadResponse.data.filename}`), 3000)
      )
    } catch (error) {
      if (error.response) {
        // response with status code other than 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // no response from server
        console.log(error.request)
      } else {
        // something wrong with request
        console.log(error)
      }
      console.log(error.config)

      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          isOpen={visible}
          title="We've hit a snag while saving your note 😬"
          message={error.message}
        />
      ))
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    getWordCounts()
  }, [summarizedText, transcribedText])

  return (
    <div>
      <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-xl font-medium leading-6 text-gray-900'>
            2. Confirm Details
          </h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>
            Filename, summary, and transcription.
          </p>
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-200'>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Filename</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0'>
                <input
                  type='text'
                  name='filename'
                  id='filename'
                  value={filename}
                  onChange={handleFileNameChange}
                  minLength={5}
                  maxLength={50}
                  required
                  className={`block w-full rounded-md border-${
                    filenameError ? 'red' : 'gray'
                  }-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  aria-describedby='filename-input'
                />
                <p
                  className={`mt-2 text-sm text-${
                    filenameError ? 'red' : 'gray'
                  }-500`}
                  id='filename-description'
                >
                  {filenameError
                    ? filenameError
                    : 'Choose a memorable name for your file'}
                </p>
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>File Type</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                <SelectInput
                  label=''
                  selected={filetype}
                  setSelected={setFileType}
                  width='w-1/4'
                />
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Document Title
              </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0'>
                <input
                  type='text'
                  name='documentTitle'
                  id='documentTitle'
                  value={documentTitle}
                  onChange={handleDocumentTitleChange}
                  minLength={5}
                  maxLength={50}
                  required
                  className={`block w-full rounded-md border-${
                    documentTitleError ? 'red' : 'gray'
                  }-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  aria-describedby='document-title'
                />
                <p
                  className={`mt-2 text-sm text-${
                    documentTitleError ? 'red' : 'gray'
                  }-500`}
                  id='document-title-description'
                >
                  {documentTitleError
                    ? documentTitleError
                    : 'The title of your document'}
                </p>
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Summary{' '}
                {summarizedText && (
                  <span>
                    {summaryWordCount === 1
                      ? `(${summaryWordCount} word)`
                      : `(${summaryWordCount} words)`}
                  </span>
                )}
              </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {summarizedText}
              </dd>
              {/* only show button if there's enough text to summarize  */}
              {transcribedText.length > 15 && (
                <div className='mt-4'>
                  <LoadingButton
                    isLoading={loading}
                    text={summarizedText ? 'Try again' : 'Summarize'}
                    loadingText='Summarizing...'
                    handleClick={handleSummarizeText}
                  />
                </div>
              )}
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Full Transcription{' '}
                {transcribedText && (
                  <span>
                    {transcriptWordCount === 1
                      ? `(${transcriptWordCount} word)`
                      : `(${transcriptWordCount} words)`}
                  </span>
                )}
              </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {transcribedText}
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0'>
                <div className='mt-4 float-right'>
                  <LoadingButton
                    isLoading={isSaving}
                    text='Save note'
                    loadingText='Saving...'
                    handleClick={handleSaveNotes}
                  />
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default FileUploadCard
