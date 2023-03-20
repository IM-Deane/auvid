import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import type { FullUser } from '@/supabase/types/index'
import type { Database } from '@/supabase/types/public'
import { classNames, updateActiveSettingsTab } from '@/utils/index'
import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import siteConfig from 'site.config'

import Layout from '@/components/Layout'
import AccountTabHeader from '@/components/Settings/AccountTabHeader'

const actions = [
  {
    title: 'Minutes Transcribed',
    description: '',
    icon: ClockIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50'
  },
  {
    title: 'Storage',
    description: '#',
    icon: DocumentTextIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50'
  }
]

const UsagePage = ({ eventCount }: { user: FullUser; eventCount: number }) => {
  const router = useRouter()
  const tabs = updateActiveSettingsTab(router.pathname)

  // TODO: pass user's current usage metrics to children
  console.log(eventCount)

  return (
    <Layout title={`Billing and usage | ${siteConfig.siteName}`}>
      <div className='lg:px-8'>
        <div className='mx-auto flex flex-col lg:max-w-4xl'>
          <main className='flex-1'>
            <div className='relative mx-auto max-w-4xl'>
              <div className='pt-10 pb-16'>
                <div className='px-4 sm:px-6 lg:px-0'>
                  <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                    Billing
                  </h1>
                </div>
                <AccountTabHeader tabs={tabs} />
                <div className='mt-8 divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-1 sm:gap-px sm:divide-y-0'>
                  {actions.map((action, actionIdx) => (
                    <div
                      key={action.title}
                      className={classNames(
                        actionIdx === 0
                          ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
                          : '',
                        actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                        actionIdx === actions.length - 2
                          ? 'sm:rounded-bl-lg'
                          : '',
                        actionIdx === actions.length - 1
                          ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
                          : '',
                        'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
                      )}
                    >
                      <div>
                        <span
                          className={classNames(
                            action.iconBackground,
                            action.iconForeground,
                            'inline-flex rounded-lg p-3 ring-4 ring-white'
                          )}
                        >
                          <action.icon className='h-6 w-6' aria-hidden='true' />
                        </span>
                      </div>
                      <div className='mt-8'>
                        <h3 className='text-base font-semibold leading-6 text-gray-900'>
                          {action.title}
                        </h3>
                        <p className='mt-2 text-sm text-gray-500'>
                          Coming soon.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<Database>(ctx)
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const [profileData, eventData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.rpc('get_current_month_event_count')
  ])

  const userData = {
    ...user,
    profile: { ...profileData }
  }

  return {
    props: {
      user: userData,
      eventCount: eventData
    }
  }
}

export default UsagePage
