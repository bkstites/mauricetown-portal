import { test, expect } from '@playwright/test'

const runRealAuthFlow = process.env.E2E_RUN_REAL_AUTH === '1'
const realAuthEmail = process.env.E2E_REAL_AUTH_EMAIL || 'staff@mauricetownrepair.com'
const realAuthPassword = process.env.E2E_REAL_AUTH_PASSWORD || 'PortalTest123!'

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

test('Login: successful sign in redirects to the requested page', async ({ page }) => {
  test.skip(!runRealAuthFlow, 'Set E2E_RUN_REAL_AUTH=1 to run the real auth regression test')

  await page.goto('/login?next=/admin/orders')
  await page.locator('input[type="email"]').fill(realAuthEmail)
  await page.locator('input[type="password"]').fill(realAuthPassword)
  await page.getByRole('button', { name: /^sign in$/i }).click()

  await page.waitForURL(/\/admin\/orders/)
  await expect(page.getByRole('heading', { name: /associate quote queue/i })).toBeVisible()
})
