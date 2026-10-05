# Asset register

All assets are local SVG source files, referenced through `config/assets.ts`. Do not paste SVG data URLs into components. Colours and spacing live in `styles/tokens.css`; the canonical logo SVG owns its brand colours. System fonts need no hosted font files.

## Cornerstone

`public/brand/cornerstone.svg` reconstructs the approved final prototype's solid L and detached orange square as a vector. Created for this project using Codex, 3 October 2026. No external stock art. Attribution is maintained in `content/contributions.ts`; only consented identities and verified evidence belong in that registry.

## Social icons

Instagram, TikTok, LinkedIn and GitHub SVGs are vendored unchanged from [Bootstrap Icons v1.13.1](https://github.com/twbs/icons/tree/v1.13.1/icons), retrieved 4 October 2026. Individual source files are `icons/instagram.svg`, `icons/tiktok.svg`, `icons/linkedin.svg` and `icons/github.svg` at that pinned tag. These replace prototype files whose provenance was not documented. The [upstream MIT licence](https://github.com/twbs/icons/blob/v1.13.1/LICENSE) is preserved in `public/licenses/bootstrap-icons.txt` and ships in all builds. No icon package or remote CDN is needed at runtime. Brand trademarks remain with their respective owners; integration credit is separate from icon artwork.

Reviewed files contain only an SVG root and static path geometry; no scripts, event handlers, external resources or embedded HTML. The validator restricts the SVG vocabulary as well as checking paths and registry references.

## Pixel cursor

`public/cursors/pixel-arrow.svg` is original project artwork using the approved pixel direction and construction palette, created with Codex on 3 October 2026. The shared cursor feature applies it with a (1, 1) hotspot. `pixel-pointer.svg` adds original matching pointer artwork with a (9, 1) hotspot. Both use native CSS cursors with system fallbacks, fine-pointer scoping and an off switch. No Minecraft artwork is used.

## Editing

Edit the asset in place to preserve its stable ID, then run `npm run validate:resources`. Add new files and their manifest entry together. Set social URLs only in `config/social.ts`; null hides the unavailable destination, with no placeholder icon. Public contact and version configuration is in `config/site.ts`. Add only consented public identities and real evidence to `content/contributions.ts`. Shared primitives accept separate implementation and content contribution IDs. Unrecorded entries must never imply a known author.
