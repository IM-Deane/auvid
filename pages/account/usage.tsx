import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import type { FullUser } from '@/supabase/types/index'
import type { Database } from '@/supabase/types/public'
import { updateActiveSettingsTab } from '@/utils/index'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import siteConfig from 'site.config'

import Layout from '@/components/Layout'
import AccountTabHeader from '@/components/Settings/AccountTabHeader'
import BillingTab from '@/components/Settings/BillingTab'

const UsagePage = ({
  user,
  eventCount
}: {
  user: FullUser
  eventCount: number
}) => {
  const router = useRouter()
  const tabs = updateActiveSettingsTab(router.pathname)

  // TODO: pass user's current usage metrics to children
  console.log(user, eventCount)

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
                <BillingTab />
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
    supabase.rpc('get_current_month_event_count', {
      profile_id: user.id
    })
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
