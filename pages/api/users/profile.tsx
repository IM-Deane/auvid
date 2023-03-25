import { NextApiRequest, NextApiResponse } from 'next'

import type { Database } from '@/supabase/types/public'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' })

  try {
    const supabase = createServerSupabaseClient<Database>({ req, res })
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const userWithProfile = {
      ...user,
      profile: { ...data }
    }

    res.status(200).json(userWithProfile)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default handler
