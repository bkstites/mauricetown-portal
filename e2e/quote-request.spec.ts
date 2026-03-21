import { test, expect } from '@playwright/test'

test('Quote request: page loads and required fields are visible', async ({ page }) => {
  await page.goto('/request-quote')
  await expect(page.getByRole('heading', { name: /submit a parts quote request/i })).toBeVisible()
  await expect(page.getByLabel(/Contact Name/i)).toBeVisible()
  await expect(page.getByLabel(/Shop \/ Fleet Name/i)).toBeVisible()
  await expect(page.getByLabel(/Email/i)).toBeVisible()
})

test('Quote request: submit with required details', async ({ page }) => {
  await page.goto('/request-quote')

  await page.getByLabel(/Contact Name/i).fill('Bryan Stites')
  await page.getByLabel(/Shop \/ Fleet Name/i).fill('Smith Trucking LLC')
  await page.getByLabel(/Email/i).fill('bryan@example.com')
  await page.getByLabel(/Parts Needed/i).fill('Turbocharger 23512345 qty 1')
  await page.getByLabel(/Repair Context/i).fill('Truck has power loss and overboost code under load.')

  await page.getByRole('button', { name: /submit quote request/i }).click()
  await expect(page.getByText(/request submitted successfully/i)).toBeVisible()
  await expect(page.getByText(/request id:/i)).toBeVisible()
})
