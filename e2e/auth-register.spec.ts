import { test, expect } from '@playwright/test'

test('Register: Form loads', async ({ page }) => {
  await page.goto('/register')
  await expect(page.locator('h1')).toContainText('Create your account')
})

test('Register: All form fields present', async ({ page }) => {
  await page.goto('/register')
  const inputs = page.locator('input')
  await expect(inputs).toHaveCount(5) // name, company, email, phone, password
})

test('Register: Submit button clickable', async ({ page }) => {
  await page.goto('/register')
  const submitBtn = page.locator('button:has-text("Create Account")')
  await expect(submitBtn).toBeEnabled()
  await expect(submitBtn).toBeVisible()
})

test('Register: Sign in link present and clickable', async ({ page }) => {
  await page.goto('/register')
  const signInLink = page.locator('a:has-text("Sign in")')
  await expect(signInLink).toBeVisible()
})
