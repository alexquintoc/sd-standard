const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bookDir = path.join(root, "docs", "book");
const canonicalOrigin = "https://sdstandard.org";
const knowledgeBasePath = "/knowledge-base";

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return walkHtml(entryPath);
    return entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

function deployedPath(filePath) {
  const relativePath = path.relative(bookDir, filePath).split(path.sep).join("/");

  if (relativePath === "index.html") return `${knowledgeBasePath}/`;
  if (relativePath.endsWith("/index.html")) {
    return `${knowledgeBasePath}/${relativePath.slice(0, -"index.html".length)}`;
  }

  return `${knowledgeBasePath}/${relativePath}`;
}

function existingRedirectPath(html) {
  const match = html.match(/<meta\s+http-equiv=["']refresh["'][^>]*content=["'][^"']*URL=([^"']+)["']/i);
  return match?.[1] ?? null;
}

function canonicalUrl(filePath, html) {
  const redirectPath = existingRedirectPath(html);
  const pathname = redirectPath?.startsWith(knowledgeBasePath)
    ? redirectPath
    : deployedPath(filePath);

  return new URL(pathname, canonicalOrigin).href;
}

function addCanonical(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  const canonical = canonicalUrl(filePath, html);
  const canonicalTag = `<link rel="canonical" href="${canonical}">`;
  const existingCanonical = /\s*<link\s+rel=["']canonical["'][^>]*>\s*/i;

  if (existingCanonical.test(html)) {
    html = html.replace(existingCanonical, `\n    ${canonicalTag}\n`);
  } else if (html.includes("</head>")) {
    html = html.replace("</head>", `    ${canonicalTag}\n    </head>`);
  } else {
    throw new Error(`Cannot add canonical metadata to ${path.relative(root, filePath)}`);
  }

  fs.writeFileSync(filePath, html, "utf8");
}

if (!fs.existsSync(bookDir)) {
  throw new Error(`Missing mdBook output: ${bookDir}`);
}

const htmlFiles = walkHtml(bookDir);
htmlFiles.forEach(addCanonical);
console.log(`Added canonical SD Standard URLs to ${htmlFiles.length} Knowledge Base pages.`);
