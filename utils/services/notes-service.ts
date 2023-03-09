import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'

class NotesService {
  private service: any
  private fetcher = async (url) => await this.service.get(url)

  constructor() {
    this.service = axios.create({
      baseURL: '/api/notes',
      headers: {
        Accept: 'application/json'
      }
    })

    this.fetcher = this.fetcher.bind(this)
  }

  /**
   * Find the user's current note count.
   * Will cache the result using `useSWR()`.
   */
  getCurrentNotes = () => {
    const { data, isLoading, error, mutate } = useSWR('/', this.fetcher)
    const notes = data?.data || []

    return {
      notes,
      isLoading,
      error,
      refreshNotes: mutate
    }
  }

  /**
   * Remove's the specified note from storage
   */
  deleteNote = async (noteName: string) => {
    return await this.service.delete(`/${noteName}`)
  }

  /**
   * Upload a new note to storage
   * @returns {AxiosResponse} response object containing all events
   */
  uploadNote = async (
    filenameWithExt,
    transcribedText,
    summarizedText,
    filetype,
    documentTitle
  ): Promise<AxiosResponse> => {
    return await this.service.post('/save', {
      filename: filenameWithExt,
      fullText: transcribedText,
      summary: summarizedText, // this can be empty
      filetype: filetype,
      documentTitle
    })
  }

  /**
   * Generates a summary of the transcribed text
   * @returns {AxiosResponse} response object containing all events
   */
  createNoteSummary = async (transcribedText): Promise<AxiosResponse> => {
    return await this.service.post('/summarize', { transcribedText })
  }
}

export default new NotesService()
