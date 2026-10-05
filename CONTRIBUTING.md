# Contributing to LARPoration Web

This repo is deliberately contributor-friendly. The goal is not only to ship a website, but to leave clear evidence of what changed, why it changed and who owned the work.

## Workflow

1. Start from a real task or problem.
2. Create or reference the relevant GitHub issue.
3. Branch from the agreed base using a descriptive name, e.g. `codex/web-002-homepage`.
4. Make a focused change.
5. Run the relevant checks locally.
6. Open a pull request with a descriptive title and link the relevant issue.
7. Complete the PR template with evidence, risk and rollback notes.
8. Address review comments before merge.

## Local validation

Use the runtime in `.node-version` and install with `npm ci`. Install the pinned browser with `npx playwright install chromium`, then run `npm run check` before presenting a change. See the README for individual checks and failure diagnostics.

Keep framework/tooling migrations separate from feature work. Include real lockfile changes with dependency updates, and never bypass engine or peer dependency requirements to make installation appear successful. Git normalises text files to LF for consistent Windows/Linux formatting checks.

Use the [code walkthrough](docs/code-walkthrough.md) for implementation guidance and the [documentation policy](docs/README.md#documentation-policy) when updating docs. Keep plans, agent task staging and development logs outside this repository. Record shipped behaviour and concise release notes here.

## Commit messages

Prefer small, descriptive commits.

Examples:

```text
WEB-002: add homepage hero
WEB-004: add founding role cards
WEB-009: publish privacy notice
```

## Pull requests

PRs should be small enough to review properly. If a change is too large to explain clearly, split it.

At minimum describe:

- problem being solved
- scope
- evidence/testing
- risks
- rollback
- documentation impact
- data/security impact

## Public-repo rule

Do not commit:

- secrets or credentials
- private applicant data
- internal access procedures
- private incident details
- organisation-wide confidential governance material

Use `.env.example` only for safe placeholder variable names.

## Architecture decisions

Material website architecture decisions should be documented in `docs/adr/` when they are useful and safe to publish.
