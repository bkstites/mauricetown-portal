import { test, expect } from '@playwright/test'

const runRealAuthFlow = process.env.E2E_RUN_REAL_AUTH === '1'
const realAuthEmail = process.env.E2E_REAL_AUTH_EMAIL || 'customer@mauricetownrepair.com'
const realAuthPassword = process.env.E2E_REAL_AUTH_PASSWORD || 'PortalTest123!'

test('Quote request requires authentication', async ({ page }) => {
  await page.goto('/request-quote')
  await expect(page).toHaveURL(/\/login\?next=%2Frequest-quote/)
})

test('Home navigation shows a single Request Quote link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Request Quote' })).toHaveCount(1)
})

test('Quote request shows explicit missing-field guidance', async ({ page }) => {
  await page.goto('/login?next=/request-quote')
  await page.locator('input[type="email"]').fill(realAuthEmail)
  await page.locator('input[type="password"]').fill(realAuthPassword)
  await page.getByRole('button', { name: /^sign in$/i }).click()

  await page.waitForURL(/\/request-quote/)
  await page.getByRole('button', { name: /submit quote request/i }).click()

  await expect(page.getByText(/required before submit:/i)).toBeVisible()
  await expect(page.getByText(/please complete the required fields:/i)).toBeVisible()
})

test('Quote request submits successfully for a signed-in customer', async ({ page }) => {
  test.skip(!runRealAuthFlow, 'Set E2E_RUN_REAL_AUTH=1 to run the real quote submission test')

  await page.goto('/login?next=/request-quote')
  await page.locator('input[type="email"]').fill(realAuthEmail)
  await page.locator('input[type="password"]').fill(realAuthPassword)
  await page.getByRole('button', { name: /^sign in$/i }).click()

  await page.waitForURL(/\/request-quote/)
  await expect(page.locator('#email')).toHaveValue(realAuthEmail)
  await page.locator('#contactName').fill('Portal Customer')
  await page.locator('#shopName').fill('Preview Test Fleet')
  await page.locator('#partsNeeded').fill('Turbocharger 23512345 qty 1')
  await page.locator('#repairContext').fill('Truck has power loss under load and needs a quote for replacement.')
  await expect(page.locator('#shopName')).toHaveValue('Preview Test Fleet')
  await expect(page.locator('#partsNeeded')).toHaveValue('Turbocharger 23512345 qty 1')
  await expect(page.locator('#repairContext')).toHaveValue('Truck has power loss under load and needs a quote for replacement.')
  await page.getByRole('button', { name: /submit quote request/i }).click()

  await expect(page.getByText(/request submitted successfully/i)).toBeVisible()
  await expect(page.getByText(/request id:/i)).toBeVisible()
})
