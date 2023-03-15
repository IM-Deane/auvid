import { siteConfig } from './types/site-config'

const domainName = process.env.DOMAIN_NAME || 'app.auvid.io'

export default siteConfig({
  siteName: 'Auvid',
  productBrand: '#',
  domain: domainName,
  developer: 'Alchemized Software Ltd.',
  contactEmail: 'hello@alchemizedsoftware.com', // TODO: change this to auvid email

  // site description (optional for dashboard)
  description:
    'Auvid is a audio and video transcription service. The platform equips you with everything you need to create outstanding transcriptions.'
})
