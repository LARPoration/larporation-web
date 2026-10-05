import { expect, test } from '@playwright/test'
const routes = ['/', '/about', '/projects', '/people', '/join', '/contact']
test('release pages contain complete public copy and working internal destinations', async ({
  page,
}, testInfo) => {
  const links = new Set<string>()
  for (const path of routes) {
    await page.goto(path)
    await expect(
      page.getByRole('main').getByRole('heading', { level: 1 }),
    ).toHaveCount(1)
    const body = await page.locator('body').innerText()
    expect(body).not.toMatch(
      /replace this|before launch|link pending|founding cast loading|AI slop|TODO|FIXME|find us here soon/i,
    )
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href')!),
      )) {
      expect(href.trim()).not.toBe('')
      expect(href).not.toBe('#')
      if (href.startsWith('/') && !href.startsWith('//')) links.add(href)
    }
    await page.screenshot({
      path: testInfo.outputPath(
        `${path === '/' ? 'home' : path.slice(1)}-desktop.png`,
      ),
      fullPage: true,
    })
  }
  for (const href of links)
    expect((await page.request.get(href)).status(), href).toBe(200)
  await page.goto('/join')
  await expect(
    page.getByRole('link', { name: 'Introduce yourself by email' }),
  ).toHaveAttribute('href', /^mailto:founder\.larporation@gmail\.com\?subject=/)
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of routes) {
    await page.goto(path)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath(
        `${path === '/' ? 'home' : path.slice(1)}-mobile.png`,
      ),
      fullPage: true,
    })
  }
})
