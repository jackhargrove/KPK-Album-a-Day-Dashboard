// Album pages: turns writing/<slug>.md files into static HTML pages.
// Pure functions only (no fs / imports) so build.mjs owns all file I/O.

// ---------------------------------------------------------------------------
// Data: pull the literal constants out of dashboard.jsx

function extractConst(src, name) {
  const start = src.indexOf("const " + name + " = ");
  if (start < 0) throw new Error("dashboard.jsx: missing const " + name);
  let i = src.indexOf("=", start) + 1;
  while (/\s/.test(src[i])) i++;
  const open = src[i], close = open === "[" ? "]" : "}";
  let depth = 0, quote = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (quote) {
      if (c === "\\") j++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) return new Function("return " + src.slice(i, j + 1))();
  }
  throw new Error("dashboard.jsx: unterminated const " + name);
}

export function loadDashboardData(jsx) {
  const ALBUMS = extractConst(jsx, "ALBUMS");
  const HARGROVE_RANKING = extractConst(jsx, "HARGROVE_RANKING");
  const TIER_BREAKS = extractConst(jsx, "TIER_BREAKS");
  const GENRE_COLORS = extractConst(jsx, "GENRE_COLORS");
  const TIER_COLORS = extractConst(jsx, "TIER_COLORS");
  const CREDITS = extractConst(jsx, "CREDITS");
  const rankOf = new Map(HARGROVE_RANKING.map((k, i) => [k, i + 1]));
  const albums = ALBUMS.map((a) => {
    const key = a.artist + " - " + a.title;
    const rank = rankOf.get(key) || null;
    const tier = rank ? TIER_BREAKS.find((t) => rank <= t.max).tier : null;
    // recurring contributors (from CREDITS); skip a person's own album where they are simply the credited artist
    const credits = [];
    for (const p of CREDITS) for (const c of p.credits) {
      if (c.album !== key || (c.role === "Artist" && p.name === a.artist)) continue;
      credits.push({ name: p.name, role: c.role === "Artist" ? "member" : c.role.charAt(0).toLowerCase() + c.role.slice(1), arguable: !!c.arguable });
    }
    return { ...a, key, rank, tier, credits };
  });
  return { albums, GENRE_COLORS, TIER_COLORS };
}

// ---------------------------------------------------------------------------
// Writing files: front matter + "# Section" blocks

export function parseWriting(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error("missing front matter");
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const sections = {};
  let current = null;
  for (const line of text.slice(m[0].length).split("\n")) {
    const h = line.match(/^# (.+)$/);
    if (h) { current = h[1].trim(); sections[current] = []; }
    else if (current) sections[current].push(line);
  }
  for (const k in sections) sections[k] = sections[k].join("\n").trim();
  return { meta, sections };
}

// ---------------------------------------------------------------------------
// Minimal Markdown: paragraphs, "  " line breaks, "- " / "1. " lists, *italic*, **bold**, \* escapes, bare URLs

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(text) {
  const escapes = [];
  let s = text.replace(/\\(.)/g, (_, c) => "\u0000" + (escapes.push(c) - 1) + "\u0000");
  s = escapeHtml(s);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)”’"]/g, (u) => '<a href="' + u + '" rel="noopener">' + u + "</a>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => escapeHtml(escapes[+i]));
}

export function renderMarkdown(md) {
  if (!md) return "";
  return md
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n");
      if (lines.every((l) => l.startsWith("- "))) {
        return "<ul>" + lines.map((l) => "<li>" + inline(l.slice(2)) + "</li>").join("") + "</ul>";
      }
      if (lines.every((l) => /^\d+\. /.test(l))) {
        return "<ol>" + lines.map((l) => "<li>" + inline(l.replace(/^\d+\. /, "")) + "</li>").join("") + "</ol>";
      }
      return "<p>" + lines.map((l, i) => inline(l.replace(/ {2}$/, "")) + (i < lines.length - 1 ? "<br>" : "")).join("") + "</p>";
    })
    .join("\n");
}

const plain = (md) => md.replace(/\\(.)/g, "$1").replace(/\*/g, "");

// Summary: "Label: value" lines become a definition list; the rest stays as notes.
function renderSummary(md) {
  if (!md) return "";
  const rows = [], notes = [];
  let dateLine = null;
  for (const line of md.split("\n").map((l) => l.replace(/ {2}$/, "")).filter(Boolean)) {
    const p = plain(line);
    const field = p.match(/^([“"]?[A-Za-z0-9][\w /&’'.-]{0,30}?[”"]?)\s*:(?:\s+(.*))?$/) || p.match(/^(Genre)\s+(.*)$/);
    if (!dateLine && /album of the day/i.test(p) && !rows.length) dateLine = line;
    else if (field && !/^https?$/.test(field[1]) && !notes.length) {
      const label = field[1];
      const value = line.replace(/^.*?:\s*/, "").replace(/^Genre\s+/, "");
      rows.push("<dt>" + escapeHtml(label) + "</dt><dd>" + inline(value) + "</dd>");
    } else notes.push(line);
  }
  return (
    (dateLine ? '<p class="aotd">' + inline(dateLine.replace(/-&gt;|->/, "→")) + "</p>" : "") +
    (rows.length ? '<dl class="facts">' + rows.join("") + "</dl>" : "") +
    (notes.length ? '<div class="note">' + notes.map((l) => "<p>" + inline(l) + "</p>").join("") + "</div>" : "")
  );
}

// Reviews: "Favorite tracks:" / "Least favorite track:" lines (and variants like "Least favorite segment:")
// are pulled out wherever they appear and shown together in a track box at the end of the review.
const TRACK_LINE = /^(least )?favou?rite (tracks?|tacks?|segments?|sections?|songs?)\b[^:]{0,40}:/i;

function renderReview(md) {
  if (!md) return "";
  const blocks = md.split(/\n{2,}/);
  const tracks = blocks.filter((b) => TRACK_LINE.test(plain(b)));
  let html = renderMarkdown(blocks.filter((b) => !TRACK_LINE.test(plain(b))).join("\n\n"));
  if (tracks.length) {
    html += '<dl class="tracks">' + tracks.map((t) => {
      const i = t.indexOf(":");
      return "<dt>" + escapeHtml(plain(t.slice(0, i))) + "</dt><dd>" + inline(t.slice(i + 1).trim()) + "</dd>";
    }).join("") + "</dl>";
  }
  return html;
}

// ---------------------------------------------------------------------------
// Page

const NAMES = { hargrove: "Hargrove", aidan: "Aidan" };

const CSS = `
:root { --bg:#0d0d0d; --panel:#121212; --line:#222; --text:#d6d6d6; --dim:#777; --faint:#4a4a4a; --accent:#5B8DBE; }
* { margin:0; padding:0; box-sizing:border-box; }
html { -webkit-text-size-adjust:100%; }
body { background:var(--bg); color:var(--text); font-family:'JetBrains Mono', ui-monospace, monospace; }
a { color:inherit; }
.wrap { max-width:720px; margin:0 auto; padding:20px 16px 64px; }
nav.top { display:flex; justify-content:space-between; align-items:center; gap:12px; font-size:11px; color:var(--dim); padding-bottom:20px; border-bottom:1px solid var(--line); }
nav.top a { text-decoration:none; color:var(--dim); }
nav.top a:hover { color:var(--text); }
nav.top .pn { display:flex; gap:14px; }
header.album { padding:28px 0 24px; border-bottom:1px solid var(--line); }
.artist { font-size:12px; letter-spacing:2px; text-transform:uppercase; color:var(--dim); margin-bottom:8px; }
.head { display:flex; gap:28px; align-items:flex-start; }
.head .info { min-width:0; flex:1; }
.cover { flex:none; display:block; line-height:0; border-radius:4px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,.5); }
.cover img { display:block; width:auto; height:auto; max-width:200px; max-height:240px; }  /* square → 200×200; cassette covers keep their shape */
h1 { font-family:'Space Mono', monospace; font-size:clamp(26px, 6vw, 38px); line-height:1.15; color:#fff; font-weight:700; overflow-wrap:anywhere; }
.meta { display:flex; flex-wrap:wrap; gap:6px 16px; margin-top:14px; font-size:12px; color:var(--dim); }
.meta .genre { display:inline-flex; align-items:center; gap:6px; }
.meta .sw { width:7px; height:7px; border-radius:1px; display:inline-block; }
.ratings { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
.rating { display:flex; align-items:center; gap:10px; background:var(--panel); border:1px solid var(--line); border-radius:4px; padding:8px 12px; font-size:11px; color:var(--dim); }
.rating .who { letter-spacing:1.5px; text-transform:uppercase; font-size:9px; }
.tier { font-size:11px; font-weight:700; padding:2px 6px; border-radius:2px; color:#000; }
.rank { color:var(--text); font-variant-numeric:tabular-nums; }
.prior { font-size:9px; color:var(--accent); letter-spacing:1px; text-transform:uppercase; }
.credits { margin-top:14px; font-size:11px; color:var(--dim); line-height:1.7; }
.credits .who { letter-spacing:1.5px; text-transform:uppercase; font-size:9px; color:var(--faint); margin-right:8px; }
.credits a { color:var(--text); text-decoration:none; border-bottom:1px dotted #444; }
section { padding:32px 0 8px; }
h2 { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--dim); font-weight:500; display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
h2 .by { letter-spacing:1px; text-transform:none; color:var(--faint); font-size:11px; }
.prose { font-family:'Source Serif 4', Georgia, serif; font-size:18px; line-height:1.7; color:#cfcfcf; }
.prose p + p { margin-top:1em; }
.prose em { color:#e8e8e8; }
.prose a, .note a { color:var(--accent); overflow-wrap:anywhere; }
.prose ul, .prose ol { padding-left:1.4em; margin:1em 0; }
.prose li + li { margin-top:.5em; }
.aotd { font-size:12px; color:var(--dim); margin-bottom:14px; }
.aotd em { font-style:italic; color:var(--text); }
dl.facts, dl.tracks { display:grid; grid-template-columns:max-content 1fr; gap:7px 18px; font-size:13px; line-height:1.5; }
dl.facts dt, dl.tracks dt { color:var(--faint); text-transform:uppercase; font-size:10px; letter-spacing:1.2px; padding-top:2px; }
dl.facts dd, dl.tracks dd { color:var(--text); }
dl.tracks { margin-top:24px; padding:14px 16px; background:var(--panel); border:1px solid var(--line); border-radius:4px; font-family:'JetBrains Mono', monospace; }
.note { margin-top:16px; padding:12px 14px; border-left:2px solid #333; font-size:12px; line-height:1.6; color:var(--dim); }
.note p + p { margin-top:6px; }
.pending { font-size:12px; color:var(--faint); font-style:italic; }
.review + .review { border-top:1px solid var(--line); margin-top:32px; }
footer { margin-top:48px; padding-top:20px; border-top:1px solid var(--line); font-size:11px; color:var(--faint); display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
footer a { text-decoration:none; color:var(--dim); }
@media (max-width:520px) {
  .prose { font-size:17px; }
  dl.facts, dl.tracks { grid-template-columns:1fr; gap:2px; }
  dl.facts dd, dl.tracks dd { margin-bottom:8px; }
  .head { flex-direction:column; gap:20px; }
  .cover img { max-width:100%; max-height:340px; }
}
`;

function tierBadge(tier, colors) {
  return tier ? '<span class="tier" style="background:' + colors[tier] + '">' + tier + "</span>" : "";
}

function pending(text) {
  return '<p class="pending">' + text + "</p>";
}

export function renderAlbumPage({ album, writing, prev, next, data, cover }) {
  const { GENRE_COLORS, TIER_COLORS } = data;
  const s = writing.sections;
  const writer = writing.meta.writer;
  const byline = (w) => (NAMES[w] ? '<span class="by">by ' + NAMES[w] + "</span>" : "");
  const by = byline(writer);
  const summaryBy = byline(writing.meta["summary-writer"] || writer);
  const link = (a, label) => (a ? '<a href="../' + a.slug + '/">' + label + "</a>" : '<span style="opacity:.3">' + label + "</span>");
  const t = escapeHtml(album.title), ar = escapeHtml(album.artist);

  const summary = renderSummary(s["Summary"]);
  const writeup = renderMarkdown(s["Write-up"]);
  const hRev = renderReview(s["Hargrove's review"]);
  const aRev = renderReview(s["Aidan's review"]);

  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "<title>" + ar + " – " + t + " · /mu/ essentials</title>",
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Mono:wght@700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&display=swap" rel="stylesheet">',
    "<style>" + CSS + "</style>",
    "</head>",
    "<body>",
    '<div class="wrap">',
    '<nav class="top"><a href="../../">← Dashboard</a><span class="pn">' + link(prev, "← prev") + link(next, "next →") + "</span></nav>",
    '<header class="album"><div class="head">',
    cover ? '<a class="cover" href="../../covers/' + cover + '"><img src="../../covers/' + cover + '" alt="' + ar + " – " + t + ' cover"></a>' : "",
    '<div class="info">',
    '<div class="artist">' + ar + "</div>",
    "<h1>" + t + "</h1>",
    '<div class="meta">',
    "<span>" + album.year + "</span>",
    '<span class="genre"><span class="sw" style="background:' + (GENRE_COLORS[album.genre] || "#555") + '"></span>' + escapeHtml(album.genre) + "</span>",
    "<span>" + escapeHtml(album.section) + "</span>",
    album.listenOrder ? "<span>Album #" + album.listenOrder + " of 318</span>" : "",
    writing.meta.listened
      ? '<span class="listened">' + (writing.meta.listened === "TBD" ? "Date TBD" : "Listened " + escapeHtml(writing.meta.listened)) + "</span>"
      : "",
    "</div>",
    '<div class="ratings">',
    '<div class="rating"><span class="who">Hargrove</span>' + tierBadge(album.tier, TIER_COLORS) +
      (album.rank ? '<span class="rank">#' + album.rank + "</span>" : "") +
      (album.priorListen ? '<span class="prior">heard before</span>' : "") + "</div>",
    '<div class="rating"><span class="who">Aidan</span>' + tierBadge(album.aidanTier, TIER_COLORS) +
      (album.aidanPrior ? '<span class="prior">heard before</span>' : "") + "</div>",
    "</div>",
    album.credits.length
      ? '<div class="credits"><span class="who">Recurring contributors</span>' + album.credits.map((c) =>
          '<a href="../../charts/#credits">' + escapeHtml(c.name) + "</a> (" + escapeHtml(c.role) + (c.arguable ? ", arguable" : "") + ")").join(" · ") + "</div>"
      : "",
    "</div></div></header>",
    summary ? "<section><h2>Summary " + summaryBy + "</h2>" + summary + "</section>" : "",
    "<section><h2>Write-up " + by + '</h2><div class="prose">' +
      (writeup || pending(writer === "aidan" ? "Aidan’s write-up is coming soon." : "No write-up.")) + "</div></section>",
    '<section class="review"><h2>Hargrove’s review</h2><div class="prose">' + (hRev || pending("No review.")) + "</div></section>",
    '<section class="review"><h2>Aidan’s review</h2><div class="prose">' + (aRev || pending("Coming soon.")) + "</div></section>",
    "<footer>" + link(prev, "← " + (prev ? escapeHtml(prev.title) : "")) + '<a href="../../">/mu/ essentials 2018</a>' + link(next, (next ? escapeHtml(next.title) : "") + " →") + "</footer>",
    "</div>",
    "</body>",
    "</html>",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// The Lists page (/lists/): the original /mu/ chart plus both final tier lists.
// images = file names present in images/; Aidan's tier list shows once "aidan-tier-list.*" exists.

const LISTS_CSS = `
.figure { margin-top:16px; }
.figure a { display:block; border:1px solid var(--line); border-radius:4px; overflow:hidden; background:#000; text-align:center; line-height:0; }
.figure img { display:inline-block; max-width:100%; height:auto; }
.figure .cap { font-size:11px; color:var(--faint); margin-top:8px; }
.placeholder { margin-top:16px; border:1px dashed #333; border-radius:4px; padding:48px 16px; text-align:center; font-size:12px; color:var(--faint); }
.wrap.wide { max-width:1100px; }
.pair { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:stretch; }
.pair > section { display:flex; flex-direction:column; min-width:0; }
.pair .placeholder { flex:1; display:flex; align-items:center; justify-content:center; }
@media (max-width:640px) { .pair { grid-template-columns:1fr; gap:0; } }
`;

export function renderListsPage(images) {
  const find = (stem) => images.find((f) => f.replace(/\.[^.]+$/, "") === stem);
  const figure = (file, alt) =>
    '<div class="figure"><a href="../images/' + encodeURI(file) + '"><img src="../images/' + encodeURI(file) + '" alt="' + escapeHtml(alt) + '"></a>' +
    '<p class="cap">Tap to open full size</p></div>';
  const section = (title, sub, file, alt, missing) =>
    "<section><h2>" + title + (sub ? ' <span class="by">' + sub + "</span>" : "") + "</h2>" +
    (file ? figure(file, alt) : '<div class="placeholder">' + missing + "</div>") + "</section>";
  const list = find("mu-essentials-2018"), hargrove = find("hargrove-tier-list"), aidan = find("aidan-tier-list"), map = find("rym-music-map");
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    "<title>The Lists · /mu/ essentials</title>",
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet">',
    "<style>" + CSS + LISTS_CSS + "</style>",
    "</head>",
    "<body>",
    '<div class="wrap wide">',
    '<nav class="top"><a href="../">← Dashboard</a><a href="../charts/">Charts &amp; stats →</a></nav>',
    '<header class="album"><div class="artist">/mu/ essentials 2018</div><h1>The Lists</h1></header>',
    section("The original list", "/mu/ essentials 2018 · 318 albums", list, "The /mu/ essentials 2018 chart", "Image coming soon."),
    '<div class="pair">',
    section("Hargrove’s final tier list", "", hargrove, "Hargrove's final tier list", "Coming soon."),
    section("Aidan’s final tier list", "", aidan, "Aidan's final tier list", "Aidan’s tier list is coming soon."),
    "</div>",
    map ? section("Where the artists are from", 'RateYourMusic music map · <a href="../charts/" style="color:inherit">full breakdown on the charts page</a>', map, "RateYourMusic map of where the list's artists are from", "") : "",
    "</div>",
    "</body>",
    "</html>",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Entry point: files = [{ slug, text }]  →  { pages: [{ slug, html }], index: { "Artist - Title": slug } }

// covers = file names present in covers/ ("<slug>.jpg"); albums without one render without a cover
export function buildAlbumPages(jsx, files, covers = []) {
  const coverOf = new Map(covers.map((f) => [f.replace(/\.[^.]+$/, ""), f]));
  const data = loadDashboardData(jsx);
  const byKey = new Map(data.albums.map((a) => [a.key, a]));
  const entries = files.map(({ slug, text }) => {
    const writing = parseWriting(text);
    const album = byKey.get(writing.meta.album);
    if (!album) throw new Error("writing/" + slug + ".md: unknown album \"" + writing.meta.album + "\"");
    album.slug = slug;
    return { album, writing };
  });
  // prev/next follow listening order
  entries.sort((a, b) => (a.album.listenOrder || 1e9) - (b.album.listenOrder || 1e9));
  const pages = entries.map((e, i) =>
    ({ slug: e.album.slug, html: renderAlbumPage({ ...e, prev: entries[i - 1] && entries[i - 1].album, next: entries[i + 1] && entries[i + 1].album, data, cover: coverOf.get(e.album.slug) }) }));
  const index = {};
  for (const e of entries) index[e.album.key] = e.album.slug;
  return { pages, index };
}
