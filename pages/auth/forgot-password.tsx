import Head from 'next/head'
import React from 'react'

import siteConfig from 'site.config'

import ForgotPassword from '@/components/Auth/ForgotPassword'

function ForgotPasswordPage() {
  return (
    <div>
      <Head>
        <title>Forgot Password | {siteConfig.siteName}</title>
      </Head>

      <ForgotPassword />
    </div>
  )
}

export default ForgotPasswordPage
