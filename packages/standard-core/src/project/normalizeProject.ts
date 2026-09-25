import type { SDStandardProject } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function uniqueStrings(value: unknown): string[] { return Array.isArray(value) ? Array.from(new Set(value.filter((item): item is string => typeof item === "string"))) : []; }
const text = (value: unknown) => typeof value === "string" ? value : "";
function image(value: unknown) { const item = isRecord(value) ? value : {}; return { ...item, src: text(item.src), alt: text(item.alt), caption: text(item.caption), credit: text(item.credit) }; }

export function normalizeProject(value: unknown, now = new Date()): unknown {
  if (!isRecord(value)) return value;
  const project = isRecord(value.project) ? value.project : {};
  const application = isRecord(value.application) ? value.application : {};
  const generator = isRecord(application.generator) ? application.generator : {};
  const components = Array.isArray(value.components) ? value.components.map((item) => isRecord(item) ? { ...item, description: text(item.description), notes: text(item.notes), image: image(item.image) } : item) : [];
  const assessments = Array.isArray(value.criteriaAssessments) ? value.criteriaAssessments.map((item) => {
    if (!isRecord(item)) return item;
    const strategies = Array.isArray(item.strategies) ? item.strategies.map((strategy) => isRecord(strategy) ? { ...strategy, description: typeof strategy.description === "string" ? strategy.description : "", notes: typeof strategy.notes === "string" ? strategy.notes : "" } : strategy) : [];
    return { ...item, strategies, notes: typeof item.notes === "string" ? item.notes : "" };
  }) : [];
  const normalizedProject: Record<string, unknown> = { ...project, description: typeof project.description === "string" ? project.description : "", projectTypes: uniqueStrings(project.projectTypes) };
  const passport = isRecord(value.passport) ? value.passport : {};
  const collaborators = Array.isArray(passport.collaborators) ? passport.collaborators.map((item) => isRecord(item) ? { ...item, id: text(item.id), name: text(item.name), role: text(item.role), credit: text(item.credit) } : item) : [];
  const outcomes = Array.isArray(passport.outcomes) ? passport.outcomes.map((item) => isRecord(item) ? { ...item, id: text(item.id), label: text(item.label), value: text(item.value), unit: text(item.unit), kind: ["measured", "estimated", "intended"].includes(text(item.kind)) ? item.kind : "intended", source: text(item.source), date: text(item.date), evidenceNote: text(item.evidenceNote) } : item) : [];
  const normalized = {
    ...value,
    project: normalizedProject,
    components,
    criteriaAssessments: assessments,
    projectNotes: typeof value.projectNotes === "string" ? value.projectNotes : "",
    passport: { ...passport, purpose: text(passport.purpose), location: text(passport.location), event: text(passport.event), locale: text(passport.locale) || "en", heroImage: image(passport.heroImage), collaborators, outcomes, improvements: text(passport.improvements), lastUpdated: text(passport.lastUpdated) },
    application: { ...application, lastView: typeof application.lastView === "string" ? application.lastView : "overview", completedSections: uniqueStrings(application.completedSections), exportedAt: typeof application.exportedAt === "string" ? application.exportedAt : null, generator: { ...generator, name: typeof generator.name === "string" ? generator.name : "SD Standard", version: typeof generator.version === "string" ? generator.version : "" } },
  };
  const comparable = (candidate: Record<string, unknown>) => {
    const metadata = isRecord(candidate.project) ? candidate.project : {};
    return { ...candidate, project: { ...metadata, updatedAt: "" } };
  };
  if (isRecord(value.project) && typeof value.project.updatedAt === "string" && JSON.stringify(comparable(value)) !== JSON.stringify(comparable(normalized))) {
    normalized.project.updatedAt = now.toISOString();
  }
  return normalized;
}

export function projectsEqualIgnoringUpdatedAt(left: SDStandardProject, right: SDStandardProject): boolean {
  const omit = (project: SDStandardProject) => ({ ...project, project: { ...project.project, updatedAt: "" } });
  return JSON.stringify(omit(left)) === JSON.stringify(omit(right));
}
