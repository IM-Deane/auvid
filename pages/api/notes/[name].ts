import type { NextApiRequest, NextApiResponse } from 'next'

import type { Database } from '@/supabase/types/public'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name } = req.query
  const filename = name as string

  try {
    const supabase = createServerSupabaseClient<Database>({ req, res })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const noteResponse = await supabase.storage.from('notes').list(user.id, {
      search: filename
    })

    if (noteResponse.error) throw noteResponse.error.message
    if (!noteResponse.data) throw new Error('Note not found')

    const downloadResponse = await supabase.storage
      .from('notes')
      .download(`${user.id}/${name}`)

    if (downloadResponse.error) throw downloadResponse.error
    if (!downloadResponse.data)
      throw new Error('There was a problem getting the note data')

    const fileData = { ...noteResponse.data[0] }
    fileData['contents'] = await downloadResponse.data.text()

    // The method returns true for the first instance of "Summary" found.
    // Because we use it as a section header before any text, only the document's title
    // throws a false positive
    fileData['hasSummary'] = fileData['contents'].includes('Summary:')

    res.status(200).json(fileData)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default handler
