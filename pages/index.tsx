import React from 'react'

import toast from 'react-hot-toast'
import siteConfig from 'site.config'

import ToastAlert from '@/components/ToastAlert'

import EventCountList from '../components/Dashboard/EventCountList'
import WelcomeHeader from '../components/Dashboard/WelcomeHeader'
import Layout from '../components/Layout'

const IndexPage = () => {
  return (
    <Layout title={`Home | ${siteConfig.siteName}`}>
      <WelcomeHeader />
      <section className='mt-8'>
        <div className='my-5'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={async () => {
              const response = await fetch('/api/ping')
              if (response.status === 429) {
                toast.custom(({ visible }) => (
                  <ToastAlert
                    isOpen={visible}
                    type='error'
                    title='Too many requests!'
                    message="Why don't we take it a little slower 😅"
                  />
                ))
                console.error('Too many requests')
                return
              }

              const data = await response.json()
              console.log('ping result', data)
            }}
          >
            Hit API
          </button>
        </div>
        <header>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Latest actions
          </h3>
        </header>
        <EventCountList />
      </section>
    </Layout>
  )
}

export default IndexPage
