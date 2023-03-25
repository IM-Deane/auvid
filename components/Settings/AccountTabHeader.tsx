import Link from 'next/link'
import React from 'react'

import { classNames } from '@/utils/index'

function AccountTabHeader({ tabs }) {
  return (
    <div className='px-4 sm:px-6 lg:px-0'>
      <div className='py-6'>
        {/* Tabs */}
        <div className='lg:hidden'>
          <label htmlFor='selected-tab' className='sr-only'>
            Select a tab
          </label>
          <select
            id='selected-tab'
            name='selected-tab'
            className='mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6'
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className='hidden lg:block'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8'>
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                  )}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountTabHeader
