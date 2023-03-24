import Head from 'next/head'
import React from 'react'

import siteConfig from 'site.config'

import ResetPasswordForm from '@/components/Auth/ResetPasswordForm'

function ResetPasswordPage() {
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
