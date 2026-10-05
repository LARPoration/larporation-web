# How the website works

This guide describes the v0.0.0 release candidate. Read it alongside the code for current module responsibilities and configuration.

## 1. Start with a page request

For `/projects`, Next renders `app/layout.tsx` around `app/projects/page.tsx`. The layout imports global styles and mounts the shared shell once. The route supplies the actual content. Most content is rendered on the server; interactive features declare `'use client'` and become active in the browser.

```text
app/layout.tsx
  HistoryViewer (persistent timeline and selection)
    InteractionLayer
      CursorProvider (persists preference)
        ContributionProvider (resets selection on route change)
          skip link + SiteHeader + InspectorBar
          TimelineRoute → app/*/page.tsx → TimelineRegion
          SiteFooter

```

The timeline remains outside the route-resetting contribution provider. Historical regions update inside the same application.

## 2. Content and routes

| Route/module                                  | Responsibility                             | Edit here for                                                       |
| --------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `app/page.tsx`                                | Approved construction-style homepage       | Hero and section layout                                             |
| `features/home/Pitch.tsx`                     | Corporate-jargon/plain-language toggle     | Toggle behaviour                                                    |
| `content/home.ts`                             | Pitch variants and FAQs                    | Editorial copy without interaction changes                          |
| `app/about/page.tsx`                          | Mission and principles                     | Organisation explanation                                            |
| `app/projects/page.tsx`, `content/roadmap.ts` | Data-driven roadmap                        | Work status and descriptions                                        |
| `app/people/page.tsx`                         | Participation and consented human profiles | People presentation; identities come from the credit registry       |
| `app/join/page.tsx`                           | Introduction guidance and email action     | How to get involved                                                 |
| `app/contact/page.tsx`                        | Single configured email                    | Contact presentation                                                |
| `app/history/page.tsx`                        | Compatibility redirect in live mode        | Former history-page URLs; static export retains a redirect fallback |
| `app/not-found.tsx`                           | Real 404                                   | Unknown-page experience                                             |

`ContentPage` supplies the consistent heading, main landmark, spacing and page-level contribution record for supporting pages. It accepts content as children, so individual pages do not duplicate shell logic. Homepage styling is intentionally separate. `legacy-pages.module.css` has been removed.

Roadmap statuses describe actual completed work and intended priorities, not promised dates. The website foundation is complete; this does not claim it has been publicly deployed. Release documentation records deployment separately.

## 3. Configuration and assets

`config/site.ts` is the source for the contact email, public version and site identity. Keep its version aligned with `package.json` and the root lockfile version during a release. `config/navigation.ts` controls the header links. `config/social.ts` holds nullable destinations: absent destinations render nothing. Do not link to a platform's generic homepage or invent an organisation account.

`config/assets.ts` maps stable asset IDs to local files, dimensions and provenance. `AssetImage` accepts an ID, supplies the canonical path, and attaches its contribution reference. Logo and cursor artwork are project assets; social icons come from the pinned Bootstrap Icons source with its MIT notice in `public/licenses/`. See [assets.md](assets.md).

`public/` is publicly served. Do not place source snapshots, reports, credentials or private documents there.

## 4. Shared links, buttons and styling

Use `SiteLink` for internal navigation. It uses Next's router. `ActionLink` adds shared button-like styling and independent implementation/content attribution. `Button` is for actions, never navigation. Do not recreate these primitives in page files.

`styles/tokens.css` defines palette, spacing, fonts, focus treatment and content width. `app/globals.css` provides resets and main/skip-link behaviour. Component styles use CSS Modules. Change a token for a site-wide adjustment; change a module for a feature-specific adjustment. System fonts require no third-party font requests.

Text selection uses the shared orange background and paper-colour text tokens. Global CSS disables selection for buttons, navigation links, disclosure controls, decorative images and elements marked `data-ui-control`. Shared branding, social links and `ActionLink` apply that marker; do not apply it to content containers. `AssetImage` disables native image dragging. Paragraphs, headings, email links, contribution details and editable fields remain selectable. These styles do not intercept clicks, keyboard focus or contributor inspection. Forced-colour mode retains system selection colours.

Overlay ordering is also centralised in the tokens: credit outlines (40), credit cards (50), timeline (60), and timeline panels (61). The inspector subtracts the shell's measured `--timeline-height` when positioning cards so their controls remain above the bar. Do not introduce independent feature z-index values that break this ordering.

The [Cloudflare Pages guide](development/cloudflare-pages.md) covers the separate live static build, hosting rules, metadata and exported-site tests. The static export includes the same integrated timeline.

## 5. Pixel cursor

`CursorProvider` applies the local SVG cursor only to suitable fine pointers with hover. Text entry and disabled controls retain native semantics. There is no mouse-following animation loop. The footer toggle uses `features/cursor/preference.ts` and local-storage key `larporation:theme-cursor:v1`; blocked storage falls back to a session preference. It is outside the route-resetting provider, so navigation does not lose the preference.

If changing the preference format, keep a compatible reader or introduce a new versioned key. Do not make the cursor essential to understanding or using the site.

## 6. Contribution inspection

`content/contributions.ts` has two related registries: public contributor identities, and stable contribution records. A record stores its label, status, role assignments and evidence links. A page or control gets `data-contribution-id` through the typed `attribution()` helper. Content can have a separate `contentContributionId` from the reusable control's implementation.

The browser flow is:

1. `ContributionProvider` handles right-click, Shift+F10, inspection mode and touch selection.
2. `resolve.ts` keeps the selected element's geometry and finds its nearest recorded ancestor when it has no explicit ID. Inherited attribution is labelled in the card. The provider's `site.foundation` record covers surrounding founder-edition elements. Explicit element records override inherited records; invalid explicit IDs remain visible as errors rather than being disguised.
3. `CreditRecord` reads the registry and renders author roles, the named approver, review status and evidence. `reviewedBy` references a validated contributor ID; historical selection instead reads that release’s explicit credits.
4. `Highlight` and `pixel-outline.ts` draw the appropriate independent outline: stepped oval, relaxed rounded section boundary or viewport frame. Observers keep geometry aligned without changing document layout.
5. Escape and route changes clean up selection, listeners and focus. Shift+right-click and editable fields preserve native behaviour.

Opening a credit card by right-click or keyboard does not enable selection mode. A normal click outside the card dismisses it and still activates the clicked link or button. Only the explicit inspection-mode toggle enables click/tap selection; card controls remain usable in either mode.

The founder edition is credited to “Founder with Codex” and approved by “Founder”. This approval covers the current work: new or replaced work must update its own record and review status rather than inherit an old approval indefinitely. Human names, profiles and evidence must be supplied with consent. Unknown explicit IDs remain unknown; do not manufacture evidence links or approval identities.

To credit a new button, add a stable record, then use `<ActionLink href="/join" contentContributionId="your.record">…</ActionLink>`. TypeScript requires the ID to exist in the registry. Keep old IDs stable when renaming visible labels. Keep earlier author records in the corresponding timeline entry.

## 7. Integrated time travel

`HistoryViewer` loads the same-site manifest and drives fractional selection. `TimelineRegion` blends local content states in place; `TimelineRoute` handles unavailable pages. Navigation, cursor and inspector remain in the shared shell. Earlier credits are selected by release. The bar is intentionally disabled while no genuine earlier releases exist.

The [timeline guide](development/website-history.md) explains region registration, release records, URL behaviour, compatibility and tests. Git manages source rollback; no separate archive infrastructure is required.

## 8. Common maintenance tasks

**Add a page:** create its route and metadata; add a `page.*` contribution record; use `ContentPage`; add navigation if appropriate; test direct visit, refresh, small-screen layout and inspection. Record its real appearance in the release route inventory. ContentPage supplies timeline boundaries; see the history guide before modifying already-released content.

**Change a shared feature:** keep it under its feature folder, preserve its root mounting boundary, and run the relevant browser tests plus the full gate before release. Check touch, keyboard, route transitions and reduced motion where applicable.

**Update dependencies:** use the pinned runtime, update deliberately through npm, review the real lockfile diff, and run `npm run check`. Test the Pages export and earlier local timeline revisions when changing Next, React or routing. Do not run `npm audit fix --force`; it may propose incompatible framework tooling downgrades.

**Rollback:** select the reviewed Git revision, install its locked dependencies, validate it and rebuild through the normal deployment procedure. Source rollback does not happen automatically when visitors use the timeline.

## 10. What v0.0.0 does not implement

There is no authentication, database, application submission API, CMS or analytics. Emails go through the visitor's mail client, not a server-side form. There are no invented team profiles or social accounts. Archive hosting, independent backup, automated promotion and second-maintainer recovery drills are not complete. Those are explicit release/deployment gates, not hidden assumptions about how the current code works.
