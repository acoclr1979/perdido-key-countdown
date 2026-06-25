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

All markup, CSS, and JavaScript are inline in `index.html`. The only external data file is `vrei-jokes.json`, fetched at runtime via `fetch('./vrei-jokes.json')` in `loadVreiJokes()`.

**Key JS functions and what drives them:**

- `refreshVrei()` — called every second via `setInterval`. Calls `updateCountdown()` (which also calls `updateTicker()`), then `updateVrei()`. The VREI quote only re-rolls on tier change (`lastVreiTier` guard), not every second.
- `updateTicker(daysLeft)` — swaps the breaking-news headline text based on integer days remaining.
- `getVreiTier(daysLeft)` / `getVreiScore(daysLeft)` — VREI logic. Tiers: `simmering` (>15 days), `building` (4–15), `fullSend` (0–3 or negative). Score is linear 5–100 over a 21-day window. `VREI_SCORE_OVERRIDE` (currently `null`) pins the score when set to a number.
- `displayQuote()` — picks one random quote from the inline `quotes` array on page load only (not on the 1s interval).
- Carousel — dots are generated in JS by counting existing `.carousel-slide` divs; no separate count to maintain.

## Important file quirks

- `Photo-7-PKC.JPEG` — uppercase `.JPEG` extension. Do not rename it; it will 404 on case-sensitive hosts (GitHub Pages).
- `Photo-18-PKC.jpg` — `.jpg` (not `.jpeg`); now a carousel slide (was the tiled background image; background is now a solid gradient).
- `IMG_1144.jpeg` — carousel image that wasn't renamed to the `Photo-##-PKC` convention; leave as-is.

## Adding content

**New carousel photo:** Add a `<div class="carousel-slide"><img src="./Photo-##-PKC.jpeg" ...></div>` inside `#carousel`. The dot generator counts slide divs automatically.

**New VREI jokes:** Edit `vrei-jokes.json` only — keep the three keys (`simmering`, `building`, `fullSend`), each an array of strings. No JS changes needed.

**Rotating the Culinary Spotlight:** Swap content inside `.spotlight-container`, then move the previous restaurant's link into the "Archived Spotlight" `food-link-container` block near the bottom of the page.

## Countdown target

Hardcoded as `"July 11, 2026 00:00:00"` using the visitor's **local timezone** (not US Central). Intentional for this use case.
