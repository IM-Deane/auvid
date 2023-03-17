import type { AppProps } from 'next/app'
import React, { useState } from 'react'

import { AccountProvider } from '@/context/AccountProvider'
import type { Database } from '@/supabase/types/public'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { Toaster } from 'react-hot-toast'

import '@/styles/globals.css'

function MyApp({
  Component,
  pageProps
}: AppProps<{ initialSession: Session }>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Toaster />
      <AccountProvider>
        <Component {...pageProps} />
      </AccountProvider>
    </SessionContextProvider>
  )
}

export default MyApp
