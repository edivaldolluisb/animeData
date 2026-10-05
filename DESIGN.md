---
name: Ani-Mangalist
description: Personal anime and manga collection, printed like a doujin convention circle catalog.
colors:
  papel: "#e9e6dc"
  papel-cel: "#f0ede4"
  tinta: "#1a1a1a"
  tinta-2: "#4a4740"
  caneta: "#c8291f"
  cover-placeholder: "#d9d5c8"
typography:
  display:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  cell-name:
    fontFamily: "Zen Kaku Gothic New, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
  code:
    fontFamily: "M PLUS 1 Code, ui-monospace, monospace"
    fontSize: "0.6875rem-0.8125rem"
    fontWeight: 600
    letterSpacing: "0.04em-0.12em, uppercase for labels"
  pen:
    fontFamily: "Kalam, cursive"
    fontWeight: 700
    color: "{colors.caneta}"
rounded:
  none: "0"
  pen-ellipse: "52% 46% 55% 44% / 60% 50% 52% 44%"
spacing:
  page-gutter: "clamp(1rem, 4vw, 3rem)"
  cell-padding: "5px 5px 7px"
  hall-gap: "2.75rem"
components:
  masthead:
    backgroundColor: "{colors.papel}"
    borderBottom: "1px solid {colors.tinta}"
    typography: "code, uppercase, 0.12em"
  nav-current:
    marker: "pen ellipse, 2px {colors.caneta}, rotated -3deg"
  chip:
    background: "none"
    typography: "code 0.8125rem uppercase"
    pressed: "pen ellipse"
  hall-letter:
    backgroundColor: "{colors.caneta}"
    textColor: "#ffffff"
    size: "2rem square"
  cell:
    backgroundColor: "{colors.papel-cel}"
    border: "1px {colors.tinta} hairline grid"
    cover: "grayscale(1) contrast(1.12), multiply; full color on hover/focus and in Hall A"
---

# Design System: Ani-Mangalist

## 1. Overview

**Creative North Star: "O Catálogo de Convenção"**

The collection is printed as a doujin event (Comiket) circle catalog: hundreds of covers at postage-stamp size packed edge to edge in a hairline grid, each with a table code, on cheap newsprint. The owner has gone through it with a red pen, circling what he is watching now and crossing out what he dropped. The headline voice borrows from a design annual: one huge heavy title, a thin data bar above, generous air before the grid starts.

This is not a streaming app (no dark poster wall, no rounded cards) and not a spreadsheet (no zebra rows). It is a printed index that someone uses.

**Key characteristics:**
- One ink on paper. Covers are printed in black (grayscale + multiply) and only gain color when touched, or when they are in Hall A.
- Red pen is the only accent, and it is always "handwritten": circles, crosses, pen notes. Nothing structural is red except the hall letter blocks.
- Square corners everywhere. Rounding exists only in pen ellipses.
- Codes (`A-001`) are real navigation aids: hall letter plus position inside the hall, stable for a given data file.

## 2. Colors

- **Papel** (#e9e6dc): page ground, with a 4px halftone dot (`radial-gradient`, 6% ink). Newsprint, not cream.
- **Papel-cel** (#f0ede4): the slightly lighter stock of each catalog cell and the detail plate.
- **Tinta** (#1a1a1a): all text, every hairline rule, filled episode ticks.
- **Tinta-2** (#4a4740): secondary text (counts, English names, placeholder). Passes AA on papel.
- **Caneta** (#c8291f): the red pen. Circles, crosses, pen notes, hall letter blocks, focus rings, hover color on links.

### Named rules
**One ink, one pen.** No third hue. Status is never shown as colored badges; it is shown by hall placement and pen marks.
**The pen is handwritten.** Every red mark is either Kalam lettering or an irregular ellipse/stroke; never a clean filled pill.

## 3. Typography

- **Display/body: Zen Kaku Gothic New** (500/700/900). Covers Latin and Japanese, so titles and the 目録 mark share one face. Display at 900 with -0.03em tracking.
- **Code: M PLUS 1 Code** (400/600). Only for data: entry codes, counts, labels in the masthead, dt labels, nav tokens. Uppercase with tracking for labels.
- **Pen: Kalam 700.** Only for red handwritten notes: progress on Hall A cells (`ep 15/24`, `cap 150`), `pausa`, status and score on the detail page, empty/error messages.

## 4. Elevation

Flat print. No shadows at all. Separation comes from 1px ink hairlines (cell grid, rules) and 3px heavy rules under the title and under the detail sheet.

## 5. Components

### Masthead
Sticky thin bar: `ANI-MANGALIST 目録` left, list tokens right (Anime, Mangá, MAL). Current list is circled in pen. Stacks on phones.

### Title block
Huge h1 (`Catálogo de animes`, last word in pen red) with the count in code type on the right, closed by a 3px rule.

### Controls
Search is an underline-only field (2px ink, red on focus). Status filters are text chips generated from the data with counts; the pressed one is circled in pen. `input` event filters live.

### Halls
The list is split into halls by status: A (Assistindo/Lendo), B (Pretendo), C (Completo), D (Em pausa, Dropado, anything else). Each hall has a red letter block, name, count and a hairline running to the edge. Codes are assigned per hall from the full list, so filtering never renumbers.

### Cell
Cover (225/318), code row, two-line name. Grid is `auto-fill minmax(112px)` (100px on phones) with shared 1px borders. Hall A: cover in color, code circled in pen (SVG ellipse drawn with a 700ms stroke animation, staggered), pen progress note. Dropado: cover at 55% opacity with a red pen X. Broken or missing covers fall back to a plain placeholder block. Status is also present as visually hidden text inside the link.

### Detail sheet (`detalhe.html`)
Cover as a printed plate: 1px frame, papel-cel mount, registration crosshairs at two corners. Beside it: `Nº 001 DE 303` in code, big title, English name, then a ruled `dl` (Status in circled pen lettering, Progresso with one 12px tick box per episode up to 100 episodes, Nota in pen). MAL entries link out with an SVG arrow. Prev/next are code-type text links; arrow keys navigate.

### States
Loading: 12 skeleton cells pulsing between papel tones. Empty and error: a pen-written red line.

## 6. Do's and Don'ts

### Do
- Keep covers grayscale outside Hall A; color is the reward for attention.
- Use pen marks sparingly: only for "now" (circle), "dropped" (cross) and handwritten notes.
- Keep everything square and hairline-ruled.
- Respect `prefers-reduced-motion` (pen circles appear already drawn).

### Don't
- Don't add colored status badges, pills or rounded cards.
- Don't add shadows, glass or blur.
- Don't use the mono face for prose, or the pen face for anything that is not a handwritten note.
- Don't bring back the photo backgrounds; the paper is the surface.
