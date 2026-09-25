import { CRITERIA_SOURCE, CRITERIA_VERSION, PROJECT_SCHEMA_NAME, PROJECT_SCHEMA_VERSION } from "./constants";
import type { ProjectStage, ProjectType, SDStandardProject } from "./types";

export interface CreateBlankProjectOptions { title: string; description?: string; stage?: ProjectStage; projectTypes?: ProjectType[]; id?: string; now?: Date }

function createId() {
  const cryptoValue = typeof globalThis.crypto !== "undefined" ? globalThis.crypto : undefined;
  if (cryptoValue && "randomUUID" in cryptoValue) return cryptoValue.randomUUID();
  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createBlankProject(options: CreateBlankProjectOptions): SDStandardProject {
  const timestamp = (options.now ?? new Date()).toISOString();
  return {
    schema: { name: PROJECT_SCHEMA_NAME, version: PROJECT_SCHEMA_VERSION },
    standard: { criteriaVersion: CRITERIA_VERSION, criteriaSource: CRITERIA_SOURCE },
    project: { id: options.id ?? createId(), title: options.title, description: options.description ?? "", stage: options.stage ?? "planning", projectTypes: [...(options.projectTypes ?? [])], createdAt: timestamp, updatedAt: timestamp },
    components: [], criteriaAssessments: [], projectNotes: "",
    passport: { purpose: "", location: "", event: "", locale: "en", heroImage: { src: "", alt: "", caption: "", credit: "" }, collaborators: [], outcomes: [], improvements: "", lastUpdated: "" },
    application: { lastView: "overview", completedSections: [], exportedAt: null, generator: { name: "SD Standard", version: "" } },
  };
}
