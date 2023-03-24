import React, { useState } from 'react'

import type { FullUser } from '@/supabase/types/index'
import type { Database } from '@/supabase/types/public'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'

import ToastAlert from '@/components/ToastAlert'

function GeneralTab({ user }: { user: FullUser }) {
  const supabase = useSupabaseClient<Database>()
  const [loading, setLoading] = useState<boolean>(false)

  const [email, setEmail] = useState<FullUser['email']>(user.email)
  const [profile, setProfile] = useState({
    username: user.profile.username,
    first_name: user.profile.first_name,
    last_name: user.profile.last_name,
    avatar_url: user.profile.avatar_url
  })

  const onProfileFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setProfile({ ...profile, [name]: value })
  }

  const updateUser = async () => {
    try {
      setLoading(true)
      if (!user) throw new Error('No user found')

      // we have to update user email separately due to supabase things
      if (email !== user.email) {
        const emailRes = await supabase.auth.updateUser({ email })
        if (emailRes.error) throw emailRes.error
        setEmail(emailRes.data[0].email)
      }

      const updates = {
        id: user.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString()
      }

      const profileRes = await supabase
        .from('profiles')
        .upsert(updates)
        .select()

      if (profileRes.error) throw profileRes.error

      setProfile({ ...profileRes.data[0] })
    } catch (error) {
      toast.custom(({ visible }) => (
        <ToastAlert
          isOpen={visible}
          title='Error updating profile data!'
          message={error.message}
          type='error'
        />
      ))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='lg:px-8'>
      <div className='mx-auto flex flex-col lg:max-w-4xl'>
        <main className='flex-1'>
          <div className='relative mx-auto max-w-4xl'>
            <div className='pb-16'>
              <div className='px-4 sm:px-6 lg:px-0'>
                <div className='py-6'>
                  <div className='mt-3 divide-y divide-gray-200'>
                    <div className='space-y-1'>
                      <h2 className='text-lg font-medium leading-6 text-gray-900'>
                        Profile
                      </h2>
                    </div>
                    <form
                      onSubmit={updateUser}
                      className='space-y-8 divide-y divide-gray-200'
                    >
                      <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                        <div className='space-y-6 sm:space-y-5'>
                          <div className='space-y-6 sm:space-y-5'>
                            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                              <label
                                htmlFor='username'
                                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                              >
                                Username
                              </label>
                              <div className='mt-1 sm:col-span-2 sm:mt-0'>
                                <div className='flex max-w-sm rounded-md shadow-sm'>
                                  <input
                                    type='text'
                                    name='username'
                                    id='username'
                                    autoComplete='username'
                                    value={profile.username || ''}
                                    onChange={onProfileFieldChange}
                                    className='block w-full min-w-0 flex-1 rounded-md rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='space-y-6 pt-8 sm:space-y-5 sm:pt-10'>
                          <div>
                            <h3 className='text-lg font-medium leading-6 text-gray-900'>
                              Personal Information
                            </h3>
                          </div>
                          <div className='space-y-6 sm:space-y-5'>
                            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                              <label
                                htmlFor='first_name'
                                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                              >
                                First name
                              </label>
                              <div className='mt-1 sm:col-span-2 sm:mt-0'>
                                <input
                                  type='text'
                                  name='first_name'
                                  id='first_name'
                                  value={profile.first_name || ''}
                                  onChange={onProfileFieldChange}
                                  className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                                />
                              </div>
                            </div>

                            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                              <label
                                htmlFor='last_name'
                                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                              >
                                Last name
                              </label>
                              <div className='mt-1 sm:col-span-2 sm:mt-0'>
                                <input
                                  type='text'
                                  name='last_name'
                                  id='last_name'
                                  value={profile.last_name || ''}
                                  onChange={onProfileFieldChange}
                                  className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                                />
                              </div>
                            </div>

                            <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                              <label
                                htmlFor='email'
                                className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                              >
                                Email address
                              </label>
                              <div className='mt-1 sm:col-span-2 sm:mt-0'>
                                <input
                                  id='email'
                                  name='email'
                                  type='email'
                                  value={email ?? ''}
                                  autoComplete='email'
                                  onChange={(e) => setEmail(e.target.value)}
                                  className='block w-full max-w-md rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='pt-5'>
                        <div className='flex justify-end'>
                          <button
                            type='submit'
                            disabled={loading}
                            className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                          >
                            {loading && (
                              <svg
                                className='h-4 w-4 animate-spin'
                                viewBox='3 3 18 18'
                              >
                                <path
                                  className='fill-blue-800'
                                  d='M12 5C8.13401 5 5 8.13401 5 12c0 3.866 3.13401 7 7 7 3.866.0 7-3.134 7-7 0-3.86599-3.134-7-7-7zM3 12c0-4.97056 4.02944-9 9-9 4.9706.0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056.0-9-4.0294-9-9z'
                                ></path>
                                <path
                                  className='fill-blue-100'
                                  d='M16.9497 7.05015c-2.7336-2.73367-7.16578-2.73367-9.89945.0-.39052.39052-1.02369.39052-1.41421.0-.39053-.39053-.39053-1.02369.0-1.41422 3.51472-3.51472 9.21316-3.51472 12.72796.0C18.7545 6.02646 18.7545 6.65962 18.364 7.05015c-.390599999999999.39052-1.0237.39052-1.4143.0z'
                                ></path>
                              </svg>
                            )}
                            <span>{loading ? 'Saving...' : 'Save'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GeneralTab
