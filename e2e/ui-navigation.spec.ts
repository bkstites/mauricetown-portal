import { test, expect } from '@playwright/test'

test('Navigation: Home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Mauricetown|Portal/)
})

test('Navigation: Register link visible on home', async ({ page }) => {
  await page.goto('/')
  const registerLink = page.locator('text=Register')
  await expect(registerLink).toBeVisible()
})

test('Navigation: Login link visible on home', async ({ page }) => {
  await page.goto('/')
  const loginLink = page.locator('text=Sign in')
  await expect(loginLink).toBeVisible()
})

test('Navigation: All primary buttons clickable', async ({ page }) => {
  await page.goto('/')
  const buttons = await page.locator('button').all()
  expect(buttons.length).toBeGreaterThan(0)
  
  for (const button of buttons) {
    const isDisabled = await button.isDisabled()
    const isHidden = await button.isHidden()
    expect(isDisabled || isHidden).toBe(false)
  }
})
