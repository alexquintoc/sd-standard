import type { CriterionAssessment, CriterionScope, ProjectComponent, ProjectStrategy, SDStandardProject } from "../types";
import { PROJECT_CRITERION_IDS } from "../criteria";
import { slugifyId, uniqueId } from "./ids";
import type { AssessmentPatch, ComponentRemovalImpact, ComponentRemovalResolution, ProjectComponentInput, ProjectMetadataPatch, ProjectPassportPatch, ProjectStrategyInput, WorkspaceMutationOptions } from "./types";

function changed(project: SDStandardProject, next: SDStandardProject, options?: WorkspaceMutationOptions): SDStandardProject {
  if (JSON.stringify(project) === JSON.stringify(next)) return project;
  return { ...next, project: { ...next.project, updatedAt: (options?.now ?? new Date()).toISOString() } };
}
export function updateProjectMetadata(project: SDStandardProject, patch: ProjectMetadataPatch, options?: WorkspaceMutationOptions) { return changed(project, { ...project, project: { ...project.project, ...patch } }, options); }
export function updateProjectNotes(project: SDStandardProject, projectNotes: string, options?: WorkspaceMutationOptions) { return changed(project, { ...project, projectNotes }, options); }
export function updateProjectPassport(project: SDStandardProject, patch: ProjectPassportPatch, options?: WorkspaceMutationOptions) { return changed(project, { ...project, passport: { ...project.passport, ...patch } }, options); }
export function addComponent(project: SDStandardProject, input: ProjectComponentInput, options?: WorkspaceMutationOptions): SDStandardProject {
  const base = slugifyId(input.id ?? input.name, "component");
  const component: ProjectComponent = { ...input, image: input.image ?? { src: "", alt: "", caption: "", credit: "" }, id: uniqueId(base, project.components.map((item) => item.id)) };
  return changed(project, { ...project, components: [...project.components, component] }, options);
}
export function updateComponent(project: SDStandardProject, componentId: string, patch: Partial<Omit<ProjectComponent, "id">>, options?: WorkspaceMutationOptions) {
  return changed(project, { ...project, components: project.components.map((item) => item.id === componentId ? { ...item, ...patch } : item) }, options);
}
export function duplicateComponent(project: SDStandardProject, componentId: string, options?: WorkspaceMutationOptions): SDStandardProject {
  const source = project.components.find((item) => item.id === componentId); if (!source) return project;
  return addComponent(project, { name: `${source.name} Copy`, type: source.type, description: source.description, notes: source.notes, image: source.image ? { ...source.image } : undefined, id: `${source.id}-copy` }, options);
}
export function getComponentRemovalImpact(project: SDStandardProject, componentId: string): ComponentRemovalImpact {
  const referenced = project.criteriaAssessments.filter((assessment) => assessment.scope.level === "component" && assessment.scope.componentIds.includes(componentId));
  return { componentId, referencedAssessmentIds: referenced.map((item) => item.criterionId), orphanedAssessmentIds: referenced.filter((item) => item.scope.componentIds.length === 1).map((item) => item.criterionId) };
}
export function removeComponent(project: SDStandardProject, componentId: string, resolution: ComponentRemovalResolution, options?: WorkspaceMutationOptions): SDStandardProject {
  if (resolution === "cancel" || !project.components.some((item) => item.id === componentId)) return project;
  const impact = getComponentRemovalImpact(project, componentId);
  if (impact.orphanedAssessmentIds.length > 0 && resolution !== "remove-assessments" && resolution !== "convert-to-project") return project;
  const criteriaAssessments = project.criteriaAssessments.flatMap((assessment): CriterionAssessment[] => {
    if (assessment.scope.level !== "component" || !assessment.scope.componentIds.includes(componentId)) return [assessment];
    const remaining = assessment.scope.componentIds.filter((id) => id !== componentId);
    if (remaining.length > 0) return [{ ...assessment, scope: { ...assessment.scope, componentIds: remaining } }];
    if (resolution === "remove-assessments") return [];
    return [{ ...assessment, scope: { level: "project", componentIds: [] } }];
  });
  return changed(project, { ...project, components: project.components.filter((item) => item.id !== componentId), criteriaAssessments }, options);
}
export function addCriterionAssessment(project: SDStandardProject, criterionId: string, options?: WorkspaceMutationOptions): SDStandardProject {
  if (!PROJECT_CRITERION_IDS.has(criterionId) || project.criteriaAssessments.some((item) => item.criterionId === criterionId)) return project;
  const assessment: CriterionAssessment = { criterionId, scope: { level: "project", componentIds: [] }, relevance: "unknown", status: "not-reviewed", response: "not-assessed", strategies: [], notes: "" };
  return changed(project, { ...project, criteriaAssessments: [...project.criteriaAssessments, assessment] }, options);
}
export function updateCriterionAssessment(project: SDStandardProject, criterionId: string, patch: AssessmentPatch, options?: WorkspaceMutationOptions): SDStandardProject {
  return changed(project, { ...project, criteriaAssessments: project.criteriaAssessments.map((item) => item.criterionId === criterionId ? { ...item, ...patch, criterionId } : item) }, options);
}
export function updateAssessmentScope(project: SDStandardProject, criterionId: string, scope: CriterionScope, options?: WorkspaceMutationOptions) { return updateCriterionAssessment(project, criterionId, { scope }, options); }
export function removeCriterionAssessment(project: SDStandardProject, criterionId: string, options?: WorkspaceMutationOptions) { return changed(project, { ...project, criteriaAssessments: project.criteriaAssessments.filter((item) => item.criterionId !== criterionId) }, options); }
export function addStrategy(project: SDStandardProject, criterionId: string, input: ProjectStrategyInput, options?: WorkspaceMutationOptions): SDStandardProject {
  const assessment = project.criteriaAssessments.find((item) => item.criterionId === criterionId); if (!assessment) return project;
  const base = slugifyId(input.id ?? input.title, "strategy");
  const strategy: ProjectStrategy = { ...input, id: uniqueId(base, assessment.strategies.map((item) => item.id)) };
  return updateCriterionAssessment(project, criterionId, { strategies: [...assessment.strategies, strategy] }, options);
}
export function updateStrategy(project: SDStandardProject, criterionId: string, strategyId: string, patch: Partial<Omit<ProjectStrategy, "id">>, options?: WorkspaceMutationOptions) {
  const assessment = project.criteriaAssessments.find((item) => item.criterionId === criterionId); if (!assessment) return project;
  return updateCriterionAssessment(project, criterionId, { strategies: assessment.strategies.map((item) => item.id === strategyId ? { ...item, ...patch } : item) }, options);
}
export function removeStrategy(project: SDStandardProject, criterionId: string, strategyId: string, options?: WorkspaceMutationOptions) {
  const assessment = project.criteriaAssessments.find((item) => item.criterionId === criterionId); if (!assessment) return project;
  return updateCriterionAssessment(project, criterionId, { strategies: assessment.strategies.filter((item) => item.id !== strategyId) }, options);
}
