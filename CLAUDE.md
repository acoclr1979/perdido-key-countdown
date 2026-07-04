# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page countdown site for a group trip to Perdido Key, FL (July 11–18, 2026). No build step, no framework, no dependencies — everything lives in `index.html`. Deployed via GitHub Pages at https://acoclr1979.github.io/perdido-key-countdown/.

## Git workflow

Never commit or push to GitHub without asking first and waiting for explicit confirmation, even for small changes. Each push should get its own separate confirmation — do not batch multiple changes into one push without asking each time.

## Development

Open `index.html` directly in a browser to test locally. There is no dev server, no build, no package manager.

To deploy: `git add . && git commit -m "..." && git push` — GitHub Pages goes live within ~1 minute.

## Architecture

Three pages, all static HTML with inline CSS/JS, linked to each other:

- `index.html` — Page 1, Main Countdown (the homepage)
- `stories.html` — Page 2, Tales from the Shore (side quest, linked from index.html)
- `gallery.html` — Page 3, The Photo Dump (photo grid gallery, linked from index.html)

All markup, CSS, and JavaScript are inline in each page. The only external data file is `vrei-jokes.json`, fetched at runtime via `fetch('./vrei-jokes.json')` in `loadVreiJokes()` (index.html only).

**Layout (index.html):** Full-screen photo hero (`.hero-photo-wrap`, currently `Photo-21-PKC.png`) at the top with a large gradient headline, then full-screen photo mosaic (`.mosaic-bg`) fixed behind everything, dark overlay (`.mosaic-overlay`), then centered `.main` content floating on top. No white card — glass-morphism countdown tiles and VREI box over the mosaic.

**gallery.html:** Same mosaic background treatment as stories.html, but the content area is a responsive photo grid (`.gallery-grid`) showing actual `<img>` thumbnails (not blurred backgrounds) for every mosaic photo plus `Photo-20-PKC.JPG` (the "two men on the beach" photo that used to be the index.html hero). Each thumbnail links to the full-size image in a new tab.

**Key JS functions:**

- `refreshVrei()` — called every second via `setInterval`. Calls `updateCountdown()`, then `updateVrei()`. The VREI quote only re-rolls on tier change (`lastVreiTier` guard), not every second.
- `getVreiTier(daysLeft)` / `getVreiScore(daysLeft)` — VREI logic. Tiers: `simmering` (>15 days), `building` (4–15), `fullSend` (0–3 or negative). Score is linear 5–100 over a 21-day window. `VREI_SCORE_OVERRIDE` (currently `null`) pins the score when set to a number.

**Mosaic background:** All 20 photos listed explicitly in `.mosaic-bg` as `<img>` tags in a 5×4 CSS grid (4×5 on mobile). Order in HTML = left-to-right, top-to-bottom grid fill.

## Important file quirks

- `Photo-7-PKC.JPEG` — uppercase `.JPEG` extension. Do not rename it; it will 404 on case-sensitive hosts (GitHub Pages).
- `Photo-18-PKC.jpg` — `.jpg` (not `.jpeg`); now a carousel slide (was the tiled background image; background is now a solid gradient).
- `IMG_1144.jpeg` — carousel image that wasn't renamed to the `Photo-##-PKC` convention; leave as-is.
- `Photo-20-PKC.JPG` — uppercase `.JPG` extension (uploaded via GitHub web UI, which preserved the original case). Do not rename it; it will 404 on case-sensitive hosts. Was the index.html hero photo; now lives on gallery.html only.
- `Photo-21-PKC.png` — current index.html hero photo (was uploaded as `Photo - 21 - PKC.PNG` with spaces; renamed to match convention). Portrait orientation.

## Adding content

**New carousel photo:** Add a `<div class="carousel-slide"><img src="./Photo-##-PKC.jpeg" ...></div>` inside `#carousel`. The dot generator counts slide divs automatically.

**New VREI jokes:** Edit `vrei-jokes.json` only — keep the three keys (`simmering`, `building`, `fullSend`), each an array of strings. No JS changes needed.

**Rotating the Culinary Spotlight:** Swap content inside `.spotlight-container`, then move the previous restaurant's link into the "Archived Spotlight" `food-link-container` block near the bottom of the page.

## Countdown target

Hardcoded as `"July 11, 2026 00:00:00"` using the visitor's **local timezone** (not US Central). Intentional for this use case.
