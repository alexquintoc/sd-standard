export type ProjectStage =
  | "idea"
  | "brief"
  | "planning"
  | "design-development"
  | "production"
  | "active-use"
  | "completed"
  | "post-project-review";

export type ProjectType = string;
export type CriterionRelevance = "unknown" | "low" | "medium" | "high" | "not-applicable";
export type CriterionStatus = "not-reviewed" | "considering" | "planned" | "in-progress" | "completed" | "not-applicable";
export type AssessmentResponse = "not-assessed" | "baseline" | "improved" | "verified" | "modeled";
export type StrategyStatus = "suggested" | "considering" | "selected" | "in-progress" | "completed" | "rejected";

export interface ProjectSchemaMetadata { name: "sd-standard-project"; version: "0.1.0"; [key: string]: unknown }
export interface StandardMetadata { criteriaVersion: string; criteriaSource: string; [key: string]: unknown }
export interface ProjectMetadata {
  id: string; title: string; description: string; stage: ProjectStage; projectTypes: ProjectType[];
  createdAt: string; updatedAt: string; [key: string]: unknown;
}
export interface ProjectImage { src: string; alt: string; caption: string; credit: string; [key: string]: unknown }
export interface ProjectCollaborator { id: string; name: string; role: string; credit: string; [key: string]: unknown }
export type ProjectOutcomeKind = "measured" | "estimated" | "intended";
export interface ProjectOutcome {
  id: string; label: string; value: string; unit: string; kind: ProjectOutcomeKind;
  source: string; date: string; evidenceNote: string; [key: string]: unknown;
}
export interface ProjectPassport {
  purpose: string; location: string; event: string; locale: string;
  heroImage: ProjectImage; collaborators: ProjectCollaborator[]; outcomes: ProjectOutcome[];
  improvements: string; lastUpdated: string; [key: string]: unknown;
}
export interface ProjectComponent { id: string; name: string; type: string; description: string; notes: string; image?: ProjectImage; [key: string]: unknown }
export type CriterionScope =
  | { level: "project"; componentIds: []; [key: string]: unknown }
  | { level: "component"; componentIds: string[]; [key: string]: unknown };
export interface ProjectStrategy { id: string; title: string; description: string; status: StrategyStatus; notes: string; [key: string]: unknown }
export interface CriterionAssessment {
  criterionId: string; scope: CriterionScope; relevance: CriterionRelevance; status: CriterionStatus;
  response: AssessmentResponse; strategies: ProjectStrategy[]; notes: string; [key: string]: unknown;
}
export interface ApplicationMetadata {
  lastView: string; completedSections: string[]; exportedAt: string | null;
  generator: { name: string; version: string; [key: string]: unknown }; [key: string]: unknown;
}
export interface SDStandardProject {
  schema: ProjectSchemaMetadata; standard: StandardMetadata; project: ProjectMetadata;
  components: ProjectComponent[]; criteriaAssessments: CriterionAssessment[];
  projectNotes: string; passport: ProjectPassport; application: ApplicationMetadata; [key: string]: unknown;
}
export type ValidationSeverity = "error" | "warning";
export interface ProjectValidationIssue { code: string; path: string; message: string; severity: ValidationSeverity }
export interface ProjectValidationResult { valid: boolean; errors: ProjectValidationIssue[]; warnings: ProjectValidationIssue[] }
export type ImportProjectResult =
  | { success: true; project: SDStandardProject; warnings: ProjectValidationIssue[] }
  | { success: false; errors: ProjectValidationIssue[]; warnings: ProjectValidationIssue[] };
export interface ExportProjectResult { project: SDStandardProject; json: string; filename: string }
