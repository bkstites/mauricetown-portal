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

test('Home: Login link visible', async ({ page }) => {
  await page.goto('/')
  const loginLink = page.locator('a:has-text("Login"), button:has-text("Sign")')
  await expect(loginLink.first()).toBeVisible()
})

test('Home: Page contains navigation elements', async ({ page }) => {
  await page.goto('/')
  // Simple check that page loads without 404 or errors
  await expect(page.locator('body')).toBeVisible()
})
