# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page-per-topic trip site for a group trip to Perdido Key, FL (July 11–18, 2026). No build step, no framework, no dependencies — plain HTML/CSS/JS files. Deployed via GitHub Pages at https://acoclr1979.github.io/perdido-key-countdown/.

The homepage's hero copy, title, and headline are updated by hand most days during the trip (e.g. "T−1 Week" → "24 Hours Out" → "First Full Day On The Beach") — this is an intentional daily ritual, not something to automate away.

## Git workflow

Never commit or push to GitHub without asking first and waiting for explicit confirmation, even for small changes. Each push should get its own separate confirmation — do not batch multiple changes into one push without asking each time.

Note: this site gets edited directly on GitHub's web/mobile UI throughout the trip (not just through Claude Code sessions), so `main` can move between sessions. Run `git fetch origin && git log --oneline main..origin/main` before building on top of an old checkout.

## Development

Serve the folder with `python3 -m http.server` and open `http://localhost:8000` (needed for the Firebase `type="module"` scripts to behave like they do in production; opening `index.html` directly via `file://` will not run them).

To deploy: `git add . && git commit -m "..." && git push` — GitHub Pages goes live within ~1 minute.

## Pages

- `index.html` — homepage: hero photo, countdown, VREI meter, trip programming/voting, helpful links, who's coming, links out to the side-quest pages
- `gallery.html` — "The Photo Dump," a grid of every photo in `/photos/`
- `stories.html` — "Tales from the Shore," trip legends/nostalgia + a community story submission form
- `poem.html` — "The Night Before Perdido," a one-off "Twas the Night Before Christmas" parody poem page (side quest, linked from index.html)

## Shared infrastructure

Plain JS files loaded via `<script src="...">` / ES module `import` — no bundler:

- `photos.js` — the photo list (fallback array + live GitHub Contents API loader), mosaic crop overrides, gallery captions/featured flags, and an exclusion list for decorative non-photo assets
- `mosaic.js` — renders the full-bleed photo mosaic background (index.html, stories.html)
- `gallery.js` — renders the photo grid on gallery.html
- `firebase-init.js` — shared Firebase app/Firestore init (imported by index.html and stories.html)

## Photo pickup system (drop a photo in, it shows up automatically)

All trip photos live in `/photos/`. To add one: upload it via GitHub's web/mobile "Add file → Upload files" UI (or `git add`/commit/push) — **no filename convention required, no code changes needed.**

How it works: `photos.js` calls the GitHub Contents API (`api.github.com/repos/acoclr1979/perdido-key-countdown/contents/photos`) at page load, cached in `sessionStorage` for 5 minutes. The gallery grid and mosaic background both render from that list. A hardcoded fallback array in `photos.js` is the safety net if the API call fails (offline, rate-limited) — update it too if you want brand-new photos to show up even when the API is unreachable, though this isn't required for normal operation.

**Decorative assets are excluded, not deleted.** `PKC_EXCLUDE` in `photos.js` lists filenames that live in `/photos/` for other purposes (the VREI mascot image, generated art, etc.) and shouldn't be mixed into the candid-photo pool. Add a filename there if you drop in something that isn't a real trip photo.

**Cropping tradeoff:** the original ~20 mosaic photos have hand-tuned crop positions in `PKC_MOSAIC_OVERRIDES` (in `photos.js`). Any newly auto-discovered photo not in that map gets a plain `center center` / `cover` crop — fine by default, hand-tune a specific entry if one looks bad.

**HEIC caveat:** the loader accepts `.heic`, but HEIC doesn't render in an `<img>` tag on Chrome/Firefox/Windows/Android — only Safari displays it. Convert to `.jpg` before uploading if the whole group needs to see it. (`IMG_1350.heic` sits untracked in the repo root for this reason — convert before adding to `/photos/`.)

Non-pooled images stay in the repo root because they're referenced by explicit filename: `beachball.jpeg` (stories.html seed story).

## Important file quirks

- `photos/Photo-7-PKC.JPEG` and `photos/Photo-20-PKC.JPG` — uppercase extensions preserved from GitHub web-upload. Do not rename; they'll 404 on case-sensitive GitHub Pages hosting.
- `photos/Photo-18-PKC.jpg` — `.jpg` not `.jpeg`.
- `photos/IMG_1144.jpeg` — never renamed to the `Photo-##-PKC` convention; leave as-is.
- `photos/Photo-24-PKC.PNG` and `photos/Photo-30-PKC.PNG` — decorative PNGs (generated art, VREI mascot), excluded from the photo pool via `PKC_EXCLUDE` — see above.
- `photos/Photo-29-PKC.jpeg` — current index.html hero photo (heron on the shoreline at sunrise) and `og:image`.
- `photos/Photo-30-PKC.PNG` — "Vacation Rick" mascot avatar shown in the VREI panel.
- `photos/Photo-25-PKC.jpeg` — hero image on poem.html.

## Adding content

**New trip photo:** drop it into `/photos/`. That's it.

**New VREI jokes:** edit `vrei-jokes.json` only — keep the three keys (`simmering`, `building`, `fullSend`), each an array of strings describing Vacation Rick's energy *level* at that moment, not "days until" framing (the same tier fires on the way up and the way down, so keep jokes direction-agnostic).

## Countdown / VREI logic (index.html)

These are two independent mechanisms sharing the same visual meter — don't assume they're driven by the same number:

- **Countdown tiles** (Days/Hours/Min/Sec): count down to a specific labeled moment — currently "Until We Start Packing · Fri 9PM" (`July 17, 2026 21:00:00`). This target and label get updated by hand as the trip progresses; it isn't meant to be automated.
- **VREI meter** (bar/score/tier/quote): driven by `VREI_CURVE`, a hardcoded map of each trip date (`YYYY-MM-DD`) to a 0–100 energy score — rising through arrival weekend, peaking Monday (golf day), declining Tue/Wed, dropping hard Thu/Fri, lowest on departure Saturday. Before the trip starts, score ramps up linearly over a 21-day window toward the arrival-day score; after the trip ends, it drops to a flat low value. `getVreiTier(score)` buckets into `simmering` (<30) / `building` (30–79) / `fullSend` (≥80), which selects the joke bank in `vrei-jokes.json`. `VREI_SCORE_OVERRIDE` (currently `null`) pins the score to a fixed number when set, useful for testing/screenshots.
- The countdown's `diffMs` is still passed into `updateVrei()` for one thing: forcing the tier label to "PACK MODE" once the Friday-9PM packing countdown hits zero, regardless of what the VREI curve says.

## Known cleanup opportunities (not yet acted on)

- `IMG_1350.heic` needs conversion to `.jpg` before it can join `/photos/` (see HEIC caveat above).
