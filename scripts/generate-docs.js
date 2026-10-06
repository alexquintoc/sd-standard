const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const criteriaPath = path.join(
  root,
  "packages",
  "standard-core",
  "src",
  "criteria.v2.json"
);

const termsPath = path.join(
  root,
  "packages",
  "standard-core",
  "src",
  "terms.json"
);

const docsGeneratedDir = path.join(root, "docs", "src", "generated");
const docsCriteriaDir = path.join(docsGeneratedDir, "criteria");
const docsTermsDir = path.join(docsGeneratedDir, "terms");
const docsPillarsDir = path.join(docsGeneratedDir, "pillars");
const docsManualDir = path.join(root, "docs", "src", "manual");
const docsManualCriteriaDir = path.join(docsManualDir, "criteria");
const docsBookDir = path.join(root, "docs", "book");
const distKnowledgeBaseDir = path.join(root, "dist", "knowledge-base");
const docsSummaryPath = path.join(root, "docs", "src", "SUMMARY.md");
const docsBookTomlPath = path.join(root, "docs", "book.toml");

const criteriaMetaPath = path.join(
  root,
  "packages",
  "standard-core",
  "src",
  "generated",
  "criteria-meta.json"
);

const GENERATED_WARNING = [
  "<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->",
  "<!-- Edit packages/standard-core/src/criteria.v2.json or terms.json instead. -->",
  ""
].join("\n");

const GENERATED_REDIRECTS_START = "# GENERATED_CRITERIA_REDIRECTS:START";
const GENERATED_REDIRECTS_END = "# GENERATED_CRITERIA_REDIRECTS:END";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim() + "\n", "utf8");
}

function writeFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return false;

  writeFile(filePath, content);
  return true;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function cleanGeneratedMarkdown(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      cleanGeneratedMarkdown(fullPath);
      continue;
    }

    if (file.endsWith(".md") || file.includes("#") || file.includes("?")) {
      fs.unlinkSync(fullPath);
    }
  }
}

function assertNoInvalidGeneratedFilenames(dir) {
  if (!fs.existsSync(dir)) return;

  const invalidPaths = [];

  function scan(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.name.includes("#") || entry.name.includes("?")) {
        invalidPaths.push(path.relative(root, entryPath));
      }

      if (entry.isDirectory()) {
        scan(entryPath);
      }
    }
  }

  scan(dir);

  if (invalidPaths.length > 0) {
    throw new Error(
      [
        "Invalid generated docs filenames found. Generated files must not contain # or ?.",
        ...invalidPaths.map((invalidPath) => `- ${invalidPath}`)
      ].join("\n")
    );
  }
}

function removeInvalidGeneratedFilenames(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      removeInvalidGeneratedFilenames(entryPath);
      continue;
    }

    if (entry.name.includes("#") || entry.name.includes("?")) {
      fs.unlinkSync(entryPath);
    }
  }
}


function buildGeneratedSummary(criteriaData, termsData) {
  const lines = [
    "<!-- GENERATED_SUMMARY:START -->",
    "# Reference",
    "- [Pillars](generated/pillars/README.md)"
  ];

  for (const pillar of criteriaData.pillars) {
    lines.push(`  - [${pillar.label}](generated/pillars/${getPillarDocSlug(pillar)}.md)`);
  }

  lines.push("", "- [Criteria Reference](generated/criteria/README.md)");

  for (const pillar of criteriaData.pillars) {
    const pillarCriteriaSlug = `criteria-${getPillarDocSlug(pillar)}`;
    lines.push(`  - [${pillar.label}](generated/criteria/${pillarCriteriaSlug}.md)`);
    let currentCategory = "";

    for (const criterion of pillar.criteria) {
      const visibleId = getCriterionVisibleId(criterion);
      const docSlug = getCriterionDocSlug(criterion);
      const category = getCriterionCategoryLabel(criteriaData, criterion);

      if (category !== currentCategory) {
        currentCategory = category;
        lines.push(
          `    - [${category}](generated/criteria/${getPillarDocSlug(pillar)}-${slugify(category)}.md)`
        );
      }

      lines.push(`      - [${visibleId}: ${criterion.label}](generated/criteria/${docSlug}.md)`);
    }
  }

  const sortedTerms = [...termsData].sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );

  lines.push("", "- [Terms Index](generated/terms/README.md)");

  for (const term of sortedTerms) {
    lines.push(`  - [${term.title}](generated/terms/${term.id}.md)`);
  }

  lines.push("<!-- GENERATED_SUMMARY:END -->");

  return lines.join("\n");
}

function updateGeneratedSummary(criteriaData, termsData) {
  if (!fs.existsSync(docsSummaryPath)) return;

  const summary = fs.readFileSync(docsSummaryPath, "utf8");
  const generatedSummary = buildGeneratedSummary(criteriaData, termsData);
  const generatedBlockPattern =
    /<!-- GENERATED_SUMMARY:START -->[\s\S]*<!-- GENERATED_SUMMARY:END -->/;

  if (generatedBlockPattern.test(summary)) {
    fs.writeFileSync(
      docsSummaryPath,
      summary.replace(generatedBlockPattern, generatedSummary),
      "utf8"
    );
    return;
  }

  fs.writeFileSync(docsSummaryPath, `${summary.trimEnd()}\n\n${generatedSummary}\n`, "utf8");
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function unique(values) {
  return [...new Set(values)];
}

function getPillarDocSlug(pillar) {
  return pillar.id === "environmental" ? "environment" : pillar.id;
}

function slugify(value) {
  return `${value || ""}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/&/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
}

function getCriterionDocSlug(criterion) {
  return criterion.slug || slugify(criterion.label || criterion.id);
}

function getCriterionVisibleId(criterion) {
  return criterion.displayId || criterion.id;
}

function getCriterionCategoryLabel(criteriaData, criterion) {
  return (
    criterion.category ||
    formatSubcategory(criteriaData, criterion) ||
    "Uncategorized"
  );
}

function getCriteriaByReference(criteriaData) {
  const byReference = new Map();

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      for (const reference of [criterion.id, criterion.legacyId, criterion.displayId]) {
        if (reference) byReference.set(`${reference}`.toLowerCase(), criterion);
      }
    }
  }

  return byReference;
}

function getCriterionLinkByReference(criteriaByReference, reference, prefix = "../criteria") {
  const criterion = criteriaByReference.get(`${reference}`.toLowerCase());
  if (!criterion) return `- [${reference}](${prefix}/${reference}.md)`;

  const visibleId = getCriterionVisibleId(criterion);
  return `- [${visibleId}: ${criterion.label}](${prefix}/${getCriterionDocSlug(criterion)}.md)`;
}

function normalizeApplicabilityLabels(content) {
  if (!content) return "";

  return content
    .replace(/(^|\r?\n)P:\s+/g, "$1Project: ")
    .replace(/(^|\r?\n)C:\s+/g, "$1Design Entity: ");
}

function escapeHtml(value) {
  return `${value}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatResources(resources) {
  if (!Array.isArray(resources) || resources.length === 0) return "";

  return resources
    .map((resource) => [
      `- **${resource.title}** — ${resource.description}  `,
      `  <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.url)}</a>`
    ].join("\n"))
    .join("\n");
}

function getCriterionManualFileName(criterion) {
  return `${criterion.id}-guidance.md`;
}

function getCriterionManualPath(criterion) {
  return path.join(docsManualCriteriaDir, getCriterionManualFileName(criterion));
}

function formatListValue(values) {
  return values
    .filter((value) => typeof value !== "undefined" && value !== null && `${value}`.trim())
    .map((value) =>
      `${value}`
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    )
    .join(", ");
}

function formatSdgs(sdgs) {
  if (!Array.isArray(sdgs) || sdgs.length === 0) return "";

  return sdgs
    .filter((sdg) => typeof sdg !== "undefined" && sdg !== null && `${sdg}`.trim())
    .map((sdg) => {
      const value = `${sdg}`.trim();
      return /^sdg\s+/i.test(value) ? value.replace(/^sdg/i, "SDG") : `SDG ${value}`;
    })
    .join(", ");
}

function formatAppliesTo(appliesTo) {
  if (!Array.isArray(appliesTo) || appliesTo.length === 0) return "";

  const labels = {
    project: "Project",
    designingEntity: "Designing Entity"
  };

  return appliesTo
    .map((value) => labels[value] || value)
    .filter(Boolean)
    .join(", ");
}

function formatSubcategory(criteriaData, criterion) {
  const subcategory = criterion.subcategory;
  if (!subcategory) return "";

  return (
    criteriaData.subcategories?.[subcategory]?.label ||
    formatListValue([subcategory])
  );
}

function formatProjectTypes(criterion) {
  const applicability = criterion.applicability || {};
  const categories = Array.isArray(applicability.categories)
    ? applicability.categories
    : [];
  const nestedProjectTypes = Array.isArray(applicability.projectTypes)
    ? applicability.projectTypes
    : [];
  const topLevelProjectTypes = Array.isArray(criterion.projectTypes)
    ? criterion.projectTypes
    : [];

  return formatListValue(unique([...categories, ...nestedProjectTypes, ...topLevelProjectTypes]));
}

function stripFirstHeading(content) {
  return content.replace(/^\s*# .*(?:\r?\n)+/, "").trim();
}

const PLACEHOLDER_GUIDANCE_LINES = new Set([
  ["Add human-authored", " guidance for this criterion."].join(""),
  ["Add practical", " notes, project-specific guidance, and examples."].join(""),
  ["Add examples of", " evidence, documentation, or decision records that could support this criterion."].join(""),
  ["Add links to case", " studies, tools, or project examples."].join(""),
  ["Add guidance", " notes here. Empty guidance files are omitted from generated criterion pages."].join("")
]);

function parseMarkdownSections(content) {
  const sections = [];
  let current = { heading: null, lines: [] };

  for (const line of content.split(/\r?\n/)) {
    const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line);

    if (headingMatch) {
      sections.push(current);
      current = {
        heading: {
          raw: line,
          title: headingMatch[2].trim()
        },
        lines: []
      };
      continue;
    }

    current.lines.push(line);
  }

  sections.push(current);
  return sections;
}

function removePlaceholderGuidance(content) {
  const output = [];

  for (const section of parseMarkdownSections(content)) {
    const lines = section.lines.filter(
      (line) => !PLACEHOLDER_GUIDANCE_LINES.has(line.trim())
    );
    const body = lines.join("\n").trim();
    if (section.heading && !body) {
      continue;
    }

    if (section.heading) {
      output.push(section.heading.raw);
    }

    if (body) {
      output.push(body);
    }
  }

  return output.join("\n\n").trim();
}

function cleanEmbeddedManualGuidance(content) {
  const cleaned = removePlaceholderGuidance(stripFirstHeading(content)
    .replace(/^\s*Related criterion:\s.*(?:\r?\n|$)/i, "")
    .replace(/(^|\r?\n)#{1,6}\s+Purpose\s*(?:\r?\n)+/i, "$1")
    .trim());

  return cleaned.replace(/^(#{1,5})\s+/gm, "$1# ");
}

function buildManualGuidanceTemplate(criterion) {
  return [
    "# " + criterion.id + ": " + criterion.label + " - Extended Guidance",
    "",
    "Add guidance notes here. Empty guidance files are omitted from generated criterion pages."
  ].join("\n");
}

function buildManualCriteriaReadme(criteriaData) {
  const lines = [
    "# Criteria Guidance",
    "",
    "Human-authored extended guidance pages for SD Standard criteria.",
    ""
  ];

  for (const pillar of criteriaData.pillars) {
    lines.push(`## ${pillar.label}`, "");

    for (const criterion of pillar.criteria) {
      const visibleId = getCriterionVisibleId(criterion);
      lines.push(
        `- [${visibleId}: ${criterion.label}](${getCriterionManualFileName(criterion)})`
      );
    }

    lines.push("");
  }

  return lines.join("\n");
}

function ensureManualGuidanceDocs(criteriaData) {
  ensureDir(docsManualCriteriaDir);

  writeFileIfMissing(
    path.join(docsManualDir, "README.md"),
    [
      "# Manual Guidance",
      "",
      "Human-authored guidance that supplements the generated SD Standard reference.",
      "",
      "- [Criteria Guidance](criteria/README.md)"
    ].join("\n")
  );

  writeFileIfMissing(
    path.join(docsManualCriteriaDir, "README.md"),
    buildManualCriteriaReadme(criteriaData)
  );

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      writeFileIfMissing(
        getCriterionManualPath(criterion),
        buildManualGuidanceTemplate(criterion)
      );
    }
  }
}

function readManualGuidance(criterion) {
  const manualPath = getCriterionManualPath(criterion);

  if (!fs.existsSync(manualPath)) return "";

  return cleanEmbeddedManualGuidance(fs.readFileSync(manualPath, "utf8"));
}

function invalidateBuiltBook() {
  fs.rmSync(docsBookDir, { recursive: true, force: true });
  fs.rmSync(distKnowledgeBaseDir, { recursive: true, force: true });
}

function getAllCriterionIds(criteriaData) {
  return new Set(
    criteriaData.pillars.flatMap((pillar) =>
      pillar.criteria.flatMap((criterion) =>
        [criterion.id, criterion.legacyId, criterion.displayId].filter(Boolean)
      )
    )
  );
}

function getAllTermIds(termsData) {
  return new Set(termsData.map((term) => term.id));
}

function validateLinks(criteriaData, termsData) {
  const criterionIds = getAllCriterionIds(criteriaData);
  const termIds = getAllTermIds(termsData);

  for (const term of termsData) {
    for (const criterionId of term.relatedCriteria || []) {
      if (!criterionIds.has(criterionId)) {
        throw new Error(
          `Term "${term.id}" references missing criterion "${criterionId}"`
        );
      }
    }

    for (const relatedTermId of term.relatedTerms || []) {
      if (!termIds.has(relatedTermId)) {
        throw new Error(
          `Term "${term.id}" references missing related term "${relatedTermId}"`
        );
      }
    }
  }

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      for (const termId of criterion.terms || []) {
        if (!termIds.has(termId)) {
          throw new Error(
            `Criterion "${criterion.id}" references missing term "${termId}"`
          );
        }
      }

      if (typeof criterion.resourcesNote !== "undefined" &&
          typeof criterion.resourcesNote !== "string") {
        throw new Error(`Criterion "${criterion.id}" resourcesNote must be a string`);
      }

      if (typeof criterion.resources !== "undefined" &&
          !Array.isArray(criterion.resources)) {
        throw new Error(`Criterion "${criterion.id}" resources must be an array`);
      }

      for (const [index, resource] of (criterion.resources || []).entries()) {
        const resourcePath = `Criterion "${criterion.id}" resource ${index + 1}`;

        if (!resource || typeof resource !== "object") {
          throw new Error(`${resourcePath} must be an object`);
        }

        for (const field of ["title", "description", "url"]) {
          if (typeof resource[field] !== "string" || !resource[field].trim()) {
            throw new Error(`${resourcePath} must have a non-empty ${field}`);
          }
        }

        let parsedUrl;
        try {
          parsedUrl = new URL(resource.url);
        } catch {
          throw new Error(`${resourcePath} has an invalid URL: ${resource.url}`);
        }

        if (!new Set(["http:", "https:"]).has(parsedUrl.protocol)) {
          throw new Error(`${resourcePath} URL must use HTTP or HTTPS: ${resource.url}`);
        }
      }
    }
  }
}

function getCompatibilityDocSlugs(criterion) {
  return unique([criterion.id, criterion.legacyId])
    .filter(Boolean)
    .filter((slug) => !/[#?\\/]/.test(slug))
    .filter((slug) => slug !== getCriterionDocSlug(criterion));
}

function buildCompatibilityPage(criterion) {
  const visibleId = getCriterionVisibleId(criterion);
  const docSlug = getCriterionDocSlug(criterion);

  return [
    GENERATED_WARNING,
    `# ${visibleId}: ${criterion.label}`,
    "",
    `This criterion page has moved to [${docSlug}.md](${docSlug}.md).`
  ].join("\n");
}

function generateCriteriaDocs(criteriaData) {
  ensureDir(docsCriteriaDir);
  cleanGeneratedMarkdown(docsCriteriaDir);

  const missingCategories = [];

  const indexLines = [
    GENERATED_WARNING,
    "# Criteria Reference",
    "",
    "This section contains the criteria used in the SD Standard, grouped by pillar and category.",
    ""
  ];

  for (const pillar of criteriaData.pillars) {
    indexLines.push(`## ${pillar.label}`, "");
    let currentCategory = "";
    let pillarPageLines = [
      GENERATED_WARNING,
      `# ${pillar.label}`,
      "",
      "Criteria in this pillar, grouped by category.",
      ""
    ];
    let categoryPageLines = [];
    let currentCategorySlug = "";

    for (const criterion of pillar.criteria) {
      const visibleId = getCriterionVisibleId(criterion);
      const docSlug = getCriterionDocSlug(criterion);
      const category = getCriterionCategoryLabel(criteriaData, criterion);

      if (!criterion.category && !criterion.subcategory) {
        missingCategories.push(`${visibleId}: ${criterion.label}`);
      }

      if (category !== currentCategory) {
        if (categoryPageLines.length > 0) {
          writeFile(
            path.join(docsCriteriaDir, `${currentCategorySlug}.md`),
            categoryPageLines.join("\n")
          );
        }

        currentCategory = category;
        currentCategorySlug = `${getPillarDocSlug(pillar)}-${slugify(category)}`;
        indexLines.push(`### ${category}`, "");
        pillarPageLines.push(
          `## ${category}`,
          `- [View category page](${currentCategorySlug}.md)`,
          ""
        );
        categoryPageLines = [
          GENERATED_WARNING,
          `# ${category}`,
          "",
          `Pillar: ${pillar.label}`,
          ""
        ];
      }

      const examples = (criterion.examples || [])
        .map((example) => `- ${example}`)
        .join("\n");

      const relatedTerms = (criterion.terms || [])
        .map((termId) => `- [${slugToTitle(termId)}](../terms/${termId}.md)`)
        .join("\n");

      const resources = formatResources(criterion.resources);

      const contentParts = [
        GENERATED_WARNING,
        `# ${visibleId}: ${criterion.label}`,
        "",
        `**Display ID:** ${visibleId}  `,
        `**Pillar:** ${pillar.label}  `,
        `**Points:** ${criterion.points}  `,
        `**Mandatory for Certification:** ${criterion.mandatory === true ? "Yes" : "No"}  `
      ];

      const projectTypes = formatProjectTypes(criterion);
      const relatedSdgs = formatSdgs(criterion.sdgs);
      const appliesTo = formatAppliesTo(criterion.appliesTo);
      const subcategory = formatSubcategory(criteriaData, criterion);

      if (subcategory) {
        contentParts.push(`**Category:** ${subcategory}  `);
      }

      if (appliesTo) {
        contentParts.push(`**Applicability:** ${appliesTo}  `);
      }

      if (projectTypes) {
        contentParts.push(`**Project types:** ${projectTypes}  `);
      }

      if (relatedSdgs) {
        contentParts.push(`**Related SDGs:** ${relatedSdgs}`);
      }

      contentParts.push("");

      if (criterion.summary) {
        contentParts.push("## Summary", normalizeApplicabilityLabels(criterion.summary), "");
      }

      if (criterion.description) {
        contentParts.push("## Criteria", normalizeApplicabilityLabels(criterion.description), "");
      }

      if (criterion.whyItMatters) {
        contentParts.push("## Why it matters", normalizeApplicabilityLabels(criterion.whyItMatters), "");
      }

      if (examples) {
        contentParts.push("## Examples", examples, "");
      }

      if (relatedTerms) {
        contentParts.push("## Related terms", relatedTerms, "");
      }

      if (resources) {
        contentParts.push("## Resources");

        if (criterion.resourcesNote) {
          contentParts.push(criterion.resourcesNote, "");
        }

        contentParts.push(resources, "");
      }

      const manualGuidance = readManualGuidance(criterion);

      if (manualGuidance) {
        contentParts.push(
          "## Extended guidance",
          normalizeApplicabilityLabels(manualGuidance),
          ""
        );
      }

      const filePath = path.join(docsCriteriaDir, `${docSlug}.md`);
      writeFile(filePath, contentParts.join("\n"));

      indexLines.push(`- [${visibleId}: ${criterion.label}](${docSlug}.md)`);
      pillarPageLines.push(`- [${visibleId}: ${criterion.label}](${docSlug}.md)`);
      categoryPageLines.push(`- [${visibleId}: ${criterion.label}](${docSlug}.md)`);

      for (const compatibilitySlug of getCompatibilityDocSlugs(criterion)) {
        writeFile(
          path.join(docsCriteriaDir, `${compatibilitySlug}.md`),
          buildCompatibilityPage(criterion)
        );
      }
    }

    if (categoryPageLines.length > 0) {
      writeFile(
        path.join(docsCriteriaDir, `${currentCategorySlug}.md`),
        categoryPageLines.join("\n")
      );
    }

    writeFile(
      path.join(docsCriteriaDir, `criteria-${getPillarDocSlug(pillar)}.md`),
      pillarPageLines.join("\n")
    );

    indexLines.push("");
  }

  if (missingCategories.length > 0) {
    console.warn(
      [
        "Criteria missing category/subcategory; placed under Uncategorized:",
        ...missingCategories.map((item) => `- ${item}`)
      ].join("\n")
    );
  }

  writeFile(path.join(docsCriteriaDir, "README.md"), indexLines.join("\n"));
}

function buildCriteriaRedirects(criteriaData) {
  const redirects = [];

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      const docSlug = getCriterionDocSlug(criterion);
      for (const compatibilitySlug of getCompatibilityDocSlugs(criterion)) {
        redirects.push({
          from: `/generated/criteria/${compatibilitySlug}.html`,
          to: `/generated/criteria/${docSlug}.html`
        });
      }
    }
  }

  return redirects;
}

function updateBookRedirects(criteriaData) {
  const redirects = buildCriteriaRedirects(criteriaData);
  const lines = [
    GENERATED_REDIRECTS_START,
    "[output.html.redirect]",
    ...redirects.map(
      (redirect) => `${JSON.stringify(redirect.from)} = ${JSON.stringify(redirect.to)}`
    ),
    GENERATED_REDIRECTS_END
  ];
  const generatedBlock = lines.join("\n");
  const content = fs.readFileSync(docsBookTomlPath, "utf8").trimEnd();
  const markerPattern = new RegExp(
    `\\n*${GENERATED_REDIRECTS_START}[\\s\\S]*?${GENERATED_REDIRECTS_END}\\s*`
  );
  const redirectTablePattern = /\n*\[output\.html\.redirect\][\s\S]*$/;

  if (markerPattern.test(content)) {
    fs.writeFileSync(
      docsBookTomlPath,
      content.replace(markerPattern, `\n\n${generatedBlock}\n`),
      "utf8"
    );
    return;
  }

  const baseContent = redirectTablePattern.test(content)
    ? content.replace(redirectTablePattern, "")
    : content;

  fs.writeFileSync(docsBookTomlPath, `${baseContent}\n\n${generatedBlock}\n`, "utf8");
}

function generateTermsDocs(termsData, criteriaData) {
  ensureDir(docsTermsDir);
  cleanGeneratedMarkdown(docsTermsDir);
  const criteriaByReference = getCriteriaByReference(criteriaData);

  const sortedTerms = [...termsData].sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );

  const indexLines = [
    GENERATED_WARNING,
    "# Terms Index",
    "",
    "This section contains key concepts and definitions referenced in the SD Standard.",
    ""
  ];

  for (const term of sortedTerms) {
    const relatedCriteria = (term.relatedCriteria || [])
      .map((criterionId) => getCriterionLinkByReference(criteriaByReference, criterionId))
      .join("\n");

    const relatedTerms = (term.relatedTerms || [])
      .map((termId) => `- [${slugToTitle(termId)}](${termId}.md)`)
      .join("\n");

    const contentParts = [
      GENERATED_WARNING,
      `# ${term.title}`,
      ""
    ];

    if (term.definition) {
      contentParts.push("## Definition", term.definition, "");
    }

    if (term.whyItMatters) {
      contentParts.push("## Why it matters", term.whyItMatters, "");
    }

    if (relatedCriteria) {
      contentParts.push("## Related criteria", relatedCriteria, "");
    }

    if (relatedTerms) {
      contentParts.push("## Related terms", relatedTerms, "");
    }

    const filePath = path.join(docsTermsDir, `${term.id}.md`);
    writeFile(filePath, contentParts.join("\n"));

    indexLines.push(`- [${term.title}](${term.id}.md)`);
  }

  writeFile(path.join(docsTermsDir, "README.md"), indexLines.join("\n"));
}

function generatePillarDocs(criteriaData) {
  ensureDir(docsPillarsDir);
  cleanGeneratedMarkdown(docsPillarsDir);

  const thresholds = criteriaData.thresholds || {};

  const indexLines = [
    GENERATED_WARNING,
    "# Pillars",
    "",
    "This section contains overview pages for each SD Standard pillar.",
    ""
  ];

  for (const pillar of criteriaData.pillars) {
    const threshold = thresholds[pillar.id];
    const pillarSlug = getPillarDocSlug(pillar);

    const criteriaLinkLines = [];
    let currentCategory = "";

    for (const criterion of pillar.criteria) {
      const visibleId = getCriterionVisibleId(criterion);
      const docSlug = getCriterionDocSlug(criterion);
      const category = getCriterionCategoryLabel(criteriaData, criterion);

      if (category !== currentCategory) {
        currentCategory = category;
        criteriaLinkLines.push(`### ${category}`, "");
      }

      criteriaLinkLines.push(`- [${visibleId}: ${criterion.label}](../criteria/${docSlug}.md)`);
    }

    const criteriaLinks = criteriaLinkLines.join("\n");

    const relatedTermIds = unique(
      pillar.criteria.flatMap((criterion) => criterion.terms || [])
    );

    const relatedTerms = relatedTermIds
      .map((termId) => `- [${slugToTitle(termId)}](../terms/${termId}.md)`)
      .join("\n");

    const totalAvailablePoints = pillar.criteria.reduce(
      (sum, criterion) => sum + (criterion.points || 0),
      0
    );

    const contentParts = [
      GENERATED_WARNING,
      `# ${pillar.label}`,
      ""
    ];

    if (typeof threshold !== "undefined") {
      contentParts.push(`**Threshold:** ${threshold}  `);
    }

    contentParts.push(`**Total available points:** ${totalAvailablePoints}`, "");

    contentParts.push(
      "## Criteria in this pillar",
      criteriaLinks || "No criteria listed.",
      ""
    );

    if (relatedTerms) {
      contentParts.push("## Related terms", relatedTerms, "");
    }

    const filePath = path.join(docsPillarsDir, `${pillarSlug}.md`);
    writeFile(filePath, contentParts.join("\n"));

    if (pillar.id !== pillarSlug) {
      writeFile(path.join(docsPillarsDir, `${pillar.id}.md`), contentParts.join("\n"));
    }

    indexLines.push(`- [${pillar.label}](${pillarSlug}.md)`);
  }

  writeFile(path.join(docsPillarsDir, "README.md"), indexLines.join("\n"));
}

function generateCriteriaMeta(criteriaData) {
  ensureDir(path.dirname(criteriaMetaPath));

  const meta = {};

  for (const pillar of criteriaData.pillars) {
    for (const criterion of pillar.criteria) {
      meta[criterion.id] = {
        id: criterion.id,
        displayId: getCriterionVisibleId(criterion),
        legacyId: criterion.legacyId || "",
        label: criterion.label,
        points: criterion.points,
        pillarId: pillar.id,
        pillarLabel: pillar.label,
        subcategory: criterion.subcategory || "",
        subcategoryLabel: formatSubcategory(criteriaData, criterion),
        category: getCriterionCategoryLabel(criteriaData, criterion),
        slug: getCriterionDocSlug(criterion),
        appliesTo: Array.isArray(criterion.appliesTo) ? criterion.appliesTo : [],
        mandatory: criterion.mandatory === true,
        sdgs: Array.isArray(criterion.sdgs) ? criterion.sdgs : [],
        summary: normalizeApplicabilityLabels(criterion.summary || criterion.description || ""),
        description: normalizeApplicabilityLabels(criterion.description || ""),
        whyItMatters: normalizeApplicabilityLabels(criterion.whyItMatters || ""),
        url: `/generated/criteria/${getCriterionDocSlug(criterion)}.html`
      };
    }
  }

  writeJson(criteriaMetaPath, meta);
}

function main() {
  if (!fs.existsSync(criteriaPath)) {
    throw new Error(`Missing criteria file: ${criteriaPath}`);
  }

  if (!fs.existsSync(termsPath)) {
    throw new Error(`Missing terms file: ${termsPath}`);
  }

  ensureDir(docsGeneratedDir);
  ensureDir(docsCriteriaDir);
  ensureDir(docsTermsDir);
  ensureDir(docsPillarsDir);

  const criteriaData = JSON.parse(fs.readFileSync(criteriaPath, "utf8"));
  const termsData = JSON.parse(fs.readFileSync(termsPath, "utf8"));

  validateLinks(criteriaData, termsData);
  ensureManualGuidanceDocs(criteriaData);
  generateCriteriaDocs(criteriaData);
  generateTermsDocs(termsData, criteriaData);
  generatePillarDocs(criteriaData);
  generateCriteriaMeta(criteriaData);
  updateGeneratedSummary(criteriaData, termsData);
  updateBookRedirects(criteriaData);
  removeInvalidGeneratedFilenames(docsGeneratedDir);
  assertNoInvalidGeneratedFilenames(docsGeneratedDir);
  invalidateBuiltBook();

  console.log("Docs and criteria metadata generated successfully.");
}

main();
