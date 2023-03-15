import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'

import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import siteConfig from 'site.config'

import LoginForm from '../../components/Auth/LoginForm'

function login() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          router.push('/')
        }
      })
    }
  }, [user])

  return (
    <div>
      <Head>
        <title>Login | {siteConfig.siteName}</title>
      </Head>
      <LoginForm />
    </div>
  )
}

export default login
