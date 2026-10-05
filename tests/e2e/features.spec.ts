import { expect, test } from '@playwright/test'

test('homepage matches approved sections and translates the pitch', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    "We're LARPinga company.Come make it real.",
  )
  await expect(
    page.getByText('Intern as a Service.', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Translate to human' }).click()
  await expect(
    page.getByRole('heading', { name: 'A company we build together.' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Translate to human' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Corporate jargon: ON' }).click()
  await expect(
    page.getByRole('heading', { name: 'Human-powered compute.' }),
  ).toBeVisible()
  await page
    .getByText('So what am I actually joining?', { exact: true })
    .click()
  await expect(
    page.getByText('A company being built by early-career people.', {
      exact: false,
    }),
  ).toBeVisible()
})
for (const route of ['/', '/about', '/contact']) {
  test(`shared logo and button inspection on ${route}`, async ({ page }) => {
    await page.goto(route)
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'LARPoration', exact: true })
      .locator('img')
      .click({ button: 'right' })
    await expect(page.getByRole('dialog')).toContainText('Cornerstone mark')
    await expect(page.getByRole('dialog')).toContainText(
      'Founder with Codex (human, code)',
    )
    await expect(page.locator('[data-credit-highlight]')).toBeVisible()
    await page.getByRole('dialog').getByText('Evidence & review').click()
    await expect(page.getByRole('dialog')).toContainText(
      'No verified evidence linked yet.',
    )
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(
      page
        .getByRole('navigation')
        .getByRole('link', { name: 'LARPoration', exact: true }),
    ).toBeFocused()
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Join', exact: true })
      .click({ button: 'right' })
    await expect(page.getByRole('dialog')).toContainText('Shared navigation')
    await page.keyboard.press('Escape')
  })
}
test('inspection mode prevents navigation and cleans up on route changes', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Inspect contributions: off' })
    .first()
    .click()
  await page.getByRole('link', { name: 'Join the LARPoration' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('dialog')).toContainText('Shared action control')
  await expect(page.getByRole('dialog')).toContainText('Homepage introduction')
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .focus()
  await page.keyboard.press('Shift+F10')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('[data-credit-highlight]')).toHaveCount(0)
})
test('right-click credits never capture normal button or navigation clicks', async ({
  page,
}) => {
  await page.goto('/')
  const about = page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
  await about.click({ button: 'right' })
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByText('Evidence & review').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Translate to human' }).click()
  await expect(
    page.getByRole('button', { name: 'Translate to human' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await about.click({ button: 'right' })
  await about.click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const contact = page
    .getByRole('navigation')
    .getByRole('link', { name: 'Contact', exact: true })
  await contact.focus()
  await page.keyboard.press('Shift+F10')
  await expect(page.getByRole('dialog')).toBeVisible()
  await contact.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/contact$/)
})

test('page credits expose sections and restore keyboard focus', async ({
  page,
}) => {
  await page.goto('/')
  const credits = page.getByRole('button', { name: 'Page credits' })
  await credits.click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Homepage introduction' })
    .click()
  await expect(page.getByRole('dialog')).toContainText(
    'Section or group attribution',
  )
  await page.keyboard.press('Escape')
  await expect(credits).toBeFocused()
})
test('unknown IDs, removed targets, native menu bypass and editable fields', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .locator('h1')
    .evaluate((element) =>
      element.setAttribute('data-contribution-id', 'missing.record'),
    )
  await page.locator('h1').click({ button: 'right' })
  await expect(page.getByRole('dialog')).toContainText('Unrecorded element')
  await page.locator('h1').evaluate((element) => element.remove())
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const result = await page.getByRole('navigation').evaluate((nav) => {
    const link = nav.querySelector('a')!
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
    })
    link.dispatchEvent(event)
    return event.defaultPrevented
  })
  expect(result).toBe(false)
  await page.getByRole('main').evaluate((main) => {
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Editable test')
    main.append(input)
  })
  const prevented = await page
    .getByRole('textbox', { name: 'Editable test' })
    .evaluate((input) => {
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
      })
      input.dispatchEvent(event)
      return event.defaultPrevented
    })
  expect(prevented).toBe(false)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
test('cursor preference persists and preserves native text cursors', async ({
  page,
}) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Theme cursor: on' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-theme-cursor]')).toHaveAttribute(
    'data-theme-cursor',
    'true',
  )
  expect(
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'About', exact: true })
      .evaluate((element) => getComputedStyle(element).cursor),
  ).toContain('pixel-pointer.svg')
  await page.getByRole('main').evaluate((main) => {
    const input = document.createElement('textarea')
    input.setAttribute('aria-label', 'Text cursor test')
    main.append(input)
  })
  expect(
    await page
      .getByRole('textbox', { name: 'Text cursor test' })
      .evaluate((element) => getComputedStyle(element).cursor),
  ).toBe('text')
  await toggle.click()
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .click()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Theme cursor: off' }),
  ).toHaveAttribute('aria-pressed', 'false')
})
test('blocked storage does not break cursor controls', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked')
      },
    })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Theme cursor: on' }).click()
  await expect(
    page.getByRole('button', { name: 'Theme cursor: off' }),
  ).toBeVisible()
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Theme cursor: off' }),
  ).toBeVisible()
})
for (const width of [390, 1100]) {
  test(`homepage and compact credits fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 })
    await page.goto('/')
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
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Join', exact: true })
      .click({ button: 'right' })
    const box = await page.getByRole('dialog').boundingBox()
    expect(box!.width).toBeLessThanOrEqual(280)
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    await page.screenshot({ path: `test-results/credits-${width}.png` })
    await page.setViewportSize({ width: 320, height: 400 })
    await expect
      .poll(async () => {
        const rect = await page.getByRole('dialog').boundingBox()
        return Boolean(
          rect &&
          rect.x >= 0 &&
          rect.y >= 0 &&
          rect.x + rect.width <= 320 &&
          rect.y + rect.height <= 400,
        )
      })
      .toBe(true)
  })
}
test('touch inspection selects without following links and keeps native cursor', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:3100/')
  await page
    .getByRole('button', { name: 'Inspect contributions: off' })
    .first()
    .tap()
  await page.getByRole('link', { name: 'Join the LARPoration' }).tap()
  await expect(page.getByRole('dialog')).toContainText('Shared action control')
  await expect(page).toHaveURL(/\/$/)
  expect(
    await page
      .locator('[data-theme-cursor]')
      .evaluate((element) => getComputedStyle(element).cursor),
  ).not.toContain('url(')
  await context.close()
})
