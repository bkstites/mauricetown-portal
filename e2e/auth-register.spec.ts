import { test, expect } from '@playwright/test'

test('Register: Form loads', async ({ page }) => {
  await page.goto('/register')
  await expect(page.locator('h1')).toContainText('Create your account')
})

test('Register: All form fields present', async ({ page }) => {
  await page.goto('/register')
  const inputs = page.locator('input')
  await expect(inputs).toHaveCount(6) // name, company, email, phone, password, MFA checkbox
  await expect(page.locator('input[placeholder="John Smith"]')).toBeVisible()
  await expect(page.locator('input[placeholder="Smith Trucking LLC"]')).toBeVisible()
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})

test('Register: Submit button clickable', async ({ page }) => {
  await page.goto('/register')
  const submitBtn = page.locator('button:has-text("Create Account")')
  await expect(submitBtn).toBeEnabled()
  await expect(submitBtn).toBeVisible()
})

test('Register: Sign in link present', async ({ page }) => {
  await page.goto('/register')
  const signInLink = page.getByRole('link', { name: /sign in/i })
  await expect(signInLink.first()).toBeVisible()
})
