# ADR-003: Integrated website timeline

- Updated: 5 October 2026
- Status: Implemented; supersedes the separate archive playback design.

## Decision

Keep time travel inside the current website. One global provider and slider drive versioned regions, route availability and contributor credits. Earlier states are reviewed data and local React revisions in the same repository. Git supplies source rollback. Separate release packages, archive hosting, R2 and Workers are outside this feature and have been removed.

## Consequences

Navigation and interactions remain in the live shell while regions blend as the slider moves. Shared schema validation and stable region IDs separate release data from interaction code. Missing pages show their real first-appearance date when known. Historical attribution does not fall back to current authors.

Historical content must be recorded explicitly before a released region is replaced. Rich revisions share the current runtime; dependency upgrades need regression tests against them. This is an integrated view of earlier content, not an immutable reproduction of old deployment bytes. The production manifest remains empty until genuine earlier releases exist.

See the [timeline guide](../development/website-history.md) for the contract and maintenance procedure.
