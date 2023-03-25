import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { classNames } from '@/utils/index'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import siteConfig from 'site.config'

import RobotProfileImg from '../public/images/rock-n-roll-monkey-FTfjMijq-Ws-unsplash.jpg'
import ZoroProfileImg from '../public/images/zoro-profile.jpg'

const navigation = siteConfig.mainNavTabs

const accountNavigation = siteConfig.accountNavTabs

type Props = {
  children?: ReactNode
  title?: string
}

interface User {
  id: string
  email: string
  avatar_url: string
}

/**
 * If the user has an avatar_url, use that. Otherwise, let's have some
 * fun and show a robot image in prod. (a bit more professional) and Zoro
 * everywhere else.
 */
const getAvatarSource = (user: User) => {
  if (user?.avatar_url) {
    return user.avatar_url
  } else if (process.env.NODE_ENV !== 'production') {
    return ZoroProfileImg
  } else {
    return RobotProfileImg
  }
}

const Layout = ({ children, title = siteConfig.siteName }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  const router = useRouter()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.log('Error signing out: ', error)
    }
  }

  navigation.forEach((item) => {
    if (item.href === router.pathname) {
      item.current = true
    } else {
      item.current = false
    }
  })

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session.user)
    }
    getCurrentUser()
  }, [])

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-40 md:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-gray-800'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                      <button
                        type='button'
                        className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
                    <div className='flex flex-shrink-0 items-center px-4'>
                      <div className='relative h-8 w-8'>
                        <Image
                          src={siteConfig.productBrand}
                          alt={`${siteConfig.siteName} logo`}
                          fill
                        />
                      </div>
                    </div>
                    <nav className='mt-5 space-y-1 px-2'>
                      {navigation.map((item) =>
                        !item.children ? (
                          <div key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? 'text-gray-300'
                                    : 'text-gray-400 group-hover:text-gray-300',
                                  'mr-3 flex-shrink-0 h-6 w-6'
                                )}
                                aria-hidden='true'
                              />
                              {item.name}
                            </Link>
                          </div>
                        ) : (
                          <Disclosure
                            as='div'
                            key={item.name}
                            className='space-y-1'
                          >
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-900 text-white'
                                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                  )}
                                >
                                  <item.icon
                                    className='mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                                    aria-hidden='true'
                                  />
                                  <span className='flex-1'>{item.name}</span>
                                  <svg
                                    className={classNames(
                                      open
                                        ? 'text-gray-400 rotate-90'
                                        : 'text-gray-300',
                                      'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                                    )}
                                    viewBox='0 0 20 20'
                                    aria-hidden='true'
                                  >
                                    <path
                                      d='M6 6L14 10L6 14V6Z'
                                      fill='currentColor'
                                    />
                                  </svg>
                                </Disclosure.Button>
                                <Disclosure.Panel className='space-y-1'>
                                  {item.children.map((subItem) => (
                                    <Disclosure.Button
                                      key={subItem.name}
                                      as='a'
                                      href={subItem.href}
                                      className='group bg-gray-700 flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-300 hover:bg-gray-500 hover:text-white'
                                    >
                                      {subItem.name}
                                    </Disclosure.Button>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )
                      )}
                    </nav>
                  </div>
                  <div className='flex flex-shrink-0 bg-gray-700 p-4'>
                    <Link href='/account' className='group block flex-shrink-0'>
                      <div className='flex items-center'>
                        <div className='h-10 w-10 relative'>
                          <Image
                            className='rounded-full'
                            src={getAvatarSource(user)}
                            fill
                            alt='User avatar'
                          />
                        </div>
                        <div className='ml-3'>
                          <p className='text-base truncate font-medium text-white'>
                            {user ? user.email : 'Test User'}
                          </p>
                          <p className='text-sm font-medium text-gray-400 group-hover:text-gray-300'>
                            View profile
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0'>
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex min-h-0 flex-1 flex-col bg-gray-800'>
            <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
              <div className='flex flex-shrink-0 items-center px-4'>
                <div className='relative h-12 w-12'>
                  <Image
                    src={siteConfig.productBrand}
                    alt={`${siteConfig.siteName} logo`}
                    fill
                  />
                </div>
              </div>
              <nav className='mt-5 flex-1 space-y-1 px-2'>
                {navigation.map((item) =>
                  !item.children ? (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? 'text-gray-300'
                              : 'text-gray-400 group-hover:text-gray-300',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden='true'
                        />
                        {item.name}
                      </Link>
                    </div>
                  ) : (
                    <Disclosure as='div' key={item.name} className='space-y-1'>
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            )}
                          >
                            <item.icon
                              className='mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                              aria-hidden='true'
                            />
                            <span className='flex-1'>{item.name}</span>
                            <svg
                              className={classNames(
                                open
                                  ? 'text-gray-400 rotate-90'
                                  : 'text-gray-300',
                                'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                              )}
                              viewBox='0 0 20 20'
                              aria-hidden='true'
                            >
                              <path
                                d='M6 6L14 10L6 14V6Z'
                                fill='currentColor'
                              />
                            </svg>
                          </Disclosure.Button>
                          <Disclosure.Panel className='space-y-1'>
                            {item.children.map((subItem) => (
                              <Disclosure.Button
                                key={subItem.name}
                                as='a'
                                href={subItem.href}
                                className='group bg-gray-700 flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-300 hover:bg-gray-500 hover:text-white'
                              >
                                {subItem.name}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )
                )}
              </nav>
            </div>
            <div className='flex flex-shrink-0 bg-gray-700 p-4'>
              {/* Profile dropdown */}
              <Menu as='div'>
                <Menu.Button className='group block w-full flex-shrink-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  <span className='sr-only'>Open user menu</span>
                  <div className='flex items-center'>
                    <div className='h-10 w-10 relative overflow-hidden rounded-full'>
                      <Image
                        className='rounded-full object-cover'
                        src={getAvatarSource(user)}
                        fill
                        alt='User avatar'
                      />
                    </div>
                    <div className='ml-3'>
                      <p className='text-xs truncate font-medium text-white'>
                        {user ? user.email : 'Test User'}
                      </p>
                      <p className='text-xs mt-1 font-medium text-gray-400 group-hover:text-gray-200'>
                        View profile
                      </p>
                    </div>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute bottom-10 left-14 z-10 mt-2 w-48 origin-bottom-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    {accountNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <div>
                            {item.name !== 'Sign out' ? (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </Link>
                            ) : (
                              <button
                                onClick={handleSignOut}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'w-full block px-4 py-2 text-sm text-gray-700 text-left'
                                )}
                              >
                                {item.name}
                              </button>
                            )}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        <div className='flex flex-1 flex-col md:pl-64'>
          <div className='sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden'>
            <button
              type='button'
              className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <main className='flex-1'>
            <div className='py-6'>
              <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
