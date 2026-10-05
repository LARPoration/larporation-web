# ADR-001: Founder website architecture

- Date: 2026-10-02
- Status: Current architecture documented; the original proposal did not record a formal review outcome.

## Context and decision

The founder website uses Next.js App Router, React, TypeScript and plain CSS. Routes supply page content; shared components and root-mounted features provide navigation, cursor preferences, contribution inspection and history playback.

Configuration and content are separate from rendering. Assets are registered centrally with provenance, and contribution records use stable IDs. The site has no database, CMS, account system or application backend.

## Rationale

A small information site needs understandable module boundaries and a repeatable build. Shared features avoid per-page duplication; static content does not require a service layer. Complexity should solve an identified problem.

## Consequences

Contributors can change content without replacing shared interaction logic. Client-side state is limited to interactive features. Backend or authentication changes require an explicit architectural decision because they change the present deployment and data boundaries.

See the [code walkthrough](../code-walkthrough.md) for the implemented module map. This record describes the architecture; it does not schedule development work.
