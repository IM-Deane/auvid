import { NextApiRequest, NextApiResponse } from 'next'

import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { transcribedText } = req.body

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${transcribedText} \n\nTl;dr:`,
      temperature: 0.7,
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 1
    })
    res.status(200).json(response.data.choices[0].text)
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
