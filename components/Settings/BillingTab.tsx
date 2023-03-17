import React from 'react'

import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

const payments = [
  {
    id: 1,
    date: '1/1/2020',
    datetime: '2020-01-01',
    description: 'Business Plan - Annual Billing',
    amount: 'CA$109.00',
    href: '#'
  }
]

function BillingTab() {
  return (
    <div className='space-y-6 sm:px-6 lg:col-span-9 lg:px-0'>
      <section aria-labelledby='payment-details-heading'>
        <form action='#' method='POST'>
          <div className='shadow sm:overflow-hidden sm:rounded-md'>
            <div className='bg-white py-6 px-4 sm:p-6'>
              <div>
                <h2
                  id='payment-details-heading'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Payment details
                </h2>
                <p className='mt-1 text-sm text-gray-500'>
                  Update your billing information. Please note that updating
                  your location could affect your tax rates.
                </p>
              </div>

              <div className='mt-6 grid grid-cols-4 gap-6'>
                <div className='col-span-4 sm:col-span-2'>
                  <label
                    htmlFor='first-name'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    First name
                  </label>
                  <input
                    type='text'
                    name='first-name'
                    id='first-name'
                    autoComplete='cc-given-name'
                    className='mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                  />
                </div>

                <div className='col-span-4 sm:col-span-2'>
                  <label
                    htmlFor='last-name'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Last name
                  </label>
                  <input
                    type='text'
                    name='last-name'
                    id='last-name'
                    autoComplete='cc-family-name'
                    className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                  />
                </div>

                <div className='col-span-4 sm:col-span-2'>
                  <label
                    htmlFor='email-address'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Email address
                  </label>
                  <input
                    type='text'
                    name='email-address'
                    id='email-address'
                    autoComplete='email'
                    className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                  />
                </div>

                <div className='col-span-4 sm:col-span-1'>
                  <label
                    htmlFor='expiration-date'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Expration date
                  </label>
                  <input
                    type='text'
                    name='expiration-date'
                    id='expiration-date'
                    autoComplete='cc-exp'
                    className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                    placeholder='MM / YY'
                  />
                </div>

                <div className='col-span-4 sm:col-span-1'>
                  <label
                    htmlFor='security-code'
                    className='flex items-center text-sm font-medium leading-6 text-gray-900'
                  >
                    <span>Security code</span>
                    <QuestionMarkCircleIcon
                      className='ml-1 h-5 w-5 flex-shrink-0 text-gray-300'
                      aria-hidden='true'
                    />
                  </label>
                  <input
                    type='text'
                    name='security-code'
                    id='security-code'
                    autoComplete='cc-csc'
                    className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                  />
                </div>

                <div className='col-span-4 sm:col-span-2'>
                  <label
                    htmlFor='country'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Country
                  </label>
                  <select
                    id='country'
                    name='country'
                    autoComplete='country-name'
                    className='mt-2 block w-full rounded-md border-0 bg-white py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>

                <div className='col-span-4 sm:col-span-2'>
                  <label
                    htmlFor='postal-code'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    ZIP / Postal code
                  </label>
                  <input
                    type='text'
                    name='postal-code'
                    id='postal-code'
                    autoComplete='postal-code'
                    className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
              <button
                type='submit'
                className='inline-flex justify-center rounded-md bg-gray-900 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Billing history */}
      <section aria-labelledby='billing-history-heading'>
        <div className='bg-white pt-6 shadow sm:overflow-hidden sm:rounded-md'>
          <div className='px-4 sm:px-6'>
            <h2
              id='billing-history-heading'
              className='text-lg font-medium leading-6 text-gray-900'
            >
              Billing history
            </h2>
          </div>
          <div className='mt-6 flex flex-col'>
            <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                <div className='overflow-hidden border-t border-gray-200'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-sm font-semibold text-gray-900'
                        >
                          Date
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-sm font-semibold text-gray-900'
                        >
                          Description
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-sm font-semibold text-gray-900'
                        >
                          Amount
                        </th>
                        {/*
                                  `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                                */}
                        <th
                          scope='col'
                          className='relative px-6 py-3 text-left text-sm font-medium text-gray-500'
                        >
                          <span className='sr-only'>View receipt</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                            <time dateTime={payment.datetime}>
                              {payment.date}
                            </time>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                            {payment.description}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                            {payment.amount}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                            <a
                              href={payment.href}
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              View receipt
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BillingTab
