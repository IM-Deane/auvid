import type { NextApiRequest, NextApiResponse } from 'next'

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '../../../supabase/types/public'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient<Database>({ req, res })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    // get user's notes
    const { data, error } = await supabase.storage
      .from('notes')
      .list(user.id, { sortBy: { column: 'created_at', order: 'desc' } })

    if (error) throw new Error(error.message)

    const notes = data.filter(
      (note) => note.name !== '.emptyFolderPlaceholder' // ignore empty folder placeholder
    )

    res.status(200).json(notes)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default handler
