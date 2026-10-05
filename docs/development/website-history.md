# Integrated website timeline

Time Travel is part of the current website. The persistent slider changes registered regions in place; navigation, the cursor and the inspector remain mounted. There are no historical-site iframes, R2 buckets, archive Workers or separate playback deployments. Git manages source version control. Runtime history is explicit data and React revisions shipped with this application, not a Git checkout in the visitor's browser.

## Modules and contracts

| Module                               | Responsibility                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `features/history/HistoryViewer.tsx` | Load and validate the timeline; keep selection across navigation; slider, URL, popup and credits panel |
| `TimelineContext.tsx`                | Shared fractional position and selected release                                                        |
| `TimelineRegion.tsx`                 | Render adjacent content states in the same region; route birth/removal placeholder                     |
| `lib/history/contracts.ts`           | Schema 2 validation, dates, local routes and bounded interpolation                                     |
| `public/history/timeline.json`       | Chronological earlier releases, region states, route inventories and historical credits                |
| `content/history/`                   | Allowlisted local React revisions for rich content                                                     |
| `scripts/validate-history.ts`        | Validate the production manifest before builds                                                         |

Each entry contains a unique `id`, `label`, UTC `publishedAt`, `summary`, `routes`, `regions` and `credits`. Dates must be strictly increasing. The current working website is the final position, outside the earlier-release list. Empty entries mean the first chapter: no invented history or demo releases.

A region state is one of:

- `{ "kind": "text", "text": "Earlier wording" }`: plain text, never HTML.
- `{ "kind": "revision", "revision": "a-stable-local-id" }`: a registered React component for rich markup, assets and interactions.
- `{ "kind": "hidden" }`: absent in that version. A missing region ID also means absent, never a fallback to today's content.

## Registering content

Use `TimelineRegion` at meaningful boundaries, with a permanent region ID and current children. Its `as` prop keeps the appropriate semantic element and existing CSS/attribution props. The homepage has separate hero, strip, pitch, FAQ and challenge regions. `ContentPage` registers its eyebrow, title and body using the page contribution ID. Break a body into smaller stable regions when a change needs independent animation; avoid wrapping the entire application. Shared navigation remains available even when the selected page did not exist.

Earlier rich revisions live in local React components under `content/history`. Register each key in `revision-ids.ts` and `revisions.tsx`. Keep old text, asset paths and contributor references in those revisions. Do not import mutable current editorial data into an earlier revision. Keep a route module reachable for a removed page if its history must remain accessible. A manifest cannot create a Next route by itself.

## Recording a release change

1. Before changing released content, record its real publication date and route inventory. Retain its affected React content as local revisions; plain text regions can use text states. Include every region intended to appear in that release. Missing regions are deliberately hidden.
2. Add the earlier release entry to `timeline.json`. Store the authors, approval and genuine evidence for that version in `credits`; use the existing contribution IDs. A historical credit missing from that entry stays unrecorded rather than borrowing today's authors.
3. Update current content and its attribution. Keep stable region IDs. New regions have no earlier state and therefore vanish on rewind. For rich revisions containing nested regions, include the nested IDs too.
4. Run `npm run check`, then the Pages build and browser suite. Add fixtures covering both sides of the change, navigation and right-click attribution.

This is an explicit editorial release record, not automatic reconstruction of arbitrary commits. Git rollback and the public timeline have different jobs. Only genuine earlier releases belong in the production manifest; fixtures live in browser tests.

## Interaction and compatibility

Dragging interpolates opacity and vertical movement immediately between neighbouring states, without page replacement or delayed network swaps. Only the nearest version is interactive and exposed to assistive technology. Releasing the pointer snaps to a release. Arrow keys, Page Up/Down and Home/End move between releases. Reduced motion removes movement and popup animations. Region content occupies the larger adjacent layout during a blend and settles at the endpoint.

The nearest version's summary appears in a dismissible popup. A missing page displays its first recorded appearance date; when no actual publication date is available the interface says so. Later removal is distinguished from a page not yet introduced. `?release=<id>` restores a selection on refresh; navigation preserves it and Back to now clears it. Invalid selections use the current site. Failed or incompatible manifests disable time travel while the current site stays usable.

Schema changes require an explicit migration and regression fixtures. Existing rich revisions run in the current React runtime, so framework upgrades must test them; this architecture does not promise a byte-identical copy of an old browser environment. Keep revision IDs, assets and data for every visible release. No extra runtime dependency was added.
