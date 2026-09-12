# Publiqué Style Guide

Status: **research/reference document, not yet applied**. Nothing in this
file has been implemented in the live app. It exists so the next redesign
phase has a single source of truth to work from, and so future changes can
be checked against a stated system instead of improvised per-page.

Brand spelling: **Publiqué** (with the accent). Not "Publique". The logo
lockup does not automatically carry "Guaymallén, Mendoza" — location is
product context (shown in the header/hero as a separate element), not part
of the primary brand mark.

---

## 1. Brand overview

Publiqué is a local discovery platform: it connects people in Guaymallén,
Mendoza with nearby businesses, professionals and services, starting from
a plain-language description of a need ("se me rompió la bomba de agua",
"necesito un electricista") rather than a category tree.

Target feeling: **a modern consumer technology brand for discovering your
neighborhood** — confident, contemporary, typography-led. Not a directory,
not a newspaper, not a municipal site, not a generic SaaS template.

## 2. Brand principles

1. **Search first.** The product exists because someone needs something
   *now*. Every homepage decision is subordinate to making search obvious
   and fast to use.
2. **Confidence over decoration.** Large, well-set type and color-blocked
   sections carry the brand. Borders, shadows, badges and pills are the
   exception, not the default.
3. **One brand color, used on purpose.** Pink is a signal, not a paint job.
   If everything is pink, nothing is.
4. **Discovery is calm; the profile is where action happens.** Homepage and
   search results help people scan and decide. WhatsApp/contact CTAs live
   on the business profile, not on every list item.
5. **Real when possible, graceful when not.** Real photography is used
   prominently. Missing photography gets an intentional, branded
   treatment — never a broken image or a generic gray box.

## 3. Phantom reference analysis

Phantom (mobbin.com, analyzed via the Mobbin MCP across ~30 distinct
section captures — header, hero, feature sections, large typographic
statements, footer, buttons) is the primary *visual-language* reference
for this redesign, not a template to clone.

**What Phantom actually does**, independent of what the brief assumed:

- Typography *is* the primary graphic device: very large, tight-leading,
  bold display type, occasionally with a small icon set inline inside a
  sentence ("make 👻 crypto accessible").
- Sections are full-bleed and separated by **background color changes**,
  never by borders, card outlines, or shadows.
- Buttons are **always fully rounded (pill)** — no other button radius
  appears anywhere in the captures reviewed.
- No card grids. Feature sections are one big idea each (large image +
  short copy, or type alone), not a repeated 3-up grid.
- Its own brand color is **violet/lavender**, not pink. There is no pink
  anywhere in the captures analyzed. (Publiqué's pink is a separate, prior
  brand decision — see §5 — carried into this system in the same *role*
  Phantom gives its violet: a deliberate, occasional brand color, not a
  wash over the whole UI.)
- The hero is centered (headline + subcopy + CTA stacked, text-align
  center) with no functional input — Phantom's marketing site has nothing
  resembling a search bar. This pattern does **not** transfer directly:
  Publiqué's hero must foreground a wide search control, which needs an
  asymmetric, left-anchored composition instead.
- Motion is not verifiable from static screenshots (Mobbin doesn't expose
  video/interaction capture for this site). §21 states Publiqué's own
  restrained motion principles rather than claiming to reproduce Phantom's.

**Adapted, not copied**: the mascot, the exact violet hex values, the
centered button-only hero, and the crypto-coded illustration language
(coins, holographic cards, gems) are Phantom-specific and do not carry
over. What carries over is the *system* — confident type, full-bleed
color-blocked sections, one restrained pill-button language, whitespace
doing the work borders usually do.

## 4. Typography

**Font family.** Phantom's exact typeface can't be confirmed from Mobbin
screenshots alone (no CSS/font metadata exposed, and it may be a licensed
family) — reported honestly rather than guessed. The closest
high-quality, freely-licensed, web-safe alternative that matches the
rounded-terminal geometric grotesque look observed is:

- **Primary: [Geist](https://vercel.com/font)** (Sans + Mono). Free,
  self-hostable via `next/font/local` or the `geist` npm package, no
  external request at runtime. Rounded-enough terminals to read as warm
  rather than clinical, while staying contemporary and highly legible at
  both display and UI sizes.
- **Fallback candidate: General Sans** (Fontshare, free) if Geist's
  metrics don't suit a specific display treatment later.

One family for both display and body/UI — weight and size create the
hierarchy, not a font pairing. This replaces both the earlier serif
(Fraunces) and the later Bricolage Grotesque / Apple-system-stack
experiments from prior iterations.

**Scale** (see §25 for exact tokens):

| Role | Size (desktop) | Weight | Leading | Tracking |
|---|---|---|---|---|
| display-xl (brand statements, "TU BARRIO EN UN SOLO LUGAR.") | 64–96px | 700 | 0.95–1.0 | -0.02em |
| display-lg (hero headline) | 44–56px | 700 | 1.05 | -0.02em |
| heading-lg (section titles) | 28–32px | 700 | 1.1 | -0.01em |
| heading-md | 20–22px | 600 | 1.2 | normal |
| heading-sm | 16–18px | 600 | 1.3 | normal |
| body-lg | 18px | 400 | 1.5 | normal |
| body | 15–16px | 400 | 1.5 | normal |
| small | 13–14px | 500 | 1.4 | normal |
| label (eyebrows, nav) | 12–13px | 600 | 1.2 | 0.06em, uppercase |

Body copy is intentionally set looser (1.5) than headlines (~1.0–1.1) —
the contrast between tight display type and relaxed reading copy is part
of what makes the headline read as *graphic* rather than just "big text."

**Behavior**: headlines are allowed to become a compositional element —
stacked across 2–3 short lines at display-xl size for the brand statement
("TU BARRIO / EN UN SOLO / LUGAR."), not just centered page furniture
under the logo. An inline icon/mark inside a sentence (Phantom's ghost
device) is an option worth prototyping for Publiqué's own brand statement
or hero, using a simple geometric mark, not a literal pin/map-pin clipart.

## 5. Color palette

**Status: corrected.** The vivid pink (`#FF2D78`, and an earlier
placeholder `#F45FA0` used briefly in implementation) documented in
previous revisions of this section is **deprecated** and no longer the
homepage brand color. It read as an arbitrary hot-pink wash rather than
anything derived from the stated visual reference. This section now
documents the corrected direction.

The palette is now derived directly from the Phantom reference (Mobbin,
§3) rather than kept as an independent prior decision: a pale
lavender/off-white canvas, a mid-saturation violet/purple used for
branded surfaces and CTAs, and a purple-tinted near-black for dark
sections — the same *rhythm* Phantom itself uses (light canvas → purple
brand surface → near-black → white), not "add a purple accent."

Values below are visual estimates read from Mobbin screenshots (no
CSS/design-token export is available for a third-party site), reported
as estimates rather than invented from memory.

| Token | Value (estimate) | Role |
|---|---|---|
| `--brand-primary` | `#8B7FF0` | Mid violet/purple. CTA emphasis on dark surfaces, active/selected state. Never a large background by itself. |
| `--brand-primary-soft` | `#F2EFFC` | Pale lavender canvas — an alternative to `--background` for a homepage section that wants Phantom's light-lavender feel. |
| `--brand-surface-strong` | `#C7BEF5` | Saturated lavender/purple, full-bleed brand-statement surface (replaces the old hot-pink section). Dark text on top, per Phantom's own light-purple CTA modules. |
| `--brand-dark` | `#15121B` | Purple-tinted near-black, for hero overlays/dark accents distinct from the site's neutral `--foreground`. |
| `--brand-black` | `#15121B` | Near-black, slightly warm (not pure `#000`). Primary UI controls, primary text. |
| `--background` | `#FAF8F6` | Default page background — warm off-white, not stark white. |
| `--surface` | `#FFFFFF` | Cards/panels that need to lift off the background (used sparingly — see §12, §15). |
| `--surface-muted` | `#F1EDEA` | Secondary neutral surface (subtle section alternation, form fields). |
| `--text-primary` | `--brand-black` | Body/heading text. |
| `--text-secondary` | `#6B6470` | Muted text — metadata, captions, secondary copy. |
| `--border-subtle` | `#E7E2DD` | The *only* border color in the system. Used for hairline separators, never as a card outline by default. |
| `--action-primary` | `--brand-black` | Default button background. |
| `--action-primary-foreground` | `#FFFFFF` | Text/icon on primary buttons. |
| `--action-hover` | `#2A2530` | Primary button hover (lightened black, not the brand accent — keeps the accent meaningful). |

**Usage rule** (reinforced by the Phantom finding that its own violet is
used generously but never as a UI-wide wash): the brand-surface-strong
purple appears in full-bleed brand sections (a "TU BARRIO EN UN SOLO
LUGAR" statement section, a featured/campaign section), `--brand-primary`
as an occasional CTA emphasis on dark surfaces, and as active/selected
state color. It does **not** become the color of every button, link, or
icon. Primary UI controls stay black-on-white/cream.

**Category icons**: monochrome, `--brand-black` (or `--text-secondary` at
rest, `--brand-black` on hover/active) on transparent or `--surface-muted`
background. No per-category pastel palette (this was tried in an earlier
iteration and explicitly rejected — see §24).

## 6. Logo usage principles

No new logo is designed in this phase — this section documents how the
*system* should treat whatever geometric-P mark is finalized.

- **Minimum size**: legible (icon recognizable, wordmark not clipping
  descenders) at 24px height in a browser tab (favicon) and at 32px in the
  header. If it fails at 16px favicon size, the mark is too complex.
- **Clear space**: a margin around the mark equal to the height of the "P"
  counter (its internal negative space) on all sides — nothing else
  (nav items, copy, other UI) enters that zone.
- **Color combinations**: black mark on pink, pink mark on black, black
  mark on white/cream. Never place the mark on a busy photograph without a
  solid-color safe area behind it.
- **Monochrome usage**: the icon must read correctly as a single flat
  color (for favicons, watermarks, print) — no gradients or multi-color
  dependencies in the mark itself.
- **Wordmark relationship**: icon + "Publiqué" wordmark side by side for
  the primary lockup (header, footer); icon alone for favicon, app icon,
  and any space under ~32px where the wordmark would be illegible.
- **Icon-only usage**: acceptable in the header on narrow mobile viewports
  if space is tight, but the wordmark is preferred whenever it fits — the
  brand is still being established, so favor recognition over minimalism
  for now.

## 7. Layout philosophy

Move away from `container → heading → 3 cards → heading → 3 cards → CTA`.
Concretely:

- Prefer **fewer, larger sections** over many small boxed ones. A section
  either makes one clear statement (large type, minimal chrome) or shows
  one coherent discovery surface (a business grid) — not both diluted
  together.
- Let **background color changes** — not borders — separate sections, the
  way Phantom does. A section can be `--background`, then the next
  `--brand-black` or `--brand-pink` full-bleed, then back.
- Cards are the exception, not the default (§15–17 define exactly where
  they're still appropriate — e.g. featured business photography needs an
  image frame — and where they're replaced by rows/typography instead).
- Fewer pills: reserve pill shape for buttons and true tags/status labels,
  not for every piece of metadata (a location doesn't need a pill just to
  sit next to a business name).

## 8. Container widths

| Token | Max-width | Use |
|---|---|---|
| `content` | 1440px | Homepage grid — nav (on the homepage), hero, discovery, category/business headings. Sitewide `.container` (search results, business profile body, admin) stays 1280px, unchanged — see note below. |
| `wide` | 1520px | Homepage sections that want slightly more breathing room at very large screens (business grid, zone grid, full-bleed brand/dark sections' inner content). |
| `full` | none (100vw) | Brand statement sections, hero background, full-bleed color-blocked sections. Inner content still respects `content`/`wide` via padding, but the background/color extends edge to edge. |

Gutter: `clamp(24px, 3vw, 48px)` — scales continuously with viewport
instead of jumping at breakpoints, so the same left/right axis holds at
1440px, 1600px and 1920px alike (matches the spacing scale in §10 at its
endpoints, not an arbitrary one-off value).

**Important**: `content`/`wide` above are the *homepage's own* grid,
applied only there (and to the header when the homepage is the active
route, so nav and hero share one axis). The sitewide `.container`
(1280px, used by search results, business profile, admin) is a separate,
narrower system and is intentionally not widened by this correction —
changing it is a larger decision than a homepage palette/grid pass.

This directly fixes a concrete, already-identified bug: the live site's
Tailwind `container` was only configured with a `2xl: 1280px` override,
which (because `theme.container` replaces rather than extends Tailwind's
default breakpoint scale) left it uncapped for every viewport below
1536px. The token table above is the corrected full scale to implement.

## 9. Grid system

- 12-column logical grid at `content`/`wide` widths, 24px gap, used for
  asymmetric splits (e.g. hero text column vs. search/visual column) —
  not for forcing everything into equal-width cards.
- Business discovery: 4 columns desktop, 2 tablet, 1–2 mobile (unchanged
  from the current implementation's intent — this part already tested
  well). Featured business breaks the grid (spans 2 columns or sits in its
  own full-width row) rather than being squeezed into the same cell size.
- Category row: a single row, not a grid — text/icon items in a flex row,
  horizontally scrollable on mobile rather than wrapping into a multi-row
  grid.

## 10. Spacing scale

Base unit 4px, exposed as a small named scale rather than arbitrary
values throughout components:

| Token | Value | Typical use |
|---|---|---|
| `xs` | 4px | Icon-to-label gaps, tight inline spacing |
| `sm` | 8px | Compact stacks (label above input) |
| `md` | 16px | Default gap between related elements |
| `lg` | 24px | Card/grid gaps, mobile page gutter |
| `xl` | 40px | Section-internal spacing (headline → body → CTA) |
| `2xl` | 64px | Space between distinct blocks within a section |
| `section-sm` | 64px | Vertical padding, compact sections |
| `section-md` | 96px | Vertical padding, standard sections (Phantom's rhythm is closer to this end) |
| `section-lg` | 140px | Vertical padding, hero / major brand statements |

Spacious, not empty: every section still uses `md`/`lg` internally so
related content reads as a group; the *large* numbers are reserved for the
gaps *between* sections, matching what the Phantom research showed
(generous outer rhythm, normal inner density).

## 11. Border radius scale

Phantom's own radius language is bimodal — full pill for every
interactive control, one large soft radius for the rare card-like
container (its footer email panel) — nothing in between. Publiqué adapts
that into three named steps so components elsewhere (inputs, images,
profile sections) have a defined vocabulary without every radius becoming
`rounded-2xl` by habit:

| Token | Value | Use |
|---|---|---|
| `small` | 8px | Inputs, small tags/badges, thumbnail crops in tight grids |
| `medium` | 16px | Image frames (business cover photos, gallery), larger panels |
| `large` | 28px | Rare "lifted" containers — e.g. a newsletter/contact panel like Phantom's footer |
| `pill` | 9999px | **Every button.** No other button radius exists in this system. |

## 12. Buttons

| Variant | Background | Text | Use |
|---|---|---|---|
| Primary | `--action-primary` (black) | white | Default action everywhere ("Buscar", "Ver negocio") |
| Secondary | transparent, 1px `--border-subtle` | `--text-primary` | Secondary action beside a primary one |
| Text/link | transparent | `--text-primary`, underline on hover | Tertiary navigation-style actions ("Ver todos →") |
| Icon | transparent or `--surface-muted` circle | `--text-primary` | Icon-only controls (search trigger, menu toggle) |
| Brand emphasis | `--brand-pink` | white | Rare — one clear brand-moment CTA per page at most (e.g. inside a pink full-bleed section) |
| WhatsApp action | `--action-primary` (black) + WhatsApp glyph | white | See recommendation below |

All buttons are **pill radius**, no shadows, no gradients. Height 44px
minimum (touch target), 36px only for dense inline contexts (never below
that).

**WhatsApp recommendation**: use the branded black/white primary button
with the WhatsApp icon, not WhatsApp's bright green. Green pulls focus
away from the pink/black system and reads as "borrowed brand" rather than
Publiqué's own. The icon alone communicates "this opens WhatsApp"; the
color doesn't need to. (This is a recommendation for the next phase — the
current live site still uses a green WhatsApp-branded button; changing it
is in scope for the redesign, not this document.)

## 13. Inputs / search

Phantom's marketing site has no search input to reference (confirmed via
Mobbin — not present in any captured section), so this is original
Publiqué design extrapolated from the system's button/pill language
rather than adapted from a Phantom pattern:

- Search field: `medium` radius (16px) — softer than a button's full pill
  (a full pill on a wide text input reads as a search *button*, not a
  field, at this width), `--surface` background, 1px `--border-subtle`,
  44–56px height on desktop hero, full-width on mobile.
- The submit action is a distinct primary (black pill) button attached to
  the field's end, not a bare icon — search is the product's core action
  and deserves an explicit, labeled control ("Buscar").
- Placeholder text uses a real example need ("Se me rompió la bomba de
  agua"), not a generic "Search...".
- Popular searches sit below as **plain text links with a subtle
  separator (middot or hairline)**, not a wall of colored chips — small,
  `--text-secondary`, hover to `--text-primary`. This directly satisfies
  the brief's "should NOT become a giant collection of colorful chips."

## 14. Category presentation

- Icon (monochrome, `--text-secondary` at rest / `--brand-black` active)
  + label underneath, no background tile, no border, no per-category
  color. Matches the system's "fewer UI decorations" principle and the
  brief's explicit rejection of rainbow pastel category cards.
- Laid out as a single row (horizontal scroll on mobile, no wrap into a
  multi-row grid) so it reads as lightweight navigation, not a feature
  grid.
- Category discovery is secondary to search: visually smaller than the
  hero, positioned after it, never competing with the search control for
  attention.

## 15. Business listing patterns

Discovery-only — no WhatsApp/call buttons on any homepage or search
result item (this rule already exists in the current build and stays).

Three densities, not one repeated card:

- **Featured** (§16): large, editorial, breaks the grid.
- **Standard**: image (`medium` radius) + name (heading-sm, bold) +
  category/location metadata line + one-line description. No border, no
  shadow, no badge chrome beyond a small typographic "Destacado" label
  when applicable (text, not a pill — already the current convention).
- **Compact**: for dense contexts (e.g. "related nearby businesses" on a
  profile) — small square thumbnail + name + location on one line, no
  description, row-based rather than grid-based.

## 16. Featured business pattern

One large featured item is allowed to visually dominate a section (large
image, larger type, short description) — this is where a Phantom-style
"one big idea" section applies directly to a business rather than a
brand statement. It should appear as a distinct block, not just the first
card in an otherwise-uniform grid at the same size as everything else.

## 17. Business profile / PDP pattern

High-intent destination — this is where actions belong.

- Primary action: **WhatsApp** (black/white branded button, see §12).
  No "Llamar" as a primary or secondary action — avoid unnecessary phone
  number exposure, consistent with the brief's anti-spam direction. If a
  phone number is shown at all, it's plain text, not a `tel:` action
  button.
- Directions/map: secondary action, not visually competing with WhatsApp.
- Layout: editorial, not a stack of bordered cards. A large cover
  image/gallery, then name + category + location as a typographic block
  (large heading, not inside a card), then description, services and
  hours as plain sectioned content separated by hairline rules
  (`--border-subtle`), not boxes. Related/nearby businesses as a compact
  row (§15) at the bottom.

## 18. Imagery

Real photography, used prominently, wherever a business has it. Aspect
ratios: 4:3 for standard listing images, wider (16:9 or a full-bleed
banner) for the profile cover, square for gallery thumbnails.

## 19. No-photo fallback system

Two explicit, deterministic modes — never a broken image, never a plain
gray box:

**PHOTO MODE**: real image, `object-fit: cover`, `medium` radius (small
for tight thumbnail grids).

**NO-PHOTO MODE**: a branded, category-aware fallback tile —
monochrome category icon, centered, on a flat neutral surface
(`--surface-muted`, not a rainbow tint per category — this was tried and
rejected, see §24). The tile is deterministic per category so it feels
intentional and consistent across the app, not randomly generated per
render. External placeholder URLs (Pexels, etc.) are additive later, once
verified reachable at build/runtime — never a silent dependency the UI
assumes will succeed.

## 20. Iconography

Monochrome, single stroke weight, geometric (matches the "simple,
recognizable at favicon size" logo direction in §6). Category icons pull
from the same visual family as any future custom iconography — no mixing
of icon styles (e.g. a filled icon set next to an outline one).

## 21. Motion

Not verifiable from Phantom's static Mobbin captures (§3), so this is
Publiqué's own restrained standard, consistent with what the product
already implements:

| Token | Duration | Use |
|---|---|---|
| `fast` | 150ms | Hover/press feedback, icon toggles |
| `standard` | 300ms | Reveal-on-scroll (fade + translateY), section transitions |
| `slow` | 500ms | Larger compositions entering view (hero-adjacent, featured business) |
| `easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | General-purpose ease-out |
| `easing-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Content entering the viewport — slightly more decisive settle |

Reveal pattern: opacity 0→1 + translateY(16–24px)→0, small stagger
(40–60ms) between list items, once per element, never replaying on
re-scroll. No parallax, no bouncing, no spinning, no scroll-jacking.
`prefers-reduced-motion` disables transforms and shows content
immediately — already implemented this way in the current `Reveal`
component and should carry forward unchanged.

## 22. Responsive behavior

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | Asymmetric split, search ~600–700px wide | Same composition, narrower columns | Stacked, search full-width, headline max 2 lines via responsive sizing (not forced `<br>`) |
| Typography | Full display scale | Step down one level | Step down two levels; never force a desktop line-break pattern |
| Category row | Single row, may fit fully | Single row, may need scroll | Horizontal scroll, no wrap-to-grid |
| Business listings | 4-column grid | 2-column grid | 1–2 column, compact density |
| Featured business | Large dominant block | Same, slightly reduced | Stacks to image-then-text, still visually distinct from standard cards |
| PDP | Two-column (content + sticky-ish aside) | Single column, aside moves below | Single column; sticky bottom WhatsApp bar |
| Navigation | Full inline nav + icon search | Full inline nav | Hamburger → full-screen menu (already implemented) |
| CTAs | Inline, generous spacing | Same | Full-width primary action where it's the main next step (search, WhatsApp) |

Mobile is not "the desktop layout, stacked" — density, line count, and
which actions are visible all change intentionally per the table above.

## 23. Accessibility

- WCAG AA contrast minimum for all text/background pairs in §5 (verify
  `--text-secondary` on `--background` and on `--surface-muted`
  specifically when implementing — muted-gray-on-off-white is the
  pairing most likely to need adjustment).
- Visible focus states on every interactive element (buttons, links,
  inputs, category items) — a visible outline or ring, not `outline: none`
  without a replacement.
- Full keyboard navigation: tab order follows visual order, mobile menu
  and any overlay traps focus while open and returns it on close.
- Semantic HTML: real `<button>`/`<a>`, real heading levels in document
  order, `<nav>`/`<main>`/`<footer>` landmarks (already the current
  convention — keep it).
- 44px minimum touch target for buttons/controls on touch viewports.
- `prefers-reduced-motion` respected everywhere motion is used (§21).

## 24. Do / Don't examples

| Do | Don't |
|---|---|
| Separate sections with a background color change | Separate every section with a border or a shadowed card |
| One pill radius for all buttons | Mixing `rounded-md`, `rounded-xl`, `rounded-full` buttons across the app |
| Monochrome category icons on a flat surface | A different pastel background color per category (tried before, rejected) |
| Pink in 1–2 deliberate full-bleed moments per page | Pink buttons, pink links, pink icons scattered throughout |
| A large featured business that visually breaks the grid | Every business squeezed into the same card size, "featured" signaled only by a badge |
| WhatsApp as the one clear PDP action | WhatsApp + Call + 3 other buttons competing on every listing |
| Plain text popular-search links | A dozen colorful rounded chips fighting the search bar for attention |
| Real photo, or a deterministic branded fallback tile | A broken image icon, a gray box, or a random stock photo pulled from an unverified URL |

## 25. Publiqué design tokens

```css
:root {
  /* Color -- corrected pass, derived from the Phantom reference. The
   * earlier --brand-pink (#ff2d78, and an even earlier #f45fa0) is
   * deprecated; do not reintroduce it on the homepage. */
  --brand-primary: #8b7ff0;
  --brand-primary-foreground: #ffffff;
  --brand-primary-soft: #f2effc;
  --brand-surface-strong: #c7bef5;
  --brand-dark: #15121b;
  --brand-black: #15121b;
  --background: #faf8f6;
  --surface: #ffffff;
  --surface-muted: #f1eeea;
  --text-primary: #15121b;
  --text-secondary: #6b6470;
  --border-subtle: #e7e2dd;
  --action-primary: #15121b;
  --action-primary-foreground: #ffffff;
  --action-hover: #2a2530;

  /* Typography */
  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
  --text-display-xl: 96px;
  --text-display-lg: 56px;
  --text-heading-lg: 32px;
  --text-heading-md: 22px;
  --text-heading-sm: 18px;
  --text-body-lg: 18px;
  --text-body: 16px;
  --text-small: 14px;
  --text-label: 13px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;
  --space-section-sm: 64px;
  --space-section-md: 96px;
  --space-section-lg: 140px;

  /* Radius */
  --radius-small: 8px;
  --radius-medium: 16px;
  --radius-large: 28px;
  --radius-pill: 9999px;

  /* Containers -- homepage grid (see §8 correction). Sitewide .container
   * (search, PDP, admin) stays 1280px, a separate system. */
  --container-content: 1440px;
  --container-wide: 1520px;

  /* Motion */
  --motion-fast: 150ms;
  --motion-standard: 300ms;
  --motion-slow: 500ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 26. Example Tailwind / CSS token mapping

The current codebase already uses HSL CSS variables consumed by
`tailwind.config.ts` (`hsl(var(--primary))` etc.) — this system maps onto
that same pattern rather than introducing a second convention:

```css
/* globals.css :root — HSL triplets for Tailwind's hsl(var(--x)) usage */
--background: 30 25% 97%;      /* #FAF8F6 */
--foreground: 262 13% 10%;     /* #15121B, "brand-black" */
--card: 0 0% 100%;             /* #FFFFFF, "surface" */
--muted: 30 12% 93%;           /* #F1EEEA, "surface-muted" */
--muted-foreground: 267 5% 43%;/* #6B6470, "text-secondary" */
--border: 30 15% 89%;          /* #E7E2DD, "border-subtle" */
--brand-primary: 245 80% 71%;       /* #8B7FF0 */
--brand-primary-foreground: 0 0% 100%;
--brand-primary-soft: 255 70% 97%;  /* #F2EFFC */
--brand-surface-strong: 250 73% 85%; /* #C7BEF5 */
--brand-dark: 262 13% 10%;          /* #15121B */
```

```ts
// tailwind.config.ts (theme.extend, additive to the existing token setup)
colors: {
  brand: {
    primary: "hsl(var(--brand-primary))",
    "primary-foreground": "hsl(var(--brand-primary-foreground))",
    "primary-soft": "hsl(var(--brand-primary-soft))",
    "surface-strong": "hsl(var(--brand-surface-strong))",
    dark: "hsl(var(--brand-dark))",
  },
  // background/foreground/card/muted/border already exist and keep their
  // current names — only their underlying values change per §25.
},
borderRadius: {
  sm: "8px",     // --radius-small
  DEFAULT: "16px", // --radius-medium
  lg: "28px",    // --radius-large
  full: "9999px", // --radius-pill (Tailwind's built-in rounded-full)
},
container: {
  center: true,
  padding: "24px",
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1280px", // capped at --container-content, see §8
  },
},
fontFamily: {
  sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
},
```

Button/pill radius is applied per-component (`rounded-full` on the
`Button` primitive), not via the global `borderRadius.DEFAULT`, since
buttons are the one place the pill radius is mandatory and everything
else uses `small`/`medium`/`large` contextually.

---

*This document is a research and planning artifact for the next redesign
phase. No pages, components, tokens, or dependencies in the live
application have been changed as part of producing it.*
