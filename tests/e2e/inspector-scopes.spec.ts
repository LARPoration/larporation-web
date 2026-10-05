import { expect, test } from '@playwright/test'

test('elements inherit recorded authorship while all three highlight scopes stay explicit', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('link', { name: "See what we're building" })
    .click({ button: 'right' })
  const card = page.getByRole('dialog')
  await expect(card).toContainText('Founder with Codex')
  await expect(card).toContainText('Approved by Founder.')
  await expect(card).toContainText('Homepage introduction')
  await expect(page.locator('[data-credit-highlight]')).toHaveAttribute(
    'data-shape',
    'element',
  )
  await expect(page.locator('[data-credit-highlight] svg')).toBeVisible()
  await expect(page.locator('[data-credit-highlight] svg')).toHaveAttribute(
    'shape-rendering',
    'crispEdges',
  )
  await page.screenshot({ path: 'test-results/inspector-pixel.png' })
  await card.getByRole('button', { name: 'Section', exact: true }).click()
  await expect(card).toContainText('Homepage introduction')
  await expect(page.locator('[data-credit-highlight]')).toHaveAttribute(
    'data-shape',
    'section',
  )
  await expect(page.locator('[data-credit-highlight]')).toHaveCSS(
    'transform',
    'none',
  )
  await card.getByRole('button', { name: 'Page', exact: true }).click()
  await expect(card).toContainText('Page-level credits')
  await expect(card).toContainText('Home page')
  await expect(page.locator('[data-credit-highlight]')).toHaveAttribute(
    'data-shape',
    'page',
  )
  await page.screenshot({ path: 'test-results/inspector-page.png' })
  await card.getByRole('button', { name: 'Element', exact: true }).click()
  await expect(card).toContainText('Homepage introduction')
})
test('hover previews do not open cards, locked selection stays stable, and Escape exits predictably', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Inspect contributions: off' })
    .first()
    .click()
  const join = page.getByRole('link', { name: 'Join the LARPoration' })
  await join.hover()
  await expect(page.locator('[data-credit-highlight]')).toHaveAttribute(
    'data-preview',
    'true',
  )
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await join.click()
  await expect(page.locator('[data-credit-highlight]')).toHaveAttribute(
    'data-preview',
    'false',
  )
  await page.getByRole('heading', { level: 1 }).hover()
  await expect(page.getByRole('dialog')).toContainText('Shared action control')
  await page.getByRole('heading', { level: 1 }).click()
  await expect(page.getByRole('dialog')).toContainText('Homepage introduction')
  await expect(page).toHaveURL(/\/$/)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('button', { name: 'Inspect contributions: off' }).first(),
  ).toBeVisible()
})
test('section highlights follow scroll and hide offscreen; scope switches keep focus', async ({
  page,
}) => {
  await page.goto('/')
  await page.locator('h1').click({ button: 'right' })
  const section = page
    .getByRole('dialog')
    .getByRole('button', { name: 'Section', exact: true })
  await section.click()
  await expect(section).toBeFocused()
  await page.screenshot({ path: 'test-results/inspector-section.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.locator('[data-credit-highlight]')).toBeHidden()
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.locator('[data-credit-highlight]')).toBeVisible()
})
test('phone cards dock at bottom and unavailable scopes are disabled', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Page credits' }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Whole page', exact: true })
    .click()
  const card = page.getByRole('dialog')
  await expect(
    card.getByRole('button', { name: 'Element', exact: true }),
  ).toBeDisabled()
  await expect(
    card.getByRole('button', { name: 'Section', exact: true }),
  ).toBeDisabled()
  await expect
    .poll(async () => {
      const rect = await card.boundingBox()
      const bar = await page
        .getByRole('region', { name: 'Website history timeline' })
        .boundingBox()
      return Math.round(bar!.y - rect!.y - rect!.height)
    })
    .toBe(12)
  const bar = page.getByRole('region', { name: 'Website history timeline' })
  const barLayer = await bar.evaluate((node) =>
    Number(getComputedStyle(node).zIndex),
  )
  const outlineLayer = await page
    .locator('[data-credit-highlight]')
    .evaluate((node) => Number(getComputedStyle(node).zIndex))
  expect(barLayer).toBeGreaterThan(outlineLayer)
  expect(barLayer).toBeGreaterThan(
    await card.evaluate((node) => Number(getComputedStyle(node).zIndex)),
  )
  await page.screenshot({ path: 'test-results/inspector-mobile.png' })
})
