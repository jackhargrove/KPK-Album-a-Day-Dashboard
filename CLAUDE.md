# /mu/ Essentials 2018 — Album a Day Dashboard

## Project Overview

A website for a finished project: **Hargrove (Jack)** and **Aidan** listened to all 318 albums of the /mu/ essentials 2018 list, one a day (Feb 13, 2025 – Sept 2026), and rated each one. The site has the album list, charts, the original list and both final tier lists, and a page of writing for every album (summary, write-up, both reviews).

Live at https://jackhargrove.github.io/KPK-Album-a-Day-Dashboard/ — deployed from `main` by GitHub Actions.

## Files

- `dashboard.jsx` — the React dashboard (home page album list + charts page) and **all album data**: ALBUMS, HARGROVE_RANKING, LIST_ORDER, TIER_BREAKS, CREDITS, ARTIST_LOCATIONS, colors.
- `album-pages.mjs` — dependency-free generator for the album pages and The Lists page; also the link-preview tags (`previewTags`, `SITE_URL`). Reads its data straight out of dashboard.jsx.
- `build.mjs` — the build (run in GitHub Actions only): compiles dashboard.jsx with TypeScript into `/` and `/charts/`, writes `/album/<slug>/` and `/lists/`, copies `covers/` and `images/`.
- `writing/<slug>.md` — one file per album with all the writing. **The only copy** — edit these directly; never re-import from Apple Notes.
- `covers/<slug>.jpg` — album covers. `images/` — original chart, both tier lists, RYM map, `preview.jpg` (link-preview image).
- `.github/workflows/deploy.yml` — installs `typescript@5` (keep it pinned at v5) and runs `node build.mjs`.

## Build, Deploy & Local Testing

- Push to `main` → GitHub Actions builds and deploys to GitHub Pages in ~1 minute. There is no local build step.
- Node is **not installed** on Jack's Mac. To test locally: run `album-pages.mjs` through `osascript -l JavaScript` (strip `export`, load with `new Function`), and preview the dashboard with a small HTML harness that fetches dashboard.jsx and transpiles it with TypeScript from cdnjs (same settings as build.mjs), served by `python3 -m http.server` started via `/bin/sh -c "cd <scratch dir> && …"` (the iCloud folder can't be the server's cwd).
- The repo lives in iCloud Drive: deleting and re-copying files spawns "name 2.md" duplicates. Overwrite in place (e.g. `rsync -c`), and check `git status` for stray " 2" files before committing.

## Naming

Artist and album names follow the original /mu/ list as Jack spells them (e.g. "Godspeed You Black Emperor!", "my bloody valentine", "BLΛNK BΛNSΗΣΣ", "CAN", "The Mothers of Invention"). Names in a non-Latin script are followed by a romanization in brackets: "ミドリ [Midori]", "98.12.28 男達の別れ [98.12.28 Otokotachi no wakare]". Renaming an album means updating ALBUMS, HARGROVE_RANKING, LIST_ORDER and the writing file's `album:` line together (plus any CREDITS entries); keep the existing slug/URL.

## Data Model

Each album in `ALBUMS`:

```
{
  artist: "Artist Name",
  title: "Album Title",
  year: 1999,
  genre: "Indie / Alt",          // one of the 15 genres in GENRE_COLORS
  section: "Modern",             // original /mu/ list section: "/mu/-core", "Modern", "Classics", "Jazz", "Electronic", "Hip-Hop", "Metal"
  listenOrder: 42,               // 1–318, order listened
  aidanTier: "A",                // Aidan's tier SS/S/A/B/C/D/F
  priorListen: true,             // OPTIONAL — Hargrove had heard it before the project
  aidanPrior: true,              // OPTIONAL — Aidan had heard it before the project
  listened: true,                // all 318 are true
  group: "Daniel Lopatin",       // OPTIONAL — combines projects in Most Represented Artists (Chuck Person + OPN; Eno solo + Eno & Byrne; VU & Nico → The Velvet Underground; Mothers of Invention → Frank Zappa)
  sortAs: "Bowie, David",        // OPTIONAL — artist sort/search key (see Sorting)
}
```

- **Hargrove's rank** = position in `HARGROVE_RANKING` (array of `artist + " - " + title` keys, #1 first). **Hargrove's tier** is derived from the rank via `TIER_BREAKS`: SS 1–20, S 21–60, A 61–120, B 121–199, C 200–258, D 259–299, F 300–318.
- **Aidan** has tiers only, no ranking. His rank sort is SS→F, alphabetical within tiers.
- `LIST_ORDER` = the original /mu/ essentials 2018 order (section by section, as on the chart image); sorting the album table by Section uses it.
- Artists with multiple albums are ordered chronologically in the ALBUMS array; `_idx` (array position) is the tiebreaker that preserves it (e.g. Bowie: Ziggy → Low → "Heroes" → ★).

## Genres (15)

Indie / Alt, Pop / Rock, Punk / Post-Punk / Hardcore, Psychedelia, Post-Rock, Prog & Krautrock, Metal, Industrial & Noise, Electronic, Ambient, Hip-Hop, R&B / Soul / Funk, Jazz, Classical, Folk / Singer-Songwriter (reworked 2026-10-11; "Experimental" was retired).

Classification principles (Jack has final say but welcomes pushback):
- "Punk / Post-Punk / Hardcore" includes hardcore and post-hardcore (Fugazi, At the Drive-In, Brand New, Unwound); American Football, The Brave Little Abacus and The Dismemberment Plan stay Indie / Alt
- "Psychedelia" is a catch-all for psychedelic music that doesn't fit elsewhere (The Doors stay Pop / Rock)
- Big Black is split on purpose: Atomizer = Industrial & Noise, Songs About Fucking = Punk / Post-Punk / Hardcore
- Classical exists for Morton Feldman (and Moondog) even though it is small
- Both Captain Beefheart albums (Safe as Milk, Trout Mask Replica) are Pop / Rock; NIN stays Industrial & Noise; Slint is Punk / Post-Punk / Hardcore

## Site Pages

- `build.mjs` renders dashboard.jsx twice, setting `DASHBOARD_PAGE`: `/` = header (overall progress bar), links to Charts and The Lists, album list; `/charts/` = header, link back, all charts. Without `DASHBOARD_PAGE` (standalone artifact) everything shows. The charts' two-column rows stack on narrow screens.
- `/lists/` = "The Lists": original chart (`images/mu-essentials-2018.jpg`), `images/hargrove-tier-list.jpg` and `images/aidan-tier-list.jpg` side by side, and the RYM map (`images/rym-music-map.jpg`).
- The viewer choice travels between pages as a URL param (`?viewer=aidan`); clicking a genre or decade on the charts page opens `/?genre=…` or `/?decade=…`.
- Every page has link-preview tags: home/charts/lists use `images/preview.jpg` (cover mosaic); album pages use their own cover, title and both tiers.

## Credits & Locations (from Jack's "Misc." notes)

- `CREDITS` = Jack's "List Records" note: every individual credited on 5+ list albums, **in his exact order** (most credits; ties → more artist/band credits first; any arguable sample credit sends a person to the bottom of their tie group — keep the array order, don't re-sort). `arguable: true` marks sample/interpolation credits. Drives "Most Credited Individuals" and the "Recurring contributors" line on album pages (a person's own album as plain "Artist" is omitted; band members show as "member").
- `ARTIST_LOCATIONS` = Jack's RateYourMusic music map, continent → country → region → city. Counts are artists (284), not albums, so it can't be tied to individual albums. Drives "Where the Artists Are From".

## Album Pages (writing/)

- Front matter: `album:` must exactly match `artist + " - " + title` in ALBUMS; `writer:` (`hargrove` | `aidan`) is the byline for Summary and Write-up; optional `summary-writer:` overrides the Summary byline (Trout Mask Replica, You Made Me Realise); `listened:` is the listen date ("March 29, 2025"; two-day albums "June 28–29, 2025").
- Sections: `# Summary`, `# Write-up`, `# Hargrove's review`, `# Aidan's review` (an empty section renders "coming soon"; an empty Summary is hidden — Pet Sounds has none by design).
- Markdown subset only: paragraphs, trailing-two-space line breaks, `- ` and `1. ` lists, `*italic*`, `**bold**`, `\*` escapes, bare URLs. Review lines starting "Favorite tracks:" / "Least favorite track:" (and variants) render in a track box at the end of the review.
- Hargrove's writing came from Apple Notes (Reviews folder; track-by-track notes and stale "Ordinal ranking" lines removed). Aidan's came from two text files he sent (2026-10-24). Both verbatim otherwise.
- Bylines: 195 albums Hargrove, 123 Aidan. Every album has both reviews.

## Covers

`covers/<slug>.jpg`, one per album. Jack's hand-picked TierMaker images (300px) are the reference for which cover version is right; 179 use an approved 600px iTunes version with identical artwork. Eccojams, Murmuüre and Paysage d'Hiver use their rectangular cassette covers. To change one, replace the file and push.

## Sorting & Style

- Dark theme (#0d0d0d background), JetBrains Mono + Space Mono; album-page prose in Source Serif 4.
- The table is sortable by any column (default: Listen Order).
- Alphabetical sorts (artist, album, Most Represented Artists) ignore leading punctuation/symbols and a leading "The" / "A" / "An" (`alphaKey`): "Heroes" → H, (GI) → G, '77 Live → 7; names starting in a non-Latin script sort by their bracketed romanization.
- Personal names sort by surname. `sortAs` holds the artist sort key from Jack's Apple Notes review headers ("Bowie, David", "Pop, Iggy", "Zappa, Frank" for The Mothers of Invention). Group names in Most Represented Artists use the same keys (`GROUP_SORT` covers "Daniel Lopatin").
