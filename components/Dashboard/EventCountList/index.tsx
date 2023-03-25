import Link from 'next/link'
import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { EnvelopeOpenIcon } from '@heroicons/react/24/outline'

import AnalyticsService from '../../../utils/services/analytics-service'
import LoadingSkeleton from '../../cards/LoadingSkeleton'

interface EventCountListItem {
  key: string
  value: number
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function EventCountList() {
  const { data, isLoading, error } = AnalyticsService.getEventCounts({
    transcriptions: true,
    summaries: true,
    notes: true
  })

  if (error) return <p>Error!</p>
  if (isLoading) return <LoadingSkeleton count={3} />

  const eventCounts: EventCountListItem = data.data

  return (
    <dt className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
      {eventCounts &&
        Object.entries(eventCounts).map(([key, value]) => (
          <div
            key={key + Date.now().toLocaleString()}
            className='relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6'
          >
            <div>
              <div className='absolute rounded-md bg-blue-500 p-3'>
                <EnvelopeOpenIcon
                  className='h-6 w-6 text-white'
                  aria-hidden='true'
                />
              </div>
              <p className='ml-16 truncate text-sm font-medium text-gray-500'>
                Total {key.charAt(0).toUpperCase() + key.slice(1)}
              </p>
            </div>
            <div className='ml-16 flex items-baseline pb-6 sm:pb-7'>
              <p className='text-2xl font-semibold text-gray-900'>{value}</p>
              {value != 0 && (
                <p
                  className={classNames(
                    value > 0 ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  )}
                >
                  {value > 0 ? (
                    <ArrowUpIcon
                      className='h-5 w-5 flex-shrink-0 self-center text-green-500'
                      aria-hidden='true'
                    />
                  ) : (
                    <ArrowDownIcon
                      className='h-5 w-5 flex-shrink-0 self-center text-red-500'
                      aria-hidden='true'
                    />
                  )}

                  <span className='sr-only'>
                    {' '}
                    {value > 0 ? 'Increased' : 'Decreased'} by{' '}
                  </span>
                  {value}
                </p>
              )}
              <div className='absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6'>
                {key === 'notes' && (
                  <div className='text-sm'>
                    <Link
                      href='/notes'
                      className='font-medium text-blue-600 hover:text-blue-500 mt-1'
                    >
                      {' '}
                      View all
                      <span className='sr-only'> {key} stats</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </dt>
  )
}

export default EventCountList
