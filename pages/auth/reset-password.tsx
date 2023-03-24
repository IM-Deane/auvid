import Head from 'next/head'
import React, { useState } from 'react'
import { useEffect } from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import siteConfig from 'site.config'

import ForgotPassword from '@/components/Auth/ForgotPassword'
import ResetPasswordForm from '@/components/Auth/ResetPasswordForm'

function ResetPasswordPage() {
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  const supabase = useSupabaseClient()

  //   FIXME: might not need this
  const handleResetPassword = (data: any) => {
    console.log('handleResetPassword', data)
  }

  /**
   * Once the user is redirected back to app ask them to reset their password.
   */
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event == 'PASSWORD_RECOVERY') {
        setIsPasswordReset(true)
      }
    })
  }, [])

  return (
    <div>
      <Head>
        <title>Reset Password | {siteConfig.siteName}</title>
      </Head>
      {isPasswordReset ? (
        <ResetPasswordForm />
      ) : (
        <ForgotPassword setEmailResponse={handleResetPassword} />
      )}
    </div>
  )
}

export default ResetPasswordPage
