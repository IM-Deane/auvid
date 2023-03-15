export interface SiteConfig {
  siteName: string
  domain: string
  developer: string
  productBrand: string
  contactEmail: string
  description?: string
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config
}
