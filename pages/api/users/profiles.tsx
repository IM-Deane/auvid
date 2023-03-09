import { NextApiRequest, NextApiResponse } from 'next'

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient({ req, res })
    const {
      data: { session }
    } = await supabase.auth.getSession()

    const userId = session.user.id

    const { data } = await supabase
      .from('profiles')
      .select(`id, username, avatar_url, first_name, last_name`)
      .eq('id', userId)
      .single()

    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default handler
