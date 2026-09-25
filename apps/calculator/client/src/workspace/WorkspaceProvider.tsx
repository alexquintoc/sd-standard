import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  addComponent as addComponentAction,
  addCriterionAssessment as addCriterionAssessmentAction,
  addStrategy as addStrategyAction,
  createBlankProject,
  activateProjectLocally,
  closeProjectLocally,
  clearInvalidProjectStorage,
  loadSavedProject,
  listSavedProjects,
  duplicateComponent as duplicateComponentAction,
  exportProject,
  getComponentRemovalImpact,
  hasLocalProject,
  importProject,
  loadProjectLocally,
  removeComponent as removeComponentAction,
  removeCriterionAssessment as removeCriterionAssessmentAction,
  removeLocalProject,
  removeStrategy as removeStrategyAction,
  saveProjectLocally,
  updateAssessmentScope as updateAssessmentScopeAction,
  updateComponent as updateComponentAction,
  updateCriterionAssessment as updateCriterionAssessmentAction,
  updateProjectMetadata as updateProjectMetadataAction,
  updateProjectNotes as updateProjectNotesAction,
  updateProjectPassport as updateProjectPassportAction,
  updateStrategy as updateStrategyAction,
  validateProject,
  type AssessmentPatch,
  type ComponentRemovalImpact,
  type ComponentRemovalResolution,
  type ExportProjectResult,
  type ImportProjectResult,
  type ProjectComponentInput,
  type ProjectMetadataPatch,
  type ProjectPassportPatch,
  type ProjectStrategyInput,
  type ProjectValidationIssue,
  type SaveState,
  type SDStandardProject,
  type CriterionScope,
} from "../../../../../packages/standard-core/src/project";
import abiertoFixture from "../../../../../packages/standard-core/examples/abierto-project.v0.1.json";
import { createPersistenceCoordinator } from "./persistence";

type LocalState = "loading" | "none" | "valid" | "invalid";
type ImportPreview = ImportProjectResult | null;
interface WorkspaceContextValue {
  project: SDStandardProject | null;
  validation: ReturnType<typeof validateProject> | null;
  saveState: SaveState;
  localState: LocalState;
  importPreview: ImportPreview;
  createNewProject: (values: Parameters<typeof createBlankProject>[0]) => boolean;
  closeProject: () => boolean;
  reopenProject: (id: string) => boolean;
  savedProjects: () => Array<{ id: string; title: string }>;
  loadAbiertoExample: () => void;
  updateProjectMetadata: (patch: ProjectMetadataPatch) => void;
  updateProjectNotes: (notes: string) => void;
  updateProjectPassport: (patch: ProjectPassportPatch) => void;
  addComponent: (input: ProjectComponentInput) => void;
  updateComponent: (id: string, patch: Parameters<typeof updateComponentAction>[2]) => void;
  duplicateComponent: (id: string) => void;
  getRemovalImpact: (id: string) => ComponentRemovalImpact | null;
  removeComponent: (id: string, resolution: ComponentRemovalResolution) => void;
  addCriterionAssessment: (criterionId: string) => void;
  updateCriterionAssessment: (criterionId: string, patch: AssessmentPatch) => void;
  updateAssessmentScope: (criterionId: string, scope: CriterionScope) => void;
  removeCriterionAssessment: (criterionId: string) => void;
  addStrategy: (criterionId: string, input: ProjectStrategyInput) => void;
  updateStrategy: (criterionId: string, strategyId: string, patch: Parameters<typeof updateStrategyAction>[3]) => void;
  removeStrategy: (criterionId: string, strategyId: string) => void;
  saveProject: () => boolean;
  exportCurrentProject: () => { result?: ExportProjectResult; errors: ProjectValidationIssue[] };
  previewImport: (text: string) => void;
  cancelImport: () => void;
  confirmImport: () => boolean;
  clearProject: () => boolean;
  clearInvalidLocalData: () => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<SDStandardProject | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [localState, setLocalState] = useState<LocalState>("loading");
  const [importPreview, setImportPreview] = useState<ImportPreview>(null);
  const projectRef = useRef<SDStandardProject | null>(null);
  const persistenceRef = useRef<ReturnType<typeof createPersistenceCoordinator> | null>(null);
  if (!persistenceRef.current) persistenceRef.current = createPersistenceCoordinator({
    save: saveProjectLocally,
    onStateChange: (state) => { setSaveState(state); if (state === "saved") setLocalState("valid"); },
  });

  const cancelPendingSave = useCallback(() => persistenceRef.current?.cancel(), []);
  useEffect(() => {
    const stored = loadProjectLocally();
    if (stored?.success) { projectRef.current = stored.project; setProject(stored.project); setSaveState("saved"); setLocalState("valid"); }
    else if (stored && !stored.success) setLocalState("invalid");
    else setLocalState(hasLocalProject() ? "invalid" : "none");
    return cancelPendingSave;
  }, [cancelPendingSave]);

  const mutate = useCallback((operation: (current: SDStandardProject) => SDStandardProject) => {
    const current = projectRef.current;
    if (!current) return;
    const next = operation(current);
    if (next === current) return;
    projectRef.current = next;
    setProject(next);
    persistenceRef.current?.schedule(next);
  }, []);

  const replace = useCallback((next: SDStandardProject) => {
    const current = projectRef.current;
    if (current && !persistenceRef.current?.flush(current)) return false;
    if (!activateProjectLocally(next)) { setSaveState("error"); return false; }
    cancelPendingSave(); projectRef.current = next; setProject(next); setImportPreview(null);
    setSaveState("saved"); setLocalState("valid"); return true;
  }, [cancelPendingSave]);
  const saveProject = useCallback(() => {
    const current = projectRef.current;
    if (!current) return false;
    const saved = persistenceRef.current?.flush(current) ?? false;
    if (saved) setLocalState("valid");
    return saved;
  }, []);

  useEffect(() => {
    const flush = () => { if (projectRef.current) persistenceRef.current?.flush(projectRef.current); };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (projectRef.current && !persistenceRef.current?.flush(projectRef.current)) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener?.("pagehide", flush);
    window.addEventListener?.("beforeunload", beforeUnload);
    return () => { window.removeEventListener?.("pagehide", flush); window.removeEventListener?.("beforeunload", beforeUnload); };
  }, []);

  const value = useMemo<WorkspaceContextValue>(() => ({
    project,
    validation: project ? validateProject(project) : null,
    saveState,
    localState,
    importPreview,
    createNewProject: (values) => replace(createBlankProject(values)),
    savedProjects: () => listSavedProjects(),
    reopenProject: (id) => { const result = loadSavedProject(id); return result?.success ? replace(result.project) : false; },
    closeProject: () => {
      const current = projectRef.current;
      if (!current) return true;
      cancelPendingSave();
      if (!closeProjectLocally(current)) { setSaveState("error"); return false; }
      projectRef.current = null; setProject(null); setSaveState("idle"); setLocalState("none"); setImportPreview(null); return true;
    },
    loadAbiertoExample: () => { const result = importProject(abiertoFixture); if (result.success) replace(result.project); },
    updateProjectMetadata: (patch) => mutate((current) => updateProjectMetadataAction(current, patch)),
    updateProjectNotes: (notes) => mutate((current) => updateProjectNotesAction(current, notes)),
    updateProjectPassport: (patch) => mutate((current) => updateProjectPassportAction(current, patch)),
    addComponent: (input) => mutate((current) => addComponentAction(current, input)),
    updateComponent: (id, patch) => mutate((current) => updateComponentAction(current, id, patch)),
    duplicateComponent: (id) => mutate((current) => duplicateComponentAction(current, id)),
    getRemovalImpact: (id) => project ? getComponentRemovalImpact(project, id) : null,
    removeComponent: (id, resolution) => mutate((current) => removeComponentAction(current, id, resolution)),
    addCriterionAssessment: (criterionId) => mutate((current) => addCriterionAssessmentAction(current, criterionId)),
    updateCriterionAssessment: (criterionId, patch) => mutate((current) => updateCriterionAssessmentAction(current, criterionId, patch)),
    updateAssessmentScope: (criterionId, scope) => mutate((current) => updateAssessmentScopeAction(current, criterionId, scope)),
    removeCriterionAssessment: (criterionId) => mutate((current) => removeCriterionAssessmentAction(current, criterionId)),
    addStrategy: (criterionId, input) => mutate((current) => addStrategyAction(current, criterionId, input)),
    updateStrategy: (criterionId, strategyId, patch) => mutate((current) => updateStrategyAction(current, criterionId, strategyId, patch)),
    removeStrategy: (criterionId, strategyId) => mutate((current) => removeStrategyAction(current, criterionId, strategyId)),
    saveProject,
    exportCurrentProject: () => {
      if (!project) return { errors: [] }; saveProject(); const validation = validateProject(project);
      return validation.valid ? { result: exportProject(project), errors: [] } : { errors: validation.errors };
    },
    previewImport: (text) => setImportPreview(importProject(text)),
    cancelImport: () => setImportPreview(null),
    confirmImport: () => { if (!importPreview?.success) return false; return replace(importPreview.project); },
    clearProject: () => { cancelPendingSave(); const removed = removeLocalProject(); if (!removed && hasLocalProject()) { setSaveState("error"); return false; } projectRef.current = null; setProject(null); setSaveState("idle"); setLocalState("none"); setImportPreview(null); return true; },
    clearInvalidLocalData: () => { const removed = clearInvalidProjectStorage(); if (removed) { setLocalState("none"); return true; } setSaveState("error"); return false; },
  }), [cancelPendingSave, importPreview, localState, mutate, project, replace, saveProject, saveState]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext); if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider"); return value;
}
