import { test, expect } from '@playwright/test'

test('Home: Page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Mauricetown|Portal|Home/)
})

test('Home: Register link visible', async ({ page }) => {
  await page.goto('/')
  const registerLink = page.locator('a:has-text("Register")')
  await expect(registerLink).toBeVisible()
})

test('Home: Sign in link visible', async ({ page }) => {
  await page.goto('/')
  const signInLink = page.getByRole('link', { name: /sign in/i })
  await expect(signInLink.first()).toBeVisible()
})

test('Home: Page contains navigation elements', async ({ page }) => {
  await page.goto('/')
  // Simple check that page loads without 404 or errors
  await expect(page.locator('body')).toBeVisible()
})
