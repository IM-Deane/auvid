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
import SubscriptionTab from '@/components/Settings/SubscriptionTab'

const SubscriptionPage = ({ user }: { user: FullUser }) => {
  const router = useRouter()
  const tabs = updateActiveSettingsTab(router.pathname)

  return (
    <Layout title={`Subscription Plan | ${siteConfig.siteName}`}>
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
                <SubscriptionTab user={user} />
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

  // Run queries with RLS on the server
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const userData = {
    ...user,
    profile: { ...data }
  }

  return {
    props: {
      user: userData
    }
  }
}

export default SubscriptionPage
