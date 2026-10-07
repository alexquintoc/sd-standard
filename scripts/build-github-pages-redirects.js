const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "docs", "book");
const outputDir = path.join(root, "docs", "legacy-pages");
const canonicalRoot = "https://sdstandard.org/knowledge-base/";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function redirectPage(target) {
  const escapedTarget = escapeHtml(target);
  const serializedTarget = JSON.stringify(target).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0; url=${escapedTarget}">
    <link rel="canonical" href="${escapedTarget}">
    <title>Knowledge Base moved</title>
    <script>window.location.replace(${serializedTarget} + window.location.search + window.location.hash);</script>
  </head>
  <body>
    <p>The SD Standard Knowledge Base has moved to <a href="${escapedTarget}">${escapedTarget}</a>.</p>
  </body>
</html>
`;
}

function fallbackPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0; url=${canonicalRoot}">
    <link rel="canonical" href="${canonicalRoot}">
    <title>Knowledge Base moved</title>
    <script>
      (function () {
        var projectPath = "/sd-standard";
        var pathname = window.location.pathname;
        if (pathname === projectPath || pathname === projectPath + "/") pathname = "/";
        else if (pathname.indexOf(projectPath + "/") === 0) pathname = pathname.slice(projectPath.length);
        window.location.replace("https://sdstandard.org/knowledge-base" + pathname + window.location.search + window.location.hash);
      })();
    </script>
  </head>
  <body>
    <p>The SD Standard Knowledge Base has moved to <a href="${canonicalRoot}">${canonicalRoot}</a>.</p>
  </body>
</html>
`;
}

function canonicalFromHtml(filePath, html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
  if (match) return match[1];

  const relativePath = path.relative(sourceDir, filePath).split(path.sep).join("/");
  return new URL(relativePath === "index.html" ? "" : relativePath, canonicalRoot).href;
}

function buildRedirects(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const sourcePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      buildRedirects(sourcePath);
      continue;
    }

    if (!entry.name.endsWith(".html") || entry.name === "404.html") continue;

    const relativePath = path.relative(sourceDir, sourcePath);
    const outputPath = path.join(outputDir, relativePath);
    const html = fs.readFileSync(sourcePath, "utf8");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, redirectPage(canonicalFromHtml(sourcePath, html)), "utf8");
  }
}

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Missing mdBook output: ${sourceDir}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
buildRedirects(sourceDir);
fs.writeFileSync(path.join(outputDir, "404.html"), fallbackPage(), "utf8");
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "", "utf8");

console.log(`Built GitHub Pages redirect layer in ${path.relative(root, outputDir)}.`);
