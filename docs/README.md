# Documentation

Repository documentation describes the current implementation, configuration, function behaviour, architecture decisions and release history. It is public maintainer documentation, not a development work log.

## Guides

- [Cloudflare Pages](development/cloudflare-pages.md): live static build, dashboard settings and deployment verification.
- [Code walkthrough](code-walkthrough.md): module responsibilities, data flow and common changes.
- [Website history](development/website-history.md): integrated regions, release records, transitions and compatibility.
- [Asset register](assets.md): canonical assets, provenance and licences.
- [Contributing](../CONTRIBUTING.md): review and validation workflow.
- [Release notes](releases/v0.0.0.md): v0.0.0 features and current limitations.

## Architecture decisions

- [ADR-001](adr/ADR-001-founder-website-architecture.md): founder architecture and its boundaries.
- [ADR-002](adr/ADR-002-runtime-and-quality-tooling.md): runtime, dependency compatibility and quality tooling.
- [ADR-003](adr/ADR-003-website-history-and-archives.md): integrated timeline, versioned content and historical attribution.

## Documentation policy

Update the relevant guide when behaviour or configuration changes. Keep release notes concise and distinguish unreleased candidates from published versions. Architecture records explain decisions and consequences; they are not task schedules.

Keep future development plans, agent instructions for staging jobs, session logs, raw validation reports, launch approval checklists and private operational records outside this repository. A folder named internal is not private in a public repository. Do not store credentials, private identities or applicant information here. Required third-party licence notices remain with their assets.
