import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import siteConfig from 'site.config'

import LoadingButton from '../LoadingButton'

interface FormData {
  email: string
  password: string
  error: {
    email: string
    password: string
  }
}

function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    error: {
      email: '',
      password: ''
    }
  })

  const supabase = useSupabaseClient()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // FIXME: this isn't working
    if (name === 'email' && formData.error.email) {
      // reset email error
      setFormData({
        ...formData,
        error: {
          email: '',
          password: formData.error.password
        }
      })
    } else if (name === 'password' && formData.error.password) {
      // reset password error
      setFormData({
        ...formData,
        error: {
          email: formData.error.email,
          password: ''
        }
      })
    }

    setFormData({ ...formData, [name]: value })
  }

  /**
   * Sign in with email and password
   */
  const signInWithEmail = async () => {
    // validate form fields
    if (!formData.email) {
      setFormData({
        ...formData,
        error: {
          password: formData.error.password,
          email: 'Email is required'
        }
      })
      return
    } else if (!formData.password) {
      setFormData({
        ...formData,
        error: {
          email: formData.error.email,
          password: 'Password is required'
        }
      })
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    setLoading(false)

    if (error) throw new Error(error.message)

    // check for redirect url query param
    const redirectUrl = router.query.redirectedFrom as string
    if (redirectUrl) {
      router.replace(redirectUrl) // send user back to where they came from
      return
    }

    router.push('/') // redirect to home
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
          src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
          alt={`${siteConfig.siteName} logo`}
        />
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
          Sign in to your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Or{' '}
          <Link
            href='/auth/signup'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            sign up for a plan today
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
                  placeholder='tony@starkindustries.mu'
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
              <label
                htmlFor='password'
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

            <div className='flex items-center justify-between'>
              <div className='text-sm'>
                <a
                  href='#' // TODO: add link to forgot password page
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <LoadingButton
                isLoading={loading}
                text='Sign in'
                loadingText='Authenticating...'
                handleClick={signInWithEmail}
              />
            </div>
          </form>
          {/* TODO: uncomment when we have more login methods */}
          {/* <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-3 gap-3'>
              <div>
                <a
                  href='#'
                  className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50'
                >
                  <span className='sr-only'>Sign in with Facebook</span>
                  <svg
                    className='h-5 w-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href='#'
                  className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50'
                >
                  <span className='sr-only'>Sign in with Twitter</span>
                  <svg
                    className='h-5 w-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href='#'
                  className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50'
                >
                  <span className='sr-only'>Sign in with GitHub</span>
                  <svg
                    className='h-5 w-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default LoginForm
