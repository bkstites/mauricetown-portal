import { test, expect } from '@playwright/test'

test('Login: Form loads', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('text=Sign in to your account')).toBeVisible()
})

test('Login: Email and password fields present', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})

test('Login: Form validation - email required', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="password"]', 'TestPassword123!')
  await page.click('button:has-text("Sign in")')
  
  const emailInput = page.locator('input[type="email"]')
  const isInvalid = await emailInput.evaluate((el: any) => !el.checkValidity?.())
  expect(isInvalid).toBe(true)
})

test('Login: Form validation - password required', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.click('button:has-text("Sign in")')
  
  const passwordInput = page.locator('input[type="password"]')
  const isInvalid = await passwordInput.evaluate((el: any) => !el.checkValidity?.())
  expect(isInvalid).toBe(true)
})

test('Login: Sign in button clickable', async ({ page }) => {
  await page.goto('/login')
  const submitBtn = page.locator('button:has-text("Sign in")')
  await expect(submitBtn).toBeEnabled()
  await expect(submitBtn).toBeVisible()
})

test('Login: Register link present', async ({ page }) => {
  await page.goto('/login')
  const registerLink = page.locator('text=Register here')
  await expect(registerLink).toBeVisible()
  await registerLink.click()
  await page.waitForURL(/\/register/)
})
