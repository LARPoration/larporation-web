import { expect, test, type Page } from '@playwright/test'
// Fictional states are intercepted only in tests; never published as real history.
const entries = ['one', 'two'].map((name, index) => ({
  id: 'fixture-' + name,
  label: 'fixture-' + name,
  publishedAt: index ? '2026-10-04T00:00:00Z' : '2026-10-01T00:00:00Z',
  routes: index ? ['/', '/projects'] : ['/'],
  summary: index ? 'Projects arrives.' : 'The original introduction.',
  regions: {
    'home.hero': {
      kind: 'text',
      text: index ? 'A growing organisation.' : 'An earlier beginning.',
    },
    'page.projects.title': { kind: 'text', text: 'Our first projects' },
    'page.projects.body': { kind: 'text', text: 'The first project.' },
  },
  credits: [
    {
      id: 'home.hero',
      label: 'Original introduction',
      authors: ['Earlier contributor'],
      approvedBy: 'Founder',
      evidence: [],
    },
  ],
}))
async function fixtures(page: Page) {
  await page.route('**/history/timeline.json', (route) =>
    route.fulfill({ json: { schemaVersion: 2, entries } }),
  )
}
async function scrub(page: Page, position: string) {
  await page.getByRole('slider').fill(position)
}
test('timeline stays visible across real pages, scrolling and mobile', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await expect(
    page.getByRole('slider', { name: 'Website version' }),
  ).toBeDisabled()
  await expect(page.getByText('You’re at the first chapter')).toBeVisible()
  await expect(page.locator('iframe')).toHaveCount(0)
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .click()
  await expect(page).toHaveURL(/\/about$/)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.getByRole('slider')).toBeInViewport()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/projects')
  await expect(page.getByRole('slider')).toBeInViewport()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('timeline-mobile.png') })
  await page.goto('/history')
  await expect(page).toHaveURL(/\/$/)
})
test('drag updates regions in place, with historical credits and reversible interpolation', async ({
  page,
}, testInfo) => {
  await fixtures(page)
  await page.goto('/?release=fixture-one')
  const region = page.locator('[data-timeline-region="home.hero"]')
  await expect(region).toHaveText('An earlier beginning.')
  // Shared navigation remains the same DOM node while only the region changes.
  await page
    .getByRole('navigation')
    .evaluate((node) => node.setAttribute('data-persistent-test', 'yes'))
  await scrub(page, '0.25')
  await expect(region.getByText('An earlier beginning.')).toHaveCSS(
    'opacity',
    '0.75',
  )
  await expect(region.getByText('A growing organisation.')).toHaveCSS(
    'opacity',
    '0.25',
  )
  await expect(region.getByText('A growing organisation.')).toHaveAttribute(
    'inert',
    '',
  )
  await page.screenshot({ path: testInfo.outputPath('timeline-mid-drag.png') })
  const track = (await page.getByRole('slider').boundingBox())!
  await page.mouse.move(
    track.x + track.width * 0.125,
    track.y + track.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    track.x + track.width * 0.46,
    track.y + track.height / 2,
    { steps: 8 },
  )
  await page.mouse.up()
  await expect(page.getByRole('slider')).toHaveValue('1')
  await expect(region).toHaveText('A growing organisation.')
  await expect(
    page.getByRole('complementary', { name: 'Version update' }),
  ).toContainText('fixture-two arrives.')
  await expect(page.getByRole('navigation')).toHaveAttribute(
    'data-persistent-test',
    'yes',
  )
  await expect(page.locator('iframe')).toHaveCount(0)
  await region.click({ button: 'right' })
  await expect(
    page.getByText('Earlier contributor', { exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await scrub(page, '0.25')
  await expect(region.getByText('An earlier beginning.')).toHaveCSS(
    'opacity',
    '0.75',
  )
  await page.getByRole('button', { name: 'Back to now' }).click()
  await expect(page.locator('h1')).toContainText("We're LARPing")
  await expect(page).toHaveURL(/\/$/)
})
test('missing pages appear and vanish without replacing the shared site', async ({
  page,
}) => {
  await fixtures(page)
  await page.goto('/projects?release=fixture-one')
  await expect(
    page.getByRole('heading', { name: 'Shhhhh… this isn’t here yet.' }),
  ).toBeVisible()
  await expect(
    page.getByText('First appeared 4 October 2026.', { exact: false }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Skip to content' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#timeline-unavailable')).toBeFocused()
  await page.getByRole('slider').focus()
  await page.keyboard.press('ArrowRight')
  await expect(
    page.getByRole('heading', { name: 'Our first projects' }),
  ).toBeVisible()
  await page.keyboard.press('Home')
  await expect(
    page.getByRole('heading', { name: 'Shhhhh… this isn’t here yet.' }),
  ).toBeVisible()
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .click()
  await expect(page).toHaveURL(/\/about\?release=fixture-one$/)
  await expect(
    page.getByRole('heading', { name: 'Shhhhh… this isn’t here yet.' }),
  ).toBeVisible()
  await page.reload()
  await expect(page.getByRole('slider')).toHaveValue('0')
  await page.getByRole('slider').focus()
  await page.keyboard.press('End')
  await expect(page.locator('main')).toBeVisible()
  await expect(page).toHaveURL(/\/about$/)
})
test('reduced motion and failure retain a usable current website', async ({
  page,
}) => {
  await fixtures(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?release=fixture-one')
  await scrub(page, '0.5')
  const layers = page.locator(
    '[data-timeline-region="home.hero"] [aria-hidden]',
  )
  await expect(layers.first()).toHaveCSS('transform', 'none')
  await expect(
    page.getByRole('complementary', { name: 'Version update' }),
  ).toHaveCSS('animation-name', 'none')
  await page.route('**/history/timeline.json', (route) =>
    route.fulfill({ json: { schemaVersion: 999, entries } }),
  )
  await page.goto('/?release=missing')
  await expect(
    page.getByText('History unavailable', { exact: false }),
  ).toBeVisible()
  await expect(page.getByRole('slider')).toBeDisabled()
  await expect(page.locator('h1')).toContainText("We're LARPing")
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'About', exact: true })
    .click()
  await expect(page.locator('main')).toBeVisible()
})
