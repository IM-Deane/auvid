import { useRouter } from 'next/router'
import React from 'react'

import useProfile from '@/hooks/useProfile'
import { updateActiveSettingsTab } from '@/utils/index'
import siteConfig from 'site.config'

import Layout from '@/components/Layout'
import AccountTabHeader from '@/components/Settings/AccountTabHeader'
import GeneralTab from '@/components/Settings/GeneralTab'
import LoadingSkeleton from '@/components/cards/LoadingSkeleton'

const AccountPage = () => {
  const router = useRouter()
  const tabs = updateActiveSettingsTab(router.pathname)

  const { userWithProfile, error, isLoading } = useProfile()

  if (error) return error
  if (!userWithProfile || isLoading)
    return (
      <Layout title={`Loading account... | ${siteConfig.siteName}`}>
        <div className='lg:px-8'>
          <div className='mx-auto flex flex-col lg:max-w-4xl'>
            <main className='flex-1'>
              <div className='relative mx-auto max-w-4xl'>
                <div className='pt-10 pb-16'>
                  <div className='px-4 sm:px-6 lg:px-0'>
                    <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                      Settings
                    </h1>
                  </div>
                </div>
                <LoadingSkeleton count={1} large />
              </div>
            </main>
          </div>
        </div>
      </Layout>
    )

  return (
    <Layout title={`Account | ${siteConfig.siteName}`}>
      <div className='lg:px-8'>
        <div className='mx-auto flex flex-col lg:max-w-4xl'>
          <main className='flex-1'>
            <div className='relative mx-auto max-w-4xl'>
              <div className='pt-10 pb-16'>
                <div className='px-4 sm:px-6 lg:px-0'>
                  <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                    Settings
                  </h1>
                </div>
                <AccountTabHeader tabs={tabs} />
                <GeneralTab user={userWithProfile} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default AccountPage
