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

    const [eventsData, monthlyEventCount] = await Promise.all([
      supabase.from('events').select('*').eq('profile_id', user.id),
      supabase.rpc('get_current_month_event_count')
    ])

    res
      .status(200)
      .json({ events: eventsData, monthlyEventCount: monthlyEventCount })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
