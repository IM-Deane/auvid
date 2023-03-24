import Link from 'next/link'
import React, { useState } from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import siteConfig from 'site.config'

import LoadingButton from '../LoadingButton'
import ToastAlert from '../ToastAlert'

interface FormData {
  email: string
  error: {
    email: string
  }
}

interface RestPasswordFormProps {
  setEmailResponse: (responseData: any) => void
}

function ForgotPasswordForm({ setEmailResponse }: RestPasswordFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    error: {
      email: ''
    }
  })

  const supabase = useSupabaseClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'email' && formData.error.email) {
      setFormData({
        ...formData,
        error: {
          email: ''
        }
      })
    }
    setFormData({ ...formData, [name]: value })
  }

  const sendPasswordResetEmail = async () => {
    if (!formData.email) {
      setFormData({
        ...formData,
        error: {
          email: 'Email is required'
        }
      })
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      formData.email
    )

    setLoading(false)

    if (error) {
      toast.custom(({ visible }) => (
        <ToastAlert
          type='error'
          title='Wait a minute... We ran into a problem. 🤔'
          message={error.message}
          isOpen={visible}
        />
      ))

      throw error
    }

    setEmailResponse(data)

    toast.custom(({ visible }) => (
      <ToastAlert
        type='success'
        title='Email sent has been!'
        message='Check your email for further instructions'
        isOpen={visible}
      />
    ))
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
          Forgot your password?
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/signup'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            Sign up for a plan today
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' action='#' method='POST'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  autoComplete='email'
                  placeholder='luke@jediacademy.eu'
                  required
                  onChange={handleInputChange}
                  className={getInputClasses('email')} // render different class based on error
                  aria-invalid={formData.error.email ? 'true' : 'false'}
                  aria-describedby={formData.error.email ? 'email-error' : ''}
                />
              </div>
              <p className='mt-2 text-sm text-red-500' id='email-error'>
                {formData.error.email && formData.error.email}
              </p>
            </div>

            <div>
              <LoadingButton
                isLoading={loading}
                text='Reset'
                loadingText='Sending email...'
                handleClick={sendPasswordResetEmail}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
