import React from 'react'

import toast from 'react-hot-toast'
import siteConfig from 'site.config'

import ToastAlert from '@/components/ToastAlert'

import EventCountList from '../components/Dashboard/EventCountList'
import WelcomeHeader from '../components/Dashboard/WelcomeHeader'
import Layout from '../components/Layout'

const IndexPage = () => {
  const [response, setResponse] = React.useState<string | unknown | null>(null)

  const generate = async () => {
    const res = await fetch('/api/ping')

    toast.remove() // reset previous toast

    if (res.ok) {
      setResponse({
        status: res.status,
        body: await res.json(),
        headers: {
          'X-RateLimit-Limit': res.headers.get('X-RateLimit-Limit'),
          'X-RateLimit-Remaining': res.headers.get('X-RateLimit-Remaining'),
          'X-RateLimit-Reset': res.headers.get('X-RateLimit-Reset')
        }
      })

      toast.custom(({ visible }) => (
        <ToastAlert
          isOpen={visible}
          type='success'
          title='Request successful'
          message={`Response -- ${JSON.stringify(response)}`}
        />
      ))
    } else {
      setResponse(null)

      toast.custom(({ visible }) => (
        <ToastAlert
          isOpen={visible}
          type='error'
          title='Too many requests!'
          message="Why don't we take it a little slower 😅"
        />
      ))
      console.error('Too many requests')
    }
  }

  return (
    <Layout title={`Home | ${siteConfig.siteName}`}>
      <WelcomeHeader />
      <section className='mt-8'>
        <header>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Latest actions
          </h3>
        </header>
        <EventCountList />
        <div className='my-5'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={generate}
          >
            Hit API
          </button>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
