import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { EventCountSearchParams } from '../../../types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient({ req, res })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const params: EventCountSearchParams = {}

    if (!user.id) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    // map over query params and return an array of promises
    const promises = Object.entries(req.query).map(async ([key, value]) => {
      // convert string to boolean and assign to params
      params[key] = !!value

      if (!value) return

      // get events related to user
      // more: https://supabase.com/docs/reference/javascript/using-filters
      return await supabase
        .from(key)
        .select(`id, events!inner(id)`)
        .eq('events.profile_id', user.id)
    })

    // destructure and assign (note: order matters!)
    const [transcriptions, summaries, notes] = await Promise.all(promises)

    res.status(200).json({
      transcriptions: transcriptions.data.length,
      summaries: summaries.data.length,
      notes: notes.data.length
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
