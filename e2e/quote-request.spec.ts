import { test, expect } from '@playwright/test'

test('Quote request requires authentication', async ({ page }) => {
  await page.goto('/request-quote')
  await expect(page).toHaveURL(/\/login\?next=%2Frequest-quote/)
})

test('Home navigation shows a single Request Quote link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Request Quote' })).toHaveCount(1)
})
