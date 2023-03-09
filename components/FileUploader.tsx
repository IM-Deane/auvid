import React, { useState } from 'react'

import Dropzone from 'react-dropzone'

import UploadService from '../utils/services/upload-service'
import AnalyticsService from '../utils/services/analytics-service'

import LoadingButton from './LoadingButton'

import { TranscriptionType } from '../utils/enums'

function FileUploader({ handleResult }) {
  const [selectedFiles, setSelectedFiles] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState<File>()
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [transcribeProgress, setTranscribeProgress] = useState<number>(1)
  const [completionTime, setCompletionTime] = useState<number>(0)

  /**
   * Handles file upload and transcription progress updates
   */
  const handleSubmit = () => {
    if (!selectedFiles) return

    const currentFileData = selectedFiles[0] // get first uploaded file

    setUploadProgress(0)
    setCurrentFile(currentFileData)

    // establish SSE connection
    const eventSrc = new EventSource(
      'http://localhost:5000/api/events/progress'
    )

    let guidValue = null // ID for server event emitter

    // listen for initial client ID event
    eventSrc.addEventListener('GUID', (event) => {
      guidValue = event.data

      // listen for progress updates for this client
      eventSrc.addEventListener(guidValue, (event) => {
        const { progress } = JSON.parse(event.data)

        if (transcribeProgress !== progress) {
          setTranscribeProgress(progress) // update progress
        }
        if (progress === 100) {
          setTranscribeProgress(progress)
          eventSrc.close() // transcription complete
        }
      })

      uploadFileToServer(
        currentFileData,
        guidValue,
        // calculate progress for file upload (not transcription)
        (fileUploadEvent) =>
          setUploadProgress(
            Math.round((100 * fileUploadEvent.loaded) / fileUploadEvent.total)
          )
      )
    })

    eventSrc.onerror = (event) => {
      console.log('An error occurred while attempting to connect.', event)

      eventSrc.close()
      setTranscribeProgress(1)
    }

    if (transcribeProgress === 100) {
      // stop listening for server events
      eventSrc.close()
    }
  }

  /**
   * Wrapper method that uploads a file to the server
   * @param fileData the file to upload
   * @param guid UUID for server side event
   * @param uploadProgress a callback function that updates file upload progress
   */
  const uploadFileToServer = async (
    fileData: File,
    guid: string,
    uploadProgress: (fileUploadEvent) => void
  ) => {
    setLoading(true)

    try {
      const response = await UploadService.newAudioFile(
        fileData,
        guid,
        uploadProgress
      )

      // side effect: track transcription usage
      await AnalyticsService.createTranscriptionEvent(
        response.data.filename,
        TranscriptionType.audio
      )

      setCompletionTime(response.data.completionTime)

      response.data['uploadType'] = 'audio'

      handleResult(response.data)
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

      // reset state
      setUploadProgress(0)
      setTranscribeProgress(1)
      setCurrentFile(undefined)
    } finally {
      setLoading(false)
      setSelectedFiles(undefined)
      setCurrentFile(undefined)
    }
  }

  /**
   * Method that handles file drops/uploads
   * @param files an array of files
   */
  const handleFileDrop = (files: File[]): void =>
    files.length > 0 && setSelectedFiles(files)

  /**
   * Method that calculates and sets the total progress of the upload
   * and transcription process.
   */
  const getTotalProgress = () => {
    const progress = Math.round(
      ((uploadProgress + transcribeProgress) / 200) * 100
    )
    return progress
  }

  return (
    <div className='mt-2'>
      <div className='mt-5 md:col-span-2 md:mt-0'>
        {/* Progress bar */}
        <div className='my-6 py-5'>
          {currentFile && (
            <div className='min-h-24'>
              <h4 className='sr-only'>Status</h4>
              <p className='text-sm font-medium text-gray-900'>
                {uploadProgress < 100 && transcribeProgress < 100
                  ? 'Creating new note...'
                  : ''}
              </p>
              <div className='mt-6' aria-hidden='true'>
                {/* upload segment */}
                <div className='overflow-hidden rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-indigo-600'
                    style={{
                      width: `${getTotalProgress()}%`
                    }}
                  />
                </div>
                <div className='mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid'>
                  <div className='text-indigo-600'>Uploading file</div>
                  <div
                    className={`text-center ${
                      uploadProgress === 100 ? 'text-indigo-600' : ''
                    }`}
                  >
                    Transcribing audio
                  </div>
                  <div
                    className={`text-center ${
                      transcribeProgress >= 50 ? 'text-indigo-600' : ''
                    }`}
                  >
                    Saving changes
                  </div>
                  <div
                    className={`text-right ${
                      transcribeProgress === 100 ? 'text-indigo-600' : ''
                    }`}
                  >
                    Completed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='shadow sm:overflow-hidden sm:rounded-md'>
          <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
            <div>
              <h2 className='block text-xl font-medium text-gray-700'>
                1. Upload audio file
              </h2>
              <Dropzone onDrop={handleFileDrop} multiple={false}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'
                  >
                    {/* Show uploaded file  */}
                    {selectedFiles && selectedFiles[0].name ? (
                      <p className='rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'>
                        {selectedFiles && selectedFiles[0].name}
                      </p>
                    ) : (
                      <div className='space-y-1 text-center'>
                        <svg
                          className='mx-auto h-12 w-12 text-gray-400'
                          stroke='currentColor'
                          fill='none'
                          viewBox='0 0 48 48'
                          aria-hidden='true'
                        >
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <div className='flex text-sm text-gray-600'>
                          <label
                            htmlFor='audio-file'
                            className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'
                          >
                            <span>Upload an audio file</span>
                            <input
                              {...getInputProps()}
                              id='audio-file'
                              name='audio-file'
                              type='file'
                              className='sr-only'
                              accept='audio/*'
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs text-gray-500'>
                          {
                            '.WAV, .MP3, .GIF, .FLAC, .OGG, .M4A, .WMA up to 1GB'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>
          </div>

          <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
            {completionTime ? (
              <span className='mt-2 mr-8 text-sm text-indigo-500'>
                Completed transcription in <strong>{completionTime}</strong>
              </span>
            ) : (
              ''
            )}
            <LoadingButton
              isLoading={loading}
              text='Upload file'
              loadingText='Loading...'
              handleClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploader
