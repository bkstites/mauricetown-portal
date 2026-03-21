import { test, expect } from '@playwright/test'

test('Register: Form loads', async ({ page }) => {
  await page.goto('/register')
  await expect(page.locator('text=Create your account')).toBeVisible()
})

test('Register: All form fields present', async ({ page }) => {
  await page.goto('/register')
  await expect(page.locator('input[placeholder*="John Smith"]')).toBeVisible()
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
  await expect(page.locator('input[placeholder*="(856)"]')).toBeVisible()
})

test('Register: Form validation - email required', async ({ page }) => {
  await page.goto('/register')
  await page.fill('input[placeholder*="John Smith"]', 'Test User')
  await page.fill('input[type="password"]', 'TestPassword123!')
  await page.click('button:has-text("Create Account")')
  
  // Email field should show validation
  const emailInput = page.locator('input[type="email"]')
  const isInvalid = await emailInput.evaluate((el: any) => !el.checkValidity?.())
  expect(isInvalid).toBe(true)
})

test('Register: Form validation - password required', async ({ page }) => {
  await page.goto('/register')
  await page.fill('input[placeholder*="John Smith"]', 'Test User')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.click('button:has-text("Create Account")')
  
  const passwordInput = page.locator('input[type="password"]')
  const isInvalid = await passwordInput.evaluate((el: any) => !el.checkValidity?.())
  expect(isInvalid).toBe(true)
})

test('Register: Submit button clickable', async ({ page }) => {
  await page.goto('/register')
  const submitBtn = page.locator('button:has-text("Create Account")')
  await expect(submitBtn).toBeEnabled()
  await expect(submitBtn).toBeVisible()
})

test('Register: Sign in link present', async ({ page }) => {
  await page.goto('/register')
  const signInLink = page.locator('text=Sign in')
  await expect(signInLink).toBeVisible()
  await signInLink.click()
  await page.waitForURL(/\/login/)
})
