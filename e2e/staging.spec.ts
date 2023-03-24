import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
  test('user fails to login', async ({ page }) => {
    await page.goto('/auth/login')
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
    await page.goto('/auth/login')
    await page.getByPlaceholder('tony@starkindustries.mu').click()
    await page
      .getByPlaceholder('tony@starkindustries.mu')
      .fill(process.env.VALID_EMAIL)
    await page.getByPlaceholder('tony@starkindustries.mu').press('Tab')
    await page.getByLabel('Password').fill(process.env.VALID_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Logged in successfully')).toBeVisible()
  })

  test('user can register using the signup form', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.getByPlaceholder('bruce@wayneenterprises.gotham').click()
    await page
      .getByPlaceholder('bruce@wayneenterprises.gotham')
      .fill('auvid@mail7.io')
    await page.getByPlaceholder('bruce@wayneenterprises.gotham').press('Tab')
    await page.getByLabel('Password').fill('MickeyMouse123!')
    await page.getByRole('button', { name: 'Sign up' }).click()

    await expect(
      page.getByText('Check your email for the next steps. 📧')
    ).toBeVisible()
  })
})
