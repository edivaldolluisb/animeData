---
name: Ani-Mangalist
description: Personal anime and manga tracking list — warm, curated, yours alone.
colors:
  tatami-gold: "#dcb67d"
  tatami-gold-muted: "#dbbf8d"
  shiso-green: "#34a44c"
  shiso-green-dark: "#287d3b"
  deep-lacquer: "#1c1208"
  aged-parchment: "#5c4e38"
  translucent-surface: "#ffffffeb"
typography:
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  nav-active:
    backgroundColor: "{colors.shiso-green}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "7px 20px"
  nav-inactive:
    backgroundColor: "{colors.translucent-surface}"
    textColor: "{colors.deep-lacquer}"
    rounded: "{rounded.sm}"
    padding: "7px 20px"
  nav-active-hover:
    backgroundColor: "{colors.shiso-green-dark}"
    textColor: "#ffffff"
  table-header:
    backgroundColor: "{colors.tatami-gold}"
    textColor: "{colors.deep-lacquer}"
    typography: "title"
    padding: "14px 16px"
  search-input:
    backgroundColor: "{colors.translucent-surface}"
    textColor: "{colors.deep-lacquer}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  pagination-active:
    backgroundColor: "{colors.shiso-green}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    size: "36px"
---

# Design System: Ani-Mangalist

## 1. Overview

**Creative North Star: "A Sala de Troféus"**

Every entry in this list is a trophy. The interface exists to honor that collection: warm, personal, yours alone. The amber tones evoke the worn spines of manga volumes stacked on a shelf, the green marks something alive and in progress. Behind it all, a dark background image bleeds through surfaces, grounding the UI in the world of anime it tracks.

The system is simultaneously dense and celebratory, precise and tactile. The table is the product; everything else exists to serve it. Surfaces are translucent to let the world beneath breathe. Color is structural, not decorative: amber identifies, green activates, dark lacquer anchors.

This is not a SaaS dashboard. It is not a media catalog with carousels and hero images. It is a handwritten list made legible by software.

**Key Characteristics:**
- Amber is structure, not accent; it appears in every header and even row
- Green is reserved for active states and actions only
- Translucent surfaces reveal the background without obscuring content
- One font family, four weights; hierarchy through weight contrast alone
- Every interaction confirms itself (scale, color shift, focus ring)

## 2. Colors: The Dojo Palette

Warm amber and bamboo green against a dark atmospheric backdrop. Two colors doing all the work.

### Primary
- **Tatami Gold** (#dcb67d): The dominant structural color. Table headers, stat bars, heading backgrounds. Present on 40-60% of the viewport at any time. Its warmth signals "content area."
- **Tatami Gold Muted** (#dbbf8d / rgba at 0.85 opacity): Alternating table rows. Lower presence version of the same hue, creating rhythm without introducing a new color.

### Secondary
- **Shiso Green** (#34a44c): Active navigation tab, pagination active state, focus rings. Used only where something is chosen, active, or interactive. Its rarity makes it unambiguous.
- **Shiso Green Dark** (#287d3b): Hover variant for green elements. Deepens on interaction.

### Neutral
- **Deep Lacquer** (#1c1208): Primary text. Warm-tinted near-black; never pure `#000`.
- **Aged Parchment** (#5c4e38): Muted text, italic alternates, secondary labels.
- **Translucent Surface** (rgba(255,255,255,0.92)): Card and table backgrounds. Allows the background image to bleed through at 8%.

### Named Rules
**The One-Green Rule.** Shiso Green appears only on active/selected states and focus rings. Never use it for decorative purposes. Its scarcity is what makes it mean "here."

**The Amber-as-Structure Rule.** Tatami Gold is not an accent. It is a structural color that occupies table headers, h1 wrappers, and stat bars. Do not reduce it to 10% presence; it belongs at 40-60%.

## 3. Typography

**Display / Body Font:** Poppins (sans-serif)
**Weights used:** 400 (body), 500 (labels), 600 (table headers, nav), 700 (headings)

**Character:** Geometric and neutral, Poppins earns its warmth through weight contrast rather than letterform quirk. At weight 200 it disappears; this system runs it from 400 upward, creating a four-step hierarchy with a single family.

### Hierarchy
- **Headline** (700, 1.375rem, line-height 1.3): Page titles. `h1` only. Appears once per page.
- **Title** (600, 0.9375rem, line-height 1.4): Table headers, section labels, nav active. The structural layer.
- **Body** (400, 1rem, line-height 1.6): Table rows, general prose. Max line length 65ch.
- **Label** (500, 0.875rem): Stats, counts, filter controls, pagination numbers. Tighter, supporting role.

### Named Rules
**The No-Thin Rule.** Weight 200 is prohibited. It was the original default and visually collapsed the hierarchy. Body runs at 400 minimum; nothing thinner exists in the system.

## 4. Elevation

This system is tonal-flat. Depth comes from translucency and color layering, not from shadows as ornament.

The dark background image is the base layer. Translucent white surfaces float above it. Table rows alternate between amber-muted and near-white. No element feels "lifted" in the Material sense; instead, each layer is distinguished by opacity and tint.

Shadows exist, but as structural separators, not decorative flourishes.

### Shadow Vocabulary
- **Structural (`shadow-sm`)** (`0 1px 3px rgba(0,0,0,.14), 0 1px 2px rgba(0,0,0,.08)`): Nav links, search bar, stat chips. Confirms an element is distinct from its background.
- **Container (`shadow-md`)** (`0 4px 18px rgba(0,0,0,.22)`): Table, pagination bar, detail cards. Confirms a surface is a contained region.

### Named Rules
**The Flat-by-Default Rule.** Nothing gets a shadow unless it needs to be readable against the background image. Add shadow-sm for clickable elements, shadow-md for content containers. No intermediate values; no decorative shadows on inline elements.

## 5. Components

### Navigation
Simple, binary. Active tab is Shiso Green with white text. Inactive is translucent white with deep lacquer text.
- **Shape:** Rounded-sm (6px)
- **Active:** Shiso Green background, white text, `padding: 7px 20px`
- **Inactive:** Translucent white, deep lacquer text
- **Hover:** `translateY(-1px)` + shadow-md elevation. Active tabs deepen to Shiso Green Dark.
- **Active:** `scale(0.97)` on press — confirms the click

### Search Input
Glass-effect field; center of the page before the list.
- **Style:** Translucent white surface, no border, rounded-md (10px), shadow-sm
- **Focus:** Green glow ring (`0 0 0 3px rgba(52,164,76,0.3)`) + shadow-md + white background
- **Width:** `min(70%, 600px)`; 92% on mobile

### Table
The product. Everything serves the table.
- **Corner Style:** Rounded-md (10px), overflow hidden (no radius hack needed)
- **Header:** Tatami Gold background, title-weight Poppins, 14px vertical padding
- **Even rows:** Tatami Gold Muted (0.85 opacity)
- **Odd rows:** Translucent surface
- **Row hover:** Amber-faint tint (0.18 opacity), 150ms ease transition
- **Links:** Deep Lacquer text, medium weight; hover shifts to Shiso Green Dark

### Pagination Bar
Compact pill at the bottom of the list.
- **Container:** Translucent surface, rounded-md, 4.8px padding, shadow-sm
- **Item shape:** Rounded-sm, `min-width: 36px`, `height: 36px`
- **Active:** Shiso Green fill, white text
- **Hover (inactive):** Amber-faint tint, `translateY(-1px)`
- **Press:** `scale(0.95)`

### Stat / Filter Bar (Amber Chips)
`#total_resultados` and `#total_filtrados` share the same amber chip style as h1.
- **Style:** Tatami Gold background, rounded-sm, shadow-sm
- **Width:** `min(70%, 720px)`, matching table width for vertical alignment
- **Inline select:** Translucent white fill, 4px radius, no border

### Detail Card (`detalhe.html`)
Cover image + info panel side by side on larger screens, stacked on mobile.
- **Image:** Rounded-md, shadow-md, max-width 260px, object-fit cover
- **Info panel:** Translucent surface background, rounded-md, shadow-md, `padding: 1.5rem`
- **Title:** 700, 1.2rem, deep lacquer
- **Alt title (Nome_eng):** Italic, 0.875rem, aged parchment

## 6. Do's and Don'ts

### Do:
- **Do** use Tatami Gold (`#dcb67d`) as a structural background for every header, h1 wrapper, and stat chip. It is a foundation color, not an accent.
- **Do** reserve Shiso Green exclusively for active states, selected tabs, and focus rings. One color, one meaning.
- **Do** keep translucent surfaces at rgba(255,255,255,0.92): enough to read, light enough to let the background image through.
- **Do** use `scale(0.97)` on `:active` for all clickable nav elements and pagination buttons. The interface must confirm it heard the user.
- **Do** apply `prefers-reduced-motion` globally: set transition-duration to 0.01ms when the user has requested reduced motion.
- **Do** size the table and content columns to `min(70%, 720px)` on desktop, `92%` on mobile. The narrow column is intentional; it creates breathing room against the background.
- **Do** use Poppins weight 700 for h1, 600 for table headers and nav, 500 for labels, 400 for body. No weight below 400.

### Don't:
- **Don't** use Shiso Green for decorative fills, backgrounds, or non-interactive elements. Its meaning is active/selected; diluting that breaks the visual language.
- **Don't** add side-stripe `border-left` accents to table rows or cards. Use full backgrounds or nothing.
- **Don't** apply gradient text or `background-clip: text` effects. Single solid colors only.
- **Don't** use Poppins at weight 200. The original CSS used it; it was removed for good reason.
- **Don't** hardcode `width: 70%` without a `min()` cap. On wide screens without a max-width, table lines become unreadable.
- **Don't** use the broad `p {}` selector in shared CSS. Scope to IDs or page-specific selectors to avoid bleed between pages.
- **Don't** omit `prefers-reduced-motion`. Users with vestibular disorders need it; cost is one `@media` block.
- **Don't** treat this as a dark-mode product. The background image creates perceived darkness, but the surfaces are warm translucent white. True dark mode would require a full surface redesign.
