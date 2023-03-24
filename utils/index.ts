import { NavTab } from '@/types/site-config'
import siteConfig from 'site.config'

/**
 * Capitalize first letter and trim edges of text
 * @param {string} text to be formatted
 * @returns {string} formatted text
 */
export function trimEdgesAndCapitalizeFirstLetter(text: string) {
  if (!text) return // invalid text

  if (text.length === 1) return text.toUpperCase()

  const newStr = text.trim()
  return newStr.charAt(0).toUpperCase() + newStr.slice(1)
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Helper function that updates the tabs based on the current page route.
 */
export function updateActiveSettingsTab(currentPathURL: string): NavTab[] {
  const indexPosition = currentPathURL.lastIndexOf('/')
  const getPathNameLastSegment = currentPathURL.substring(indexPosition + 1)

  const updatedTabs = siteConfig.settingsNavTabs.map((tab) => {
    if (getPathNameLastSegment === tab.name.toLowerCase()) {
      return { ...tab, current: true }
    } else {
      return { ...tab, current: false }
    }
  })

  return updatedTabs
}
