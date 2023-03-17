import type { NextApiRequest, NextApiResponse } from 'next'

import type { Database } from '@/supabase/types/public'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient<Database>({ req, res })
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { data, error } = await supabase.rpc(
      'get_current_month_event_count',
      { profile_id: user.id }
    )

    if (error) throw error

    res.status(200).json({ events_count: data })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default handler
