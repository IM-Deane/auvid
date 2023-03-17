import React, { createContext, useContext, useState } from 'react'

import { Profile } from '@/supabase/types/index'

type AccountContextProperties = {
  profile: Profile | null
  eventCount?: number
  setEventCount?: React.Dispatch<React.SetStateAction<number>>
}

const AccountContext = createContext<AccountContextProperties>({
  profile: null,
  eventCount: 0,
  setEventCount: () => undefined
})

interface Properties {
  children: React.ReactNode
}

const AccountProvider = ({ ...properties }: Properties) => {
  const [profile] = useState<Profile | null>(null)
  const [eventCount, setEventCount] = useState<number>(0)

  const returnValue = {
    profile,
    eventCount,
    setEventCount
  }

  return <AccountContext.Provider value={returnValue} {...properties} />
}

const useAccountContext = () => {
  const context = useContext(AccountContext)
  if (!context)
    throw new Error('useAccountContext must be used within a AccountProvider')

  return context
}

export { AccountContext, AccountProvider, useAccountContext }
