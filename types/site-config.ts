export interface SiteConfig {
  siteName: string
  domain: string
  developer: string
  constactEmail: string
  description?: string
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config
}
