import React from 'react'

import useProfile from '@/hooks/useProfile'
import siteConfig from 'site.config'

function WelcomeHeader() {
  const { userWithProfile, isLoading } = useProfile()

  if (isLoading) return <p>Loading...</p>

  return (
    <header>
      <h1 className='text-2xl font-semibold text-gray-900'>
        Welcome{' '}
        {userWithProfile?.first_name
          ? `${userWithProfile.first_name}!`
          : `to ${siteConfig.siteName}! 🔊`}
      </h1>
    </header>
  )
}

export default WelcomeHeader
