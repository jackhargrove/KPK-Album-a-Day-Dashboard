import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync } from "fs";
import ts from "typescript";
import { buildAlbumPages, renderListsPage } from "./album-pages.mjs";

const jsx = readFileSync("dashboard.jsx", "utf8");

// Strip import lines and "export default" for browser compatibility
const stripped = jsx
  .split("\n")
  .filter((line) => !line.startsWith("import "))
  .join("\n")
  .replace(/export default /g, "");

const preamble = `const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } = Recharts;
`;

const source = preamble + stripped;

// Compile JSX → plain JS via TypeScript
const result = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.None,
  },
});

// Clean up any module artifacts TypeScript may emit
const js = result.outputText
  .replace(/^"use strict";\s*/m, "")
  .replace(/Object\.defineProperty\(exports.*?\);\s*/g, "")
  .replace(/exports\.default\s*=\s*\w+;\s*/g, "");

// Album pages: one static page per writing/<slug>.md
const writingFiles = readdirSync("writing")
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => ({ slug: f.slice(0, -3), text: readFileSync("writing/" + f, "utf8") }));
const covers = existsSync("covers") ? readdirSync("covers").filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
const { pages, index } = buildAlbumPages(jsx, writingFiles, covers);
mkdirSync("dist/covers", { recursive: true });
for (const f of covers) copyFileSync("covers/" + f, "dist/covers/" + f);
for (const page of pages) {
  mkdirSync("dist/album/" + page.slug, { recursive: true });
  writeFileSync("dist/album/" + page.slug + "/index.html", page.html);
}
console.log("Built " + pages.length + " album pages");

// The Lists page + images (original chart, tier lists)
const images = readdirSync("images").filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f));
mkdirSync("dist/images", { recursive: true });
for (const f of images) copyFileSync("images/" + f, "dist/images/" + f);
mkdirSync("dist/lists", { recursive: true });
writeFileSync("dist/lists/index.html", renderListsPage(images));
console.log("Built dist/lists/index.html with " + images.length + " images");

// Build HTML via concatenation (NOT template literals) to avoid
// backticks in the compiled JS breaking the output.
// The same app is written twice: the album list at / and the charts at /charts/.
const page = (name, title) => [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<title>' + title + '</title>',
  '<style>',
  '  * { margin: 0; padding: 0; box-sizing: border-box; }',
  '  body { background: #0d0d0d; }',
  '  ::-webkit-scrollbar { width: 6px; height: 6px; }',
  '  ::-webkit-scrollbar-track { background: #111; }',
  '  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }',
  '</style>',
  '</head>',
  '<body>',
  '<div id="root"></div>',
  '<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>',
  '<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>',
  '<script src="https://unpkg.com/prop-types@15/prop-types.min.js"></script>',
  '<script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.js"></script>',
  '<script>var ALBUM_PAGES = ' + JSON.stringify(index).replace(/</g, "\\u003c") + '; var DASHBOARD_PAGE = "' + name + '";</script>',
  '<script>',
  js,
  'ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Dashboard));',
  '</script>',
  '</body>',
  '</html>',
].join("\n");

mkdirSync("dist/charts", { recursive: true });
writeFileSync("dist/index.html", page("home", "/mu/ essentials - Album a Day Dashboard"));
writeFileSync("dist/charts/index.html", page("charts", "Charts & Stats · /mu/ essentials"));
console.log("Built dist/index.html and dist/charts/index.html");
