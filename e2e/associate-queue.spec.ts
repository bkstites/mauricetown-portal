import { test, expect } from '@playwright/test'

test('Associate queue requires authentication', async ({ page }) => {
  await page.goto('/admin/orders')
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Forders/)
})

test('My requests requires authentication', async ({ page }) => {
  await page.goto('/orders')
  await expect(page).toHaveURL(/\/login\?next=%2Forders/)
})
