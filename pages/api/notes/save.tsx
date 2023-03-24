import { NextApiRequest, NextApiResponse } from 'next'

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import fs from 'fs'
import path from 'path'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const supabase = createServerSupabaseClient({ req, res })
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user)
      return res.status(401).json({
        error: 'not_authenticated',
        message:
          'The user does not have an active session or is not authenticated'
      })

    const { filename, documentTitle, fullText, summary } = req.body

    const assembledFiletext = assembleFileText(documentTitle, summary, fullText)
    const filenameWithExt = filename.replace(/[^a-z0-9.]/gi, '-').toLowerCase()
    const tempFilePath = `${path.join(process.cwd(), 'tmp')}/${filenameWithExt}`

    const writeStream = fs.createWriteStream(tempFilePath, { flags: 'a' })
    writeStream.write(assembledFiletext, (err) => {
      if (err) throw err

      console.log('ADDED CONTENT TO FILE...')
    })
    writeStream.end()

    writeStream.on('finish', () => {
      writeStream.close()
      console.log('FINISHED WRITING TO FILE...')

      fs.readFile(tempFilePath, 'utf8', async (err, data) => {
        if (err) throw err

        console.log('UPLOADING CONTENTS TO WEB STORAGE...')

        const { error } = await supabase.storage
          .from('notes')
          .upload(`${user.id}/${filenameWithExt}`, data, {
            cacheControl: '3600', // cache for 1 hour
            contentType: 'text/plain',
            upsert: true
          })

        if (error) {
          console.error(error.message)
          return res.status(500).json({ message: error.message })
        }

        console.log('SUCCESSFULLY UPLOADED FILE...')

        res.status(200).json({
          message: 'Successfully uploaded file',
          filename: filenameWithExt
        })

        console.log('REMOVING TEMPORARY FILES...')

        // TODO: move this logic to a finally block?
        fs.unlink(tempFilePath, (err) => {
          if (err) throw new Error(err.message)

          console.log('DONE.')
        })
      })
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export default handler

const assembleFileText = (
  documentTitle: string,
  summary: string,
  fullText: string
) => {
  let fileText = `${documentTitle}\n\n`

  if (summary) fileText += `Summary:\n${summary}\n\n`

  fileText += `Full Transcript:\n${fullText}\n\n`

  return fileText
}
