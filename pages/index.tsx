import React from 'react'

import siteConfig from 'site.config'

import EventCountList from '@/components/Dashboard/EventCountList'
import WelcomeHeader from '@/components/Dashboard/WelcomeHeader'
import Layout from '@/components/Layout'
import NoteGallery from '@/components/Notes/NotesList'

const IndexPage = () => {
  return (
    <Layout title={`Home | ${siteConfig.siteName}`}>
      <WelcomeHeader />
      <section className='mt-24'>
        <EventCountList />
      </section>
      <section className='my-24'>
        <NoteGallery />
      </section>
    </Layout>
  )
}

export default IndexPage
