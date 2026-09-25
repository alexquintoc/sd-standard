import { useProjectActions } from "@/public-site/ProjectActions";
import { useState } from "react";
import { Download, FolderOpen } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ComponentsView } from "./ComponentsView";
import { CriteriaView } from "./CriteriaView";
import { ImportPreviewState, InvalidLocalProjectState, NoProjectState } from "./NoProjectState";
import { OverviewView } from "./OverviewView";
import { ProjectFileView } from "./ProjectFileView";
import { PassportView } from "./PassportView";
import { useWorkspace } from "./WorkspaceProvider";
import { formatDate, humanize, primaryButton, secondaryButton } from "./ui";

const views = [
  { label: "Overview", path: "/workspace" }, { label: "Components", path: "/workspace/components" },
  { label: "Criteria", path: "/workspace/criteria" }, { label: "Project File", path: "/workspace/project-file" },
  { label: "Passport", path: "/workspace/passport" },
];
const saveLabels = { idle: "Not saved", dirty: "Unsaved changes", saving: "Saving locally…", saved: "Saved locally", error: "Could not save locally" } as const;

export function WorkspaceShell() {
  const workspace = useWorkspace(); const { project, localState, saveState } = workspace; const [location, setLocation] = useLocation(); const { open, download } = useProjectActions(); const [startWithNewForm, setStartWithNewForm] = useState(false);

  const selected = views.find((view) => location.replace(/\/$/, "") === view.path) ?? views[0];


  if (localState === "loading") return <main className="min-h-[70dvh] bg-[#f7f5ef] px-5 py-20 text-center"><p className="font-extrabold text-[#28775e]" role="status">Loading workspace…</p></main>;
  const fileInput = null;
  if (workspace.importPreview && !project) return <>{fileInput}<ImportPreviewState onOpen={open} onConfirmed={() => setLocation("/workspace")} /></>;
  if (localState === "invalid" && !project) return <>{fileInput}<InvalidLocalProjectState onOpen={open} onStartNew={() => { if (workspace.clearInvalidLocalData()) setStartWithNewForm(true); }} /></>;
  if (!project) return <>{fileInput}<NoProjectState initialFormOpen={startWithNewForm} onOpen={open} /></>;
  return <main className="min-h-[100dvh] bg-[#f7f5ef] text-[#1f241f]">{fileInput}<header className="sticky top-0 z-30 border-b border-[#bbb5a8] bg-[#fffdf8]/95 backdrop-blur"><div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-10"><div><p className="text-xs font-extrabold text-[#28775e]">Project Workspace</p><h1 className="mt-1 truncate text-2xl font-extrabold sm:text-3xl">{project.project.title.trim() || "Untitled project"}</h1><p className="mt-1 text-sm font-bold text-[#5f5a50]">{humanize(project.project.stage)}</p><p className="mt-2 text-sm text-[#5f5a50]" aria-live="polite"><strong>{saveLabels[saveState]}</strong> · Updated {formatDate(project.project.updatedAt)}</p>{saveState === "saved" && <p className="mt-1 text-xs text-[#5f5a50]">Saved in this browser. Download the JSON file to keep a portable copy.</p>}</div><div className="flex flex-wrap gap-3"><button className={secondaryButton} type="button" onClick={open}><FolderOpen className="h-4 w-4" />Open Project</button><button className={primaryButton} type="button" onClick={download}><Download className="h-4 w-4" />Download JSON</button></div></div><nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 sm:px-8 lg:px-10" aria-label="Workspace navigation">{views.map((view) => <Link className={`whitespace-nowrap border-b-4 px-4 py-3 text-sm font-extrabold focus:outline-none focus:ring-4 focus:ring-inset focus:ring-[#85bba8] ${selected.path === view.path ? "border-[#28775e] text-[#28775e]" : "border-transparent text-[#5f5a50] hover:text-[#1f241f]"}`} href={view.path} key={view.path}>{view.label}</Link>)}</nav></header>
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10">{selected.path === "/workspace" && <OverviewView />}{selected.path === "/workspace/components" && <ComponentsView onReviewCriteria={() => setLocation("/workspace/criteria")} />}{selected.path === "/workspace/criteria" && <CriteriaView />}{selected.path === "/workspace/passport" && <PassportView onGo={setLocation} />}{selected.path === "/workspace/project-file" && <ProjectFileView onOpen={open} onImported={() => setLocation("/workspace")} />}</div>
  </main>;
}
