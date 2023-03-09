import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'

import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

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
      <LoginForm />
    </div>
  )
}

export default login
