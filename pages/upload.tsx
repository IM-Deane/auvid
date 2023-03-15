import React, { useState } from 'react'

import { SpeakerWaveIcon, VideoCameraIcon } from '@heroicons/react/20/solid'
import toast from 'react-hot-toast'

import ToastAlert from '@/components/ToastAlert'

import FileDataCard from '../components/FileDataCard'
import FileUploader from '../components/FileUploader'
import FileUploadTabs from '../components/FileUploaders/FileUploadTabs'
import VideoLinkUploader from '../components/FileUploaders/VideoLinkUploader'
import Layout from '../components/Layout'
import VideoUploadCard from '../components/VideoUploadCard'

const AudioUpload = () => {
  const [transcribedText, setTranscribedText] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')
  const [isEditing, setIsEditing] = useState(false) // used to render text form
  const [uploadData, setUploadData] = useState({
    uploadType: '',
    metadata: {
      videoId: '',
      videoTitle: '',
      originalURL: '',
      thumbnail: ''
    }
  })
  const [tabs, setTabs] = useState([
    { id: 0, name: 'Video', icon: VideoCameraIcon, current: true },
    { id: 1, name: 'Audio', icon: SpeakerWaveIcon, current: false }
  ])

  const handleTabChange = (tabId) => {
    const newTabs = tabs.map((t) => {
      if (t.id === tabId) {
        return { ...t, current: true }
      } else {
        return { ...t, current: false }
      }
    })

    setTabs(newTabs)
  }

  const handleUploadResult = (data) => {
    if (!data) {
      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          isOpen={visible}
          title='Error uploading file!'
          message="We're not quite sure what happened but we'll do our best to fix it. 🫡"
        />
      ))
      return
    } else {
      toast.custom(({ visible }) => (
        <ToastAlert
          type='success'
          isOpen={visible}
          title='Transcription successful!'
          message="We've taken diligent notes on your behalf. 🫡"
        />
      ))
    }

    setUploadData(data)
    setTranscribedText(data.transcribedText)
    setUploadedFile(data.filename)
    setIsEditing(true)
  }

  return (
    <Layout title='Add new note | RustleAI'>
      <h1 className='text-2xl font-semibold text-gray-900'>New Note:</h1>
      <FileUploadTabs tabs={tabs} handleTabChange={handleTabChange} />
      {/* render chosen uploader */}
      <div className='mb-7 py-5 px-8'>
        {tabs.map((tab) => {
          if (tab.current && tab.name === 'Video') {
            return (
              <VideoLinkUploader
                key={tab.id}
                handleResult={handleUploadResult}
              />
            )
          } else if (tab.current && tab.name === 'Audio') {
            return (
              <FileUploader key={tab.id} handleResult={handleUploadResult} />
            )
          }
        })}
      </div>
      {/* render section after file upload */}
      {isEditing && (
        <div>
          {uploadData.uploadType === 'audio' ? (
            <div className='mt-4 mb-7 py-5 px-8'>
              <FileDataCard
                fileData={{
                  filename: uploadedFile,
                  transcribedText,
                  meta: uploadData
                }}
              />
            </div>
          ) : (
            <div className='mt-4 mb-7 py-5 px-8'>
              <VideoUploadCard
                fileData={{
                  filename: uploadedFile,
                  transcribedText,
                  meta: uploadData
                }}
              />
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

export default AudioUpload
