import React, { useEffect, useState } from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'

import Alert from '../components/Alert'
import DeleteModal from '../components/DeleteModal'
import Layout from '../components/Layout'
import NoteGallery from '../components/Notes/NotesList'
import useProfile from '../hooks/useProfile'
import NotesService from '../utils/services/notes-service'

const NotesOverview = () => {
  const [showModal, setShowModal] = useState(false)
  const [showAlert, setShowAlert] = useState({
    status: false,
    message: ''
  })
  const [error, setError] = useState({
    status: false,
    message: ''
  })

  const supabase = useSupabaseClient()
  const { profile } = useProfile()

  const handleAlertDismiss = () => setShowAlert({ status: false, message: '' })

  const handleDeleteFile = async (filename) => {
    try {
      await supabase.storage.from('notes').remove([`${profile.id}/${filename}`])

      refreshNotes()
    } catch (error) {
      console.log(error)
      setError({
        status: true,
        message: 'There was a problem deleting the file!'
      })
    } finally {
      setShowAlert({ status: true, message: 'File successfully deleted!' })
    }
  }

  // remove all file from user's folder
  const handleClearAllFiles = async () => {
    try {
      const filesToDelete = notes.map((file) => `${profile.id}/${file.name}`)

      await supabase.storage.from('notes').remove(filesToDelete)

      refreshNotes()
    } catch (error) {
      console.log(error)
      setError({
        status: true,
        message: 'There was a problem clearing the files!'
      })
    } finally {
      setShowModal(false)
      setShowAlert({
        status: true,
        message: 'All files were successfully removed!'
      })
    }
  }

  useEffect(() => {
    // hide alert after 5 seconds
    if (showAlert)
      setTimeout(() => setShowAlert({ status: false, message: '' }), 5000)
  }, [showAlert])

  const {
    notes,
    isLoading,
    error: notesError,
    refreshNotes
  } = NotesService.getCurrentNotes()

  if (notesError) return <div>Error: {notesError}</div>

  return (
    <Layout title='Notes | RustleAI'>
      <div className='my-4 h-10'>
        {showAlert.status && (
          <Alert
            handleAlertDismiss={handleAlertDismiss}
            text={error.status ? error.message : showAlert.message}
            isError={error.status}
          />
        )}
      </div>
      <NoteGallery
        notes={notes}
        isLoading={isLoading}
        setShowModal={setShowModal}
        handleDeleteFile={handleDeleteFile}
      />
      <DeleteModal
        open={showModal}
        setOpen={setShowModal}
        handleDeleteNotes={handleClearAllFiles}
      />
    </Layout>
  )
}

export default NotesOverview
