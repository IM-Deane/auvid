import Link from 'next/link'
import React, { useState } from 'react'

import useProfile from '@/hooks/useProfile'
import NotesService from '@/utils/services/notes-service'
import {
  PencilSquareIcon,
  PlusCircleIcon,
  XCircleIcon
} from '@heroicons/react/20/solid'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import prettyBytes from 'pretty-bytes'
import toast from 'react-hot-toast'

import DeleteModal from '../DeleteModal'
import ToastAlert from '../ToastAlert'
import LoadingSkeleton from '../cards/LoadingSkeleton'

function NotesList() {
  const [showModal, setShowModal] = useState<boolean>(false)

  const supabase = useSupabaseClient()
  const { userWithProfile } = useProfile()
  const {
    notes,
    isLoading,
    error: notesError,
    refreshNotes
  } = NotesService.getCurrentNotes()

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

  if (notesError) return <div>Error: {notesError}</div>
  if (isLoading) return <LoadingSkeleton count={3} large />

  return (
    <>
      <header className='flex justify-center items-center'>
        <h2 className='flex-auto text-lg font-medium leading-6 text-gray-900'>
          Notes
        </h2>
        {notes.length > 0 && (
          <span
            onClick={() => setShowModal(true)}
            className='flex-none w-32 cursor-pointer font-medium text-blue-600 hover:text-blue-500'
          >
            Clear All
          </span>
        )}
      </header>

      <ul
        role='list'
        className='mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
      >
        {!notes.length ? (
          <p>
            Nothing to see here...{' '}
            <Link href='/upload'>
              <span className='font-medium text-blue-600 hover:text-blue-500'>
                Add a new note <PlusCircleIcon className='w-4 h-4 inline' />
              </span>
            </Link>
          </p>
        ) : (
          notes.map((note) => (
            <li
              key={note.created_at}
              className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow'
            >
              <div className='flex w-full items-center justify-between space-x-6 p-6'>
                <div className='flex-1 truncate'>
                  <div className='flex items-center space-x-3'>
                    <h3 className='truncate text-sm font-medium text-gray-900'>
                      {note.name}
                    </h3>
                    <span className='inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                      Size: {prettyBytes(note.metadata.size)}
                    </span>
                  </div>
                  {/* TODO: add description? */}
                  <p className='mt-1 truncate text-sm text-gray-500'>
                    Created on: {new Date(note.created_at).toDateString()}
                  </p>
                </div>
              </div>
              <div>
                <div className='-mt-px flex divide-x divide-gray-200'>
                  <div className='flex w-0 flex-1'>
                    <button
                      onClick={() => handleDeleteFile(note.name)}
                      className='relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500'
                    >
                      <XCircleIcon
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      <span className='ml-3'>Remove</span>
                    </button>
                  </div>
                  <div className='-ml-px flex w-0 flex-1'>
                    <Link
                      href={`/notes/${note.name}`}
                      className='relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500'
                    >
                      <PencilSquareIcon
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      <span className='ml-3'>Edit</span>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <DeleteModal
        open={showModal}
        setOpen={setShowModal}
        handleDeleteNotes={handleClearAllFiles}
      />
    </>
  )
}

export default NotesList
