import { expect, test } from '@playwright/test'

const routes = ['/', '/about', '/projects', '/people', '/join', '/contact']

for (const route of routes) {
  test(`direct visit and refresh: ${route}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('main')).toBeVisible()
    await expect(
      page.getByRole('main').getByRole('heading').first(),
    ).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()

    const refreshed = await page.reload()
    expect(refreshed?.status()).toBe(200)
    await expect(page.getByRole('main')).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('shared navigation connects the six routes', async ({ page }) => {
  await page.goto('/')
  for (const [label, route] of [
    ['About', '/about'],
    ['Projects', '/projects'],
    ['People', '/people'],
    ['Join', '/join'],
    ['Contact', '/contact'],
    ['LARPoration', '/'],
  ]) {
    await page
      .getByRole('navigation')
      .getByRole('link', { name: label, exact: true })
      .click()
    await expect(page).toHaveURL(new RegExp(`${route}$`))
    await expect(
      page.getByRole('main').getByRole('heading').first(),
    ).toBeVisible()
  }
})

test('unknown routes return a real 404', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { name: '404', exact: true }),
  ).toBeVisible()
})

for (const width of [320, 768, 1440]) {
  test(`shell navigation, assets and layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/about')
    await expect(page).toHaveTitle('About | LARPoration')
    await expect(
      page
        .getByRole('navigation')
        .getByRole('link', { name: 'About', exact: true }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('contentinfo')).toHaveCount(1)
    const socials = page.getByRole('list', { name: 'Social media' })
    await expect(socials.getByRole('link')).toHaveCount(4)
    await expect(socials.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/LARPoration',
    )
    await expect(
      socials.getByRole('link', { name: 'Instagram' }),
    ).toHaveAttribute('href', 'https://www.instagram.com/larporation/')
    await expect(socials.getByRole('link', { name: 'TikTok' })).toHaveAttribute(
      'href',
      'https://www.tiktok.com/@larporation',
    )
    await expect(
      socials.getByRole('link', { name: 'LinkedIn' }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/company/larporation')
    await expect
      .poll(() =>
        page
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          ),
      )
      .toBe(true)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await page.keyboard.press('Tab')
    await expect(
      page.getByRole('link', { name: 'Skip to content' }),
    ).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('main')).toBeFocused()
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Contact', exact: true })
      .click()
    await expect(page).toHaveTitle('Contact | LARPoration')
    await expect(
      page
        .getByRole('main')
        .getByRole('link', { name: 'founder.larporation@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:founder.larporation@gmail.com')
    await page.screenshot({
      path: `test-results/shell-${width}.png`,
      fullPage: true,
    })
  })
}
test('core shell remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:3100/')
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Projects', exact: true })
    .click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole('main')).toBeVisible()
  await context.close()
})
