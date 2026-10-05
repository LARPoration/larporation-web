# LARPoration Web

The v0.0.0 founder edition of LARPoration's public website. Six public pages explain the organisation, roadmap and how to get involved. Shared contribution inspection makes authorship visible; a persistent timeline rewinds registered content within the same site.

**Status:** release candidate prepared locally, not published. Start with the [code walkthrough](docs/code-walkthrough.md) and [v0.0.0 release notes](docs/releases/v0.0.0.md).

## Run locally

Use Node **24.21.0** and npm **11.19.0**, pinned in `.node-version` and `package.json`.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment file is required. On Windows, use `npm.cmd` if PowerShell blocks npm's script shim. `.npmrc` enforces supported engines; do not bypass it.

## Verify a change

```sh
npx playwright install chromium
npm run check
```

`check` runs formatting, lint, TypeScript, resource/history unit tests, production build and Chromium browser tests. CI installs browser OS dependencies with `npx playwright install --with-deps chromium`. Standalone `npm test` requires a fresh `npm run build` and free port 3100. Reports and traces stay in ignored `test-results/` and `playwright-report/`. Chromium coverage is not a claim of a full browser/accessibility audit.

| Command                                                   | Purpose                                            |
| --------------------------------------------------------- | -------------------------------------------------- |
| `npm run dev`                                             | Local development with refresh                     |
| `npm run build` / `npm start`                             | Normal production build / local production server  |
| `npm run format`                                          | Apply formatting                                   |
| `npm run lint` / `npm run typecheck`                      | Static checks                                      |
| `npm run validate:resources` / `npm run validate:history` | Validate asset, attribution and timeline contracts |
| `npm run test:resources` / `npm run test:history`         | Unit checks for contract failures                  |
| `npm test`                                                | Browser regression suite                           |
| `npm run check`                                           | Full local quality gate                            |

## Where to change things

| Area                                       | Source                                                             |
| ------------------------------------------ | ------------------------------------------------------------------ |
| Email, public version and site identity    | `config/site.ts`                                                   |
| Navigation and social destinations         | `config/navigation.ts`, `config/social.ts`                         |
| Pitch, FAQs and roadmap                    | `content/home.ts`, `content/roadmap.ts`                            |
| Contributor identities, roles and evidence | `content/contributions.ts`                                         |
| Page content                               | `app/*/page.tsx`                                                   |
| Shared page, header and footer structure   | `components/layout/`                                               |
| Links, buttons and image wrappers          | `components/ui/`, `components/brand/`                              |
| Palette, spacing and typography            | `styles/tokens.css`                                                |
| Cursor, inspector and timeline             | `features/cursor/`, `features/contributions/`, `features/history/` |
| Canonical local assets and provenance      | `config/assets.ts`, `public/`, [asset register](docs/assets.md)    |

Null social destinations are hidden. Never add dummy links or invented profiles. There is no application backend, account system or analytics integration; Join and Contact open an email client. Cursor preference uses local storage. These boundaries must be reconsidered before adding forms or tracking.

## Cloudflare Pages

Run `npm run build:pages` for the live static export, then `npm run test:pages` to test it. Dashboard settings and build-mode boundaries are in the [Pages deployment guide](docs/development/cloudflare-pages.md). The target domain is `larporation.com`; no deployment is performed by these scripts.

## Architecture and time travel

Next App Router owns routes and server-rendered content. Small client components own interactions. Shared features mount in the root layout, not individual pages. Internal links go through `SiteLink`, which uses Next's router. Exact dependency versions and the lockfile preserve compatibility.

The integrated timeline reads a validated, initially empty release manifest. Regions blend in place while navigation and shared interactions stay mounted. Earlier content and credits live in this repository; Git manages source rollback. No separate archive hosting is required. See the [history guide](docs/development/website-history.md) for stable region IDs, local revisions and recording a genuine release.

## Documentation and contribution

- [Code walkthrough](docs/code-walkthrough.md): module responsibilities, data flow and common changes.
- [Release notes](docs/releases/v0.0.0.md): features and current limitations.
- [History guide](docs/development/website-history.md): integrated transitions, versioned content and credits.
- [Contributing](CONTRIBUTING.md): review, testing and evidence requirements.
- [Architecture decisions](docs/adr/ADR-001-founder-website-architecture.md): why the structure exists.
- [Documentation index](docs/README.md): current guides and documentation policy.

Use `npm ci`, keep Next and its ESLint plugin aligned, and keep React/React DOM aligned. Do not force dependency fixes or silently change runtimes. See the release notes for the dated development-tool advisory assessment. No automated publishing workflow is configured.
