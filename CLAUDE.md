# /mu/ Essentials 2018 — Album a Day Dashboard

## Project Overview

This is a React dashboard (dashboard.jsx) tracking progress through a 318-album version of the /mu/ essentials 2018 list. Two people — **Hargrove (Jack)** and **Aidan** — are listening to one album per day and rating them. The dashboard visualizes their progress, ratings, and preferences.

The dashboard renders as a Claude artifact (JSX with Recharts). There is also an HTML export (`mu-essentials-dashboard.html`) for sharing, though it currently has issues on mobile Safari.

## File Structure

- `dashboard.jsx` — The main React component. This is the only file you need to edit.
- `mu-essentials-dashboard.html` — Standalone HTML export (needs rebuilding after JSX changes via TypeScript transpilation, see below)

## Naming

Artist and album names follow the original /mu/ list as Jack spells them (e.g. "Godspeed You Black Emperor!", "my bloody valentine", "BLΛNK BΛNSΗΣΣ", "CAN", "The Mothers of Invention"). Names in a non-Latin script are followed by a romanization in brackets: "ミドリ [Midori]", "98.12.28 男達の別れ [98.12.28 Otokotachi no wakare]". Optional album fields: `group` (combines projects in Most Represented Artists, e.g. VU & Nico → The Velvet Underground) and `sortAs` (artist sort + search key, e.g. "Hosono", "Blank Banshee"). Renaming an album means updating ALBUMS, HARGROVE_RANKING, LIST_ORDER and the writing file's `album:` line together; keep the existing slug/URL.

## Original List Order

`LIST_ORDER` in dashboard.jsx is the original /mu/ essentials 2018 order (section by section, as on the chart image), keyed like HARGROVE_RANKING (`artist + " - " + title`). Sorting the album table by Section uses it.

## Album Covers

`covers/<slug>.jpg` (one per album, slug = writing file name) is shown in each album page header. Sources: Jack's hand-picked TierMaker images (300px, the reference for which cover version is right) or, where iTunes had the identical artwork and Jack approved it, a 600px iTunes version. To change one, replace the file and push.

## Site Pages

- `build.mjs` renders dashboard.jsx twice, setting `DASHBOARD_PAGE`: `/` = header (with overall progress bar), link to charts, album list; `/charts/` = header, link back, all charts. Without `DASHBOARD_PAGE` (standalone artifact) everything shows.
- `/lists/` = "The Lists": `images/mu-essentials-2018.jpg` (original chart), `images/hargrove-tier-list.jpg`, and Aidan's tier list, which appears automatically once a file named `images/aidan-tier-list.<jpg|png|webp>` is added (placeholder until then). build.mjs copies `images/` into the site.
- Viewer / status choices travel between the two pages as URL params (`?viewer=aidan&status=listened`); clicking a genre or decade on the charts page opens `/?genre=…` or `/?decade=…`.

## Album Pages (writing/)

- `writing/<slug>.md` — one file per album (318). Front matter `album:` must exactly match `artist + " - " + title` in ALBUMS; `writer:` (`hargrove` | `aidan`) is the byline for both the Summary and Write-up; optional `summary-writer:` overrides the Summary byline. Sections: `# Summary`, `# Write-up`, `# Hargrove's review`, `# Aidan's review` (an empty section renders a "coming soon" placeholder).
- Markdown subset only: paragraphs, trailing-two-space line breaks, `- ` lists, `*italic*`, `**bold**`, `\*` escapes, bare URLs.
- `album-pages.mjs` — dependency-free generator (reads ALBUMS / HARGROVE_RANKING / TIER_BREAKS / colors straight out of dashboard.jsx). `build.mjs` writes `dist/album/<slug>/index.html` and injects `ALBUM_PAGES` (key → slug) so the dashboard table links album titles.
- Imported from Apple Notes (Reviews folder) with track-by-track notes and stale "Ordinal ranking" lines removed; text otherwise verbatim.

## Data Model

Each album in the `ALBUMS` array has these fields:

```
{
  artist: "Artist Name",
  title: "Album Title",
  year: 1999,
  genre: "Indie / Alt",          // One of 11 genres (see GENRE_COLORS)
  section: "Modern",             // Original /mu/ list section: "/mu/-core", "Modern", "Classics", "Jazz", "Electronic", "Hip-Hop", "Metal"
  group: "Daniel Lopatin",       // OPTIONAL — groups related projects (e.g., Chuck Person + OPN = "Daniel Lopatin", Brian Eno solo + Eno & Byrne = "Brian Eno")
  listenOrder: 42,               // OPTIONAL — sequential order listened (1-212), only on listened albums
  rank: 7,                       // OPTIONAL — Hargrove's personal ranking (1=favorite, 212=least), only on listened albums
  tier: "SS",                    // OPTIONAL — Hargrove's tier: SS/S/A/B/C/D/F, only on listened albums
  aidanTier: "A",                // OPTIONAL — Aidan's tier, only on listened albums
  priorListen: true,             // OPTIONAL — Hargrove had heard this before the project
  aidanPrior: true,              // OPTIONAL — Aidan had heard this before the project
  listened: true                 // Whether this album has been listened to yet
}
```

## Genres (15 total)

Indie / Alt, Pop / Rock, Punk / Post-Punk / Hardcore, Psychedelia, Post-Rock, Prog & Krautrock, Metal, Industrial & Noise, Electronic, Ambient, Hip-Hop, R&B / Soul / Funk, Jazz, Classical, Folk / Singer-Songwriter (reworked 2026-10-11; "Experimental" was retired)

## Tier Breaks (Hargrove)

Defined by `TIER_BREAKS` in dashboard.jsx (rank = position in HARGROVE_RANKING, 318 total):

- SS: rank 1-20
- S: rank 21-60
- A: rank 61-120
- B: rank 121-199
- C: rank 200-258
- D: rank 259-299
- F: rank 300-318

Aidan has tiers but NO granular ranking. His tier sort is SS→S→A→B→C→D→F, alphabetical by artist within tiers.

## Viewer Tab System

The dashboard has a "Hargrove" / "Aidan" toggle. The `viewer` state controls which person's tier/rank/prior data is displayed. Key functions:

- `getTier(a)` — returns `a.tier` or `a.aidanTier` based on viewer
- `getRank(a)` — returns `a.rank` for Hargrove, `null` for Aidan

## Multi-Album Artist Ordering

Artists with multiple albums are ordered **chronologically** in the data array. The sort uses `_idx` (array position) as a tiebreaker so this ordering is preserved in the table and artist chart. This is intentional and carefully maintained — e.g., David Bowie is Ziggy (1972) → Low (1977) → Heroes (1977) → Blackstar (2016).

## Adding a New Album Listen

When a new album is listened to (album #213, #214, etc.):

1. Find the album in the ALBUMS array (it already exists with `listened: false`)
2. Add `listenOrder: 213` (or whatever the next number is)
3. Add Hargrove's `rank` and `tier` — this requires incrementing the rank of every album currently at or below the insertion point. E.g., if new album is rank 45, every album with rank >= 45 gets rank += 1
4. Also update Hargrove's tier breaks if the insertion shifts albums across tier boundaries
5. Add `aidanTier: "X"` with Aidan's tier
6. Set `listened: true`

## Genre Classification Principles

- Genre assignments are debated and deliberate; Jack has final say but welcomes pushback
- "Punk / Post-Punk / Hardcore" includes hardcore and post-hardcore (Fugazi, At the Drive-In, Brand New, Unwound); American Football, The Brave Little Abacus and The Dismemberment Plan stay Indie / Alt
- "Psychedelia" is a catch-all for psychedelic music that doesn't fit elsewhere (The Doors stay Pop / Rock)
- Big Black is split on purpose: Atomizer = Industrial & Noise, Songs About Fucking = Punk / Post-Punk / Hardcore
- Classical exists for Morton Feldman (and Moondog) even though it is small
- Safe as Milk is Pop/Rock (not Experimental like Trout Mask Replica)
- NIN stays in Industrial even though it could be Metal
- Slint is Punk/Post-Punk (not Experimental, despite being the ur-post-rock album)

## Rebuilding the HTML Export

The HTML export requires pre-compiling JSX to plain JS (no Babel in browser — it's too slow on mobile). Steps:

```bash
# 1. Create a .tsx wrapper with type declarations
cat > dashboard.tsx << 'EOF'
declare var React: any;
declare var ReactDOM: any;
declare var Recharts: any;
const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } = Recharts;
EOF

# Append JSX content (without import lines)
grep -v "^import " dashboard.jsx >> dashboard.tsx

# 2. Compile with TypeScript API
node -e "
const ts = require('typescript');
const fs = require('fs');
const src = fs.readFileSync('dashboard.tsx', 'utf8');
const result = ts.transpileModule(src, {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.None,
  }
});
fs.writeFileSync('dashboard.js', result.outputText);
"

# 3. Clean up module artifacts from the compiled JS and wrap in HTML
# Remove: "use strict", Object.defineProperty(exports...), exports.default = Dashboard
# Wrap in HTML with React + Recharts CDN scripts (no Babel needed)
```

Note: The HTML currently still has issues loading on mobile Safari. The Recharts CDN may not be loading properly. This is an open issue.

## Style Notes

- Dark theme (#0d0d0d background, monospace fonts)
- JetBrains Mono + Space Mono from Google Fonts
- All visualizations respond to the All/Listened/Remaining status toggle
- The table is sortable by any column; rank sort on Aidan's tab sorts by tier then alphabetically
- Alphabetical sorts (artist, album, Most Represented Artists) ignore a leading "The" / "A" / "An" (`alphaKey` in dashboard.jsx); `sortAs` overrides the artist key
