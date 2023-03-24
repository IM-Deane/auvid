import { expect, test } from '@playwright/test'

test('failed user login', async ({ page }) => {
  await page.goto('https://staging.auvid.io/auth/login')
  await page.getByPlaceholder('tony@starkindustries.mu').click()
  await page
    .getByPlaceholder('tony@starkindustries.mu')
    .fill('tester@example.com')
  await page.getByPlaceholder('tony@starkindustries.mu').press('Tab')
  await page.getByLabel('Password').fill('MonkeyLuunch123!')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText('Invalid login credentials')).toBeVisible()
})

test('user logs in successfully', async ({ page }) => {
  await page.goto('https://staging.auvid.io/auth/login')
  await page.getByPlaceholder('tony@starkindustries.mu').click()
  await page
    .getByPlaceholder('tony@starkindustries.mu')
    .fill(process.env.VALID_EMAIL)
  await page.getByPlaceholder('tony@starkindustries.mu').press('Tab')
  await page.getByLabel('Password').fill(process.env.VALID_PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect.soft(page.getByText('Invalid login credentials')).toBeVisible()
})
