# Cloudflare Pages deployment

The live site uses a Next.js static export for Cloudflare Pages. The canonical origin is `https://larporation.com`, configured in `config/site.ts`. This guide describes the implemented build; it does not claim that a domain, Pages project or public release has been activated.

## Build modes

| Command               | Output and purpose                                                     |
| --------------------- | ---------------------------------------------------------------------- |
| `npm run build`       | Normal Next build, served by `npm start`                               |
| `npm run build:pages` | Live static site in `out/`, with timeline, Pages redirects and headers |

`scripts/pages/build.ts` sets the build mode for its subprocess, validates the output boundary and copies `config/pages/_headers` and `_redirects` into `out/`. These hosting rules are kept outside publicly served application assets. `/history` and `/history/` redirect home; `/history/timeline.json` remains available and require cache revalidation.

Normal and static builds share `.next`; the static export uses `out/`. Do not run builds concurrently. Rebuild the desired mode before serving or deploying. `build:pages` refuses output containing source or private configuration files. Upload only a successfully completed live export, never the repository root or private source material.

## Local validation

Use the Node version in `.node-version`, run `npm ci`, and install Chromium with `npx playwright install chromium`.

```sh
npm run check
npm run build:pages
npm run test:pages
```

The Pages suite runs the existing browser tests plus deployment-specific checks against exported files on port 3100. Its loopback server approximates extensionless static routing and the declared legacy redirects; it is not a Cloudflare emulator and does not verify edge headers, DNS or TLS. Run `node scripts/pages/serve.ts 3100` for manual local inspection. Rebuild with `npm run build` before using `npm start` afterward.

CI checks both normal Next behaviour and the live static export in separate jobs. CI does not publish anything.

## Cloudflare dashboard settings

Create a **Pages** project with Git integration, not a Worker project.

| Field                     | Value                               |
| ------------------------- | ----------------------------------- |
| Repository                | `LARPoration/larporation-web`       |
| Production branch         | `main`                              |
| Framework preset          | Next.js (Static HTML Export)        |
| Root directory            | Repository root                     |
| Output directory          | `out`                               |
| Build command             | `npm ci && npm run build:pages`     |
| `NODE_VERSION`            | `24.21.0`, matching `.node-version` |
| `SKIP_DEPENDENCY_INSTALL` | `1`                                 |
| `NEXT_TELEMETRY_DISABLED` | `1`                                 |

Apply the same build variables to production and previews. Node/npm engines are enforced; verify the build log uses the package's required npm version rather than bypassing engine checks. The Pages build supplies its own build mode. No application secrets are required.

The first successful deployment exposes a URL. Configure production branch deployment controls deliberately; a successful Cloudflare build is not proof that GitHub's browser checks passed. Require CI review before merging. Preview builds must not be registered as production history.

## Deployment boundaries

The build supplies static files and path redirects. DNS, TLS, domain redirects and preview access controls are configured outside the application. Local tests do not verify those services. Release approvals, domain cutover and backup/rollback procedures are maintained in the organisation's private operational documentation.

## References

- [Cloudflare static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Build environment](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
