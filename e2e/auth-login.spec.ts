import { test, expect } from '@playwright/test'

test('Login: Form loads', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('h1')).toContainText('Sign in to your account')
})

test('Login: Email and password fields present', async ({ page }) => {
  await page.goto('/login')
  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')
  await expect(emailInput).toBeVisible()
  await expect(passwordInput).toBeVisible()
})

test('Login: Sign in button clickable', async ({ page }) => {
  await page.goto('/login')
  const submitBtn = page.locator('button:has-text("Sign in")')
  await expect(submitBtn).toBeEnabled()
  await expect(submitBtn).toBeVisible()
})

test('Login: Register link present', async ({ page }) => {
  await page.goto('/login')
  const registerLink = page.getByRole('link', { name: /register/i })
  await expect(registerLink.first()).toBeVisible()
})
