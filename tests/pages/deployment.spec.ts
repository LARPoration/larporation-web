import { expect, test } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'

test('live export has hosting rules, a timeline and no captured source', async ({
  page,
  request,
}) => {
  for (const route of ['/history', '/history/']) {
    const response = await request.get(route, { maxRedirects: 0 })
    expect(response.status()).toBe(302)
    expect(response.headers().location).toBe('/')
  }
  for (const route of ['/source/package.json', '/_archive/build.json']) {
    expect((await request.get(route)).status()).toBe(404)
  }
  expect(existsSync('out/_archive')).toBe(false)
  expect(readFileSync('out/_headers', 'utf8')).toContain(
    'X-Frame-Options: DENY',
  )
  await page.goto('/join')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://larporation.com/join',
  )
  expect(await (await request.get('/sitemap.xml')).text()).toContain(
    'https://larporation.com/join',
  )
  expect(await (await request.get('/robots.txt')).text()).toContain(
    'Sitemap: https://larporation.com/sitemap.xml',
  )
  await expect(
    page.getByRole('region', { name: 'Website history timeline' }),
  ).toBeVisible()
  await expect(
    page.getByText('Participation is unpaid. There is no salary.'),
  ).toBeVisible()
  await expect(
    page.locator('main a[href="https://www.linkedin.com/company/larporation"]'),
  ).toBeVisible()
})
