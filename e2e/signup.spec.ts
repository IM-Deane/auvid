import { test } from '@playwright/test'

test('user can register using the signup form', async ({ page }) => {
  await page.goto('https://staging.auvid.io/auth/signup')
  await page.getByRole('link', { name: 'sign up for a plan today' }).click()
  await page.getByPlaceholder('bruce@wayneenterprises.gotham').click()
  await page
    .getByPlaceholder('bruce@wayneenterprises.gotham')
    .fill('auvid@mail7.io')
  await page.getByPlaceholder('bruce@wayneenterprises.gotham').press('Tab')
  await page.getByLabel('Password').fill('MickeyMouse123!')
  await page.getByRole('button', { name: 'Sign up' }).click()
})
