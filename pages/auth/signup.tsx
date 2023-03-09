import { useRouter } from 'next/router'
import React from 'react'

import { useSupabaseClient } from '@supabase/auth-helpers-react'

import SignUpForm from '../../components/Auth/RegistrationForm'

function Signup() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      router.push('/')
    }
  })

  return (
    <div>
      <SignUpForm />
    </div>
  )
}

export default Signup
