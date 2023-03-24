import React, { useState } from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'

import ToastAlert from '@/components/ToastAlert'

import DeleteModal from '../components/DeleteModal'
import Layout from '../components/Layout'
import NoteGallery from '../components/Notes/NotesList'
import useProfile from '../hooks/useProfile'
import siteConfig from '../site.config'
import NotesService from '../utils/services/notes-service'

const NotesOverview = () => {
  const [showModal, setShowModal] = useState(false)

  const supabase = useSupabaseClient()
  const { userWithProfile } = useProfile()

  const handleDeleteFile = async (filename) => {
    try {
      await supabase.storage
        .from('notes')
        .remove([`${userWithProfile.id}/${filename}`])

      refreshNotes()

      toast.custom(({ visible }) => (
        <ToastAlert
          type='success'
          isOpen={visible}
          title='File successfully deleted!'
          message='Yeah we were a little tired of it too. 😉'
        />
      ))
    } catch (error) {
      console.log(error)

      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          isOpen={visible}
          title='Well that was a little tougher than expected. 🤕'
          message={error.message}
        />
      ))
    } finally {
      toast.custom(({ visible }) => (
        <ToastAlert
          type='success'
          isOpen={visible}
          title='File successfully deleted!'
          message='Yeah we were a little tired of it too. 😉'
        />
      ))
    }
  }

  const handleClearAllFiles = async () => {
    try {
      const filesToDelete = notes.map(
        (file) => `${userWithProfile.id}/${file.name}`
      )

      await supabase.storage.from('notes').remove(filesToDelete)
      refreshNotes()

      toast.custom(({ visible }) => (
        <ToastAlert
          type='success'
          isOpen={visible}
          title="We've cleared out your notes! 🧹"
          message='You can now upload new ones. 📝'
        />
      ))
    } catch (error) {
      console.log(error)

      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          isOpen={visible}
          title="There's just too many of em! 🫣"
          message={error.message}
        />
      ))
    } finally {
      setShowModal(false)
    }
  }

  const {
    notes,
    isLoading,
    error: notesError,
    refreshNotes
  } = NotesService.getCurrentNotes()

  if (notesError) return <div>Error: {notesError}</div>

  return (
    <Layout title={`Notes | ${siteConfig.siteName}`}>
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
