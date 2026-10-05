# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The owner (Edivaldo) tracking his own anime and manga, plus friends he shares the link with to show what he has watched or to give recommendations. Used equally on phone (installed PWA / mobile browser) and desktop.

## Product Purpose

Ani-Mangalist is a personal record of every anime watched and manga read. Success: in a few seconds the owner can see what he is currently watching/reading and where he stopped, confirm whether he has already seen a title, pick the next thing from the plan-to-watch backlog, and browse the collection with friends.

## Positioning

It is one person's curated shelf, not a database. Unlike MyAnimeList or AniList it has no social feed, ratings economy or catalog; it shows only what this person has lived through, in his own words and statuses, and it now mirrors his MyAnimeList list alongside the hand-kept lists.

## Operating Context

- Static site on GitHub Pages; no backend.
- Three lists: hand-kept anime (`dados/animes.json`), hand-kept manga (`dados/mangas.json`), and MyAnimeList mirror (`dados/mal.json`, refreshed daily by a GitHub Action).
- Shared detail page for any entry (`detalhe.html?id=&tipo=anime|manga|mal`).
- Entries are added by editing JSON by hand.

## Capabilities and Constraints

- Plain HTML/CSS/JS, no build step, no framework, no npm dependencies.
- Per entry: Japanese name, English name (optional), status, cover image URL, progress (`ep` episodes / `cap` chapters). MAL entries also have total episodes (`eps`) and personal score (`score`, 0 = unrated).
- Statuses: anime Completo / Assistindo / Pretendo Assistir / Dropado (MAL adds Em Pausa); manga Lendo / Completo / Dropado.
- Lists hold 100-300+ entries.
- Interface language is Portuguese.
- PWA: must keep working as an installable app; service worker caches the shell, data is network-first.

## Evidence on Hand

- Real cover images for nearly every entry (MyAnimeList CDN URLs).
- Background photography in `imagens/` (anime figures, posters) used today as page backdrops.
- No ratings or reviews written by the owner exist beyond MAL scores; do not invent them.

## Product Principles

1. Covers are the collection; let them lead.
2. "What am I on right now" is always one glance away.
3. Finding a title by name must stay instant.
4. Personal, not a catalog: no features that pretend to be a social platform.

## Accessibility & Inclusion

No specific requirement established; keep WCAG AA contrast, keyboard navigation and reduced-motion support already present.
