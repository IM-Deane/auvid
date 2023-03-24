import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { useUser } from '@supabase/auth-helpers-react'
import siteConfig from 'site.config'

import ResetPasswordForm from '@/components/Auth/ResetPasswordForm'

function ResetPasswordPage() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login')
      return
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Reset Password | {siteConfig.siteName}</title>
      </Head>

      <ResetPasswordForm />
    </div>
  )
}

export default ResetPasswordPage
