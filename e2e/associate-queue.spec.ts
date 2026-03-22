import { test, expect } from '@playwright/test'

test('Associate queue: submitted request appears in queue', async ({ page }) => {
  await page.goto('/request-quote')

  await page.getByLabel(/Contact Name/i).fill('Queue Test User')
  await page.getByLabel(/Shop \/ Fleet Name/i).fill('Queue Test Shop')
  await page.getByLabel(/Email/i).fill('queue@example.com')
  await page.getByLabel(/Parts Needed/i).fill('Steering box assembly qty 1')
  await page.getByLabel(/Repair Context/i).fill('Excessive steering play during road test.')
  await page.getByRole('button', { name: /submit quote request/i }).click()

  await expect(page.getByText(/request submitted successfully/i)).toBeVisible()
  const requestText = await page.getByText(/Request ID:/i).textContent()
  const requestId = requestText?.match(/MTQ-[0-9-]+/)?.[0]
  expect(requestId).toBeTruthy()

  await page.goto('/admin/orders')
  await expect(page.getByText(requestId!)).toBeVisible()
})
