import {
  BookOpenIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

import { NestedTab, siteConfig } from './types/site-config'

const domainName = process.env.DOMAIN_NAME || 'app.auvid.io'

const BILLING_HREF = '/account/billing'

const billing: NestedTab = {
  name: 'Billing',
  current: false,
  href: BILLING_HREF,
  children: {
    usage: {
      name: 'Usage',
      href: `${BILLING_HREF}/usage`,
      current: false
    },
    invoices: {
      name: 'Invoices',
      href: `${BILLING_HREF}/invoices`,
      current: false
    },
    subscription: {
      name: 'Subscription',
      href: `${BILLING_HREF}/subscription`,
      current: false
    }
  }
}

export default siteConfig({
  siteName: 'Auvid',
  productBrand: '#',
  domain: domainName,
  developer: 'Alchemized Software Ltd.',
  contactEmail: 'hello@alchemizedsoftware.com', // TODO: change this to auvid email

  // site description (optional for dashboard)
  description:
    'Auvid is a audio and video transcription service. The platform equips you with everything you need to create outstanding transcriptions.',

  // main navigation tabs
  mainNavTabs: [
    { name: 'Dashboard', icon: HomeIcon, current: true, href: '/' },
    {
      name: 'About',
      icon: BookOpenIcon,
      current: false,
      href: '/about'
    },
    {
      name: 'Notes',
      icon: DocumentDuplicateIcon,
      current: false,
      children: [
        { name: 'Overview', href: '/notes' },
        { name: 'Add Note', href: '/upload' }
      ]
    },
    {
      name: 'Account',
      icon: UserCircleIcon,
      current: false,
      children: [{ name: 'Your Profile', href: '/account' }, { ...billing }]
    }
  ],
  accountNavTabs: [
    { name: 'Your Profile', href: '/account' },
    billing,
    { name: 'Sign out' }
  ],
  settingsNavTabs: [
    { name: 'Account', href: '/account', current: true },
    {
      name: 'Subscription',
      href: '/account/subscription',
      current: false
    },
    { name: 'Billing', href: '/account/billing', current: false }
  ]
})
