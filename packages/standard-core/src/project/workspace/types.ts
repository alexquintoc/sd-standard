import type { CriterionAssessment, ProjectComponent, ProjectMetadata, ProjectPassport, ProjectStrategy, SDStandardProject } from "../types";

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";
export type ComponentRemovalResolution = "remove-assessments" | "convert-to-project" | "cancel";
export interface ComponentRemovalImpact {
  componentId: string;
  referencedAssessmentIds: string[];
  orphanedAssessmentIds: string[];
}
export type ProjectMetadataPatch = Partial<Pick<ProjectMetadata, "title" | "description" | "stage" | "projectTypes">>;
export interface ProjectComponentInput { id?: string; name: string; type: string; description: string; notes: string; image?: ProjectComponent["image"] }
export type ProjectPassportPatch = Partial<ProjectPassport>;
export interface ProjectStrategyInput { id?: string; title: string; description: string; status: ProjectStrategy["status"]; notes: string }
export interface WorkspaceSnapshot { project: SDStandardProject | null; saveState: SaveState; isDirty: boolean }
export interface WorkspaceMutationOptions { now?: Date }
export interface AssessmentPatch extends Partial<Omit<CriterionAssessment, "criterionId">> {}
