import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import siteConfig from 'site.config'

import LoadingButton from '../LoadingButton'
import ToastAlert from '../ToastAlert'

interface FormData {
  password: string
  error: {
    password: string
  }
}

function ResetPasswordForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    password: '',
    error: {
      password: ''
    }
  })

  const supabase = useSupabaseClient()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'password' && formData.error.password) {
      setFormData({
        ...formData,
        error: {
          password: ''
        }
      })
    }
    setFormData({ ...formData, [name]: value })
  }

  const updatePassword = async () => {
    if (!formData.password) {
      setFormData({
        ...formData,
        error: {
          password: 'Password is required'
        }
      })
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.updateUser({
      password: formData.password
    })
    console.log(data)

    if (error) {
      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          title='We ran into a problem updating your password. 🤔'
          message={error.message}
          isOpen={visible}
        />
      ))

      throw error
    }

    toast.custom(({ visible }) => (
      <ToastAlert
        type='success'
        title='Password Updated!'
        message='Your password has been updated. Now back to business!'
        isOpen={visible}
      />
    ))

    router.push('/')

    setLoading(false)
  }

  /**
   * Render error classes if an error is present
   * @param {string} field - Name of the field
   * @returns {string} - Tailwind CSS classes for input field
   */
  const getInputClasses = (field) =>
    formData.error[field]
      ? 'block w-full appearance-none rounded-md border border-red-300 px-3 py-2 placeholder-red-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'
      : 'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'

  return (
    <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <img
          className='mx-auto h-12 w-auto'
          src={siteConfig.productBrand}
          alt={`${siteConfig.siteName} logo`}
        />
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
          Update your password
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' action='#' method='POST'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  autoComplete='current-password'
                  required
                  onChange={handleInputChange}
                  className={getInputClasses('password')} // render different class based on error
                />
                <p className='mt-2 text-sm text-red-500' id='password-error'>
                  {formData.error.password && formData.error.password}
                </p>
              </div>
            </div>

            <div>
              <LoadingButton
                isLoading={loading}
                text='Update'
                loadingText='Updating password...'
                handleClick={updatePassword}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
