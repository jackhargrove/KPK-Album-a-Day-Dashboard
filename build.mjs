import { readFileSync, writeFileSync, mkdirSync } from "fs";
import ts from "typescript";

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

// Build HTML via concatenation (NOT template literals) to avoid
// backticks in the compiled JS breaking the output
const htmlParts = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<title>/mu/ essentials - Album a Day Dashboard</title>',
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
  '<script>',
  js,
  'ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Dashboard));',
  '</script>',
  '</body>',
  '</html>',
];

const html = htmlParts.join("\n");

mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", html);
console.log("Built dist/index.html");
