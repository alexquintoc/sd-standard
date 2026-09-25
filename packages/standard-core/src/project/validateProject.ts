import { ASSESSMENT_RESPONSE_VALUES, CRITERIA_SOURCE, CRITERIA_VERSION, CRITERION_RELEVANCE_VALUES, CRITERION_STATUS_VALUES, PROJECT_SCHEMA_NAME, PROJECT_STAGES, STRATEGY_STATUS_VALUES, SUPPORTED_PROJECT_SCHEMA_VERSIONS } from "./constants";
import { PROJECT_CRITERION_IDS } from "./criteria";
import type { ProjectValidationIssue, ProjectValidationResult, SDStandardProject } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isIsoDate = (value: unknown): value is string => isString(value) && !Number.isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}T/.test(value);
const includes = <T extends string>(values: readonly T[], value: unknown): value is T => isString(value) && values.includes(value as T);

export function validateProject(value: unknown): ProjectValidationResult {
  const errors: ProjectValidationIssue[] = [];
  const warnings: ProjectValidationIssue[] = [];
  const error = (code: string, path: string, message: string) => errors.push({ code, path, message, severity: "error" });
  const warning = (code: string, path: string, message: string) => warnings.push({ code, path, message, severity: "warning" });
  if (!isRecord(value)) { error("INVALID_ROOT", "", "The project file must contain a JSON object."); return { valid: false, errors, warnings }; }

  if (!isRecord(value.schema)) error("MISSING_SECTION", "schema", "Schema metadata is required.");
  else {
    if (value.schema.name !== PROJECT_SCHEMA_NAME) error("INVALID_SCHEMA_NAME", "schema.name", `Schema name must be "${PROJECT_SCHEMA_NAME}".`);
    if (!includes(SUPPORTED_PROJECT_SCHEMA_VERSIONS, value.schema.version)) error("UNSUPPORTED_SCHEMA_VERSION", "schema.version", `Schema version ${String(value.schema.version)} is not supported.`);
  }
  if (!isRecord(value.standard)) error("MISSING_SECTION", "standard", "Standard metadata is required.");
  else {
    if (!isString(value.standard.criteriaVersion) || !value.standard.criteriaVersion) error("MISSING_CRITERIA_VERSION", "standard.criteriaVersion", "A criteria version is required.");
    else if (value.standard.criteriaVersion !== CRITERIA_VERSION) warning("CRITERIA_VERSION_MISMATCH", "standard.criteriaVersion", `This project references ${value.standard.criteriaVersion}; this application validates against ${CRITERIA_VERSION}.`);
    if (!isString(value.standard.criteriaSource) || !value.standard.criteriaSource) error("MISSING_CRITERIA_SOURCE", "standard.criteriaSource", "A criteria source is required.");
    else if (value.standard.criteriaSource !== CRITERIA_SOURCE) warning("CRITERIA_SOURCE_MISMATCH", "standard.criteriaSource", `This project references ${value.standard.criteriaSource}; the canonical source is ${CRITERIA_SOURCE}.`);
  }
  if (!isRecord(value.project)) error("MISSING_SECTION", "project", "Project metadata is required.");
  else {
    if (!isString(value.project.id) || !value.project.id.trim()) error("MISSING_PROJECT_ID", "project.id", "The project must have an ID.");
    if (!isString(value.project.title) || !value.project.title.trim()) error("MISSING_PROJECT_TITLE", "project.title", "The project must have a title.");
    if (!includes(PROJECT_STAGES, value.project.stage)) error("INVALID_PROJECT_STAGE", "project.stage", `Project stage must be one of: ${PROJECT_STAGES.join(", ")}.`);
    if (!isIsoDate(value.project.createdAt)) error("INVALID_DATE", "project.createdAt", "Created date must be a valid ISO date string.");
    if (!isIsoDate(value.project.updatedAt)) error("INVALID_DATE", "project.updatedAt", "Updated date must be a valid ISO date string.");
    if (!Array.isArray(value.project.projectTypes) || value.project.projectTypes.some((item) => !isString(item))) error("INVALID_PROJECT_TYPES", "project.projectTypes", "Project types must be an array of strings.");
  }

  const componentIds = new Set<string>();
  if (!Array.isArray(value.components)) error("MISSING_SECTION", "components", "Components must be an array.");
  else value.components.forEach((component, index) => {
    const path = `components[${index}]`;
    if (!isRecord(component)) { error("INVALID_COMPONENT", path, "Each component must be an object."); return; }
    if (!isString(component.id) || !component.id.trim()) error("MISSING_COMPONENT_ID", `${path}.id`, "Each component must have an ID.");
    else if (componentIds.has(component.id)) error("DUPLICATE_COMPONENT_ID", `${path}.id`, `Component ID ${component.id} is used more than once.`);
    else componentIds.add(component.id);
    if (!isString(component.name) || !component.name.trim()) error("MISSING_COMPONENT_NAME", `${path}.name`, "Each component must have a name.");
    if (!isString(component.type) || !component.type.trim()) error("MISSING_COMPONENT_TYPE", `${path}.type`, "Each component must have a type.");
    if (component.image !== undefined && !isRecord(component.image)) error("INVALID_IMAGE", `${path}.image`, "Component image metadata must be an object.");
  });

  const assessedCriterionIds = new Set<string>();
  if (!Array.isArray(value.criteriaAssessments)) error("MISSING_SECTION", "criteriaAssessments", "Criteria assessments must be an array.");
  else value.criteriaAssessments.forEach((assessment, index) => {
    const path = `criteriaAssessments[${index}]`;
    if (!isRecord(assessment)) { error("INVALID_ASSESSMENT", path, "Each criterion assessment must be an object."); return; }
    if (!isString(assessment.criterionId) || !PROJECT_CRITERION_IDS.has(assessment.criterionId)) error("UNKNOWN_CRITERION", `${path}.criterionId`, `Criterion ${String(assessment.criterionId)} does not exist in criteria.v2.json.`);
    else if (assessedCriterionIds.has(assessment.criterionId)) error("DUPLICATE_CRITERION_ASSESSMENT", `${path}.criterionId`, `Criterion ${assessment.criterionId} is assessed more than once.`);
    else assessedCriterionIds.add(assessment.criterionId);
    if (!includes(CRITERION_RELEVANCE_VALUES, assessment.relevance)) error("INVALID_RELEVANCE", `${path}.relevance`, "Criterion relevance is not recognized.");
    if (!includes(CRITERION_STATUS_VALUES, assessment.status)) error("INVALID_CRITERION_STATUS", `${path}.status`, "Criterion status is not recognized.");
    if (!includes(ASSESSMENT_RESPONSE_VALUES, assessment.response)) error("INVALID_ASSESSMENT_RESPONSE", `${path}.response`, "Assessment response is not recognized.");
    if (!isRecord(assessment.scope)) error("INVALID_SCOPE", `${path}.scope`, "Criterion scope must be an object.");
    else {
      const ids = assessment.scope.componentIds;
      if (assessment.scope.level !== "project" && assessment.scope.level !== "component") error("INVALID_SCOPE_LEVEL", `${path}.scope.level`, "Scope level must be project or component.");
      if (!Array.isArray(ids) || ids.some((id) => !isString(id))) error("INVALID_SCOPE_COMPONENTS", `${path}.scope.componentIds`, "Scope component IDs must be an array of strings.");
      else if (assessment.scope.level === "project" && ids.length > 0) error("PROJECT_SCOPE_HAS_COMPONENTS", `${path}.scope.componentIds`, "Project-wide assessments cannot include component IDs.");
      else if (assessment.scope.level === "component" && ids.length === 0) error("COMPONENT_SCOPE_EMPTY", `${path}.scope.componentIds`, "Component-level assessments must include at least one component ID.");
      else {
        const seen = new Set<string>();
        ids.forEach((id, idIndex) => {
          if (!componentIds.has(id)) error("UNKNOWN_COMPONENT_REFERENCE", `${path}.scope.componentIds[${idIndex}]`, `Component ${id} does not exist in this project.`);
          if (seen.has(id)) warning("DUPLICATE_COMPONENT_REFERENCE", `${path}.scope.componentIds[${idIndex}]`, `Component ${id} is referenced more than once.`);
          seen.add(id);
        });
      }
    }
    if (!Array.isArray(assessment.strategies)) error("INVALID_STRATEGIES", `${path}.strategies`, "Strategies must be an array.");
    else {
      const strategyIds = new Set<string>();
      assessment.strategies.forEach((strategy, strategyIndex) => {
        const strategyPath = `${path}.strategies[${strategyIndex}]`;
        if (!isRecord(strategy)) { error("INVALID_STRATEGY", strategyPath, "Each strategy must be an object."); return; }
        if (!isString(strategy.id) || !strategy.id.trim()) error("MISSING_STRATEGY_ID", `${strategyPath}.id`, "Each strategy must have an ID.");
        else if (strategyIds.has(strategy.id)) error("DUPLICATE_STRATEGY_ID", `${strategyPath}.id`, `Strategy ID ${strategy.id} is used more than once in this assessment.`);
        else strategyIds.add(strategy.id);
        if (!isString(strategy.title) || !strategy.title.trim()) error("MISSING_STRATEGY_TITLE", `${strategyPath}.title`, "Each strategy must have a title.");
        if (!includes(STRATEGY_STATUS_VALUES, strategy.status)) error("INVALID_STRATEGY_STATUS", `${strategyPath}.status`, "Strategy status is not recognized.");
      });
    }
  });
  if (!isString(value.projectNotes)) error("INVALID_PROJECT_NOTES", "projectNotes", "Project notes must be a string.");
  if (!isRecord(value.passport)) error("MISSING_SECTION", "passport", "Passport metadata is required.");
  else {
    for (const field of ["purpose", "location", "event", "locale", "improvements", "lastUpdated"] as const) if (!isString(value.passport[field])) error("INVALID_PASSPORT_FIELD", `passport.${field}`, `${field} must be a string.`);
    if (!isRecord(value.passport.heroImage)) error("INVALID_IMAGE", "passport.heroImage", "Hero image metadata must be an object.");
    if (!Array.isArray(value.passport.collaborators)) error("INVALID_COLLABORATORS", "passport.collaborators", "Collaborators must be an array.");
    else value.passport.collaborators.forEach((item, index) => { if (!isRecord(item) || !isString(item.id) || !isString(item.name) || !isString(item.role) || !isString(item.credit)) error("INVALID_COLLABORATOR", `passport.collaborators[${index}]`, "Each collaborator must have string id, name, role, and credit fields."); });
    if (!Array.isArray(value.passport.outcomes)) error("INVALID_OUTCOMES", "passport.outcomes", "Outcomes must be an array.");
    else value.passport.outcomes.forEach((item, index) => { if (!isRecord(item) || !isString(item.id) || !isString(item.label) || !isString(item.value) || !isString(item.unit) || !includes(["measured", "estimated", "intended"] as const, item.kind) || !isString(item.source) || !isString(item.date) || !isString(item.evidenceNote)) error("INVALID_OUTCOME", `passport.outcomes[${index}]`, "Each outcome must include its label, value, unit, kind, source, date, and evidence note."); });
  }
  if (!isRecord(value.application)) error("MISSING_SECTION", "application", "Application metadata is required.");
  else {
    if (!Array.isArray(value.application.completedSections) || value.application.completedSections.some((item) => !isString(item))) error("INVALID_COMPLETED_SECTIONS", "application.completedSections", "Completed sections must be an array of strings.");
    if (value.application.exportedAt !== null && !isIsoDate(value.application.exportedAt)) error("INVALID_DATE", "application.exportedAt", "Exported date must be null or a valid ISO date string.");
    if (!isRecord(value.application.generator)) error("INVALID_GENERATOR", "application.generator", "Generator metadata is required.");
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function isSDStandardProject(value: unknown): value is SDStandardProject { return validateProject(value).valid; }
