import ProjectTypes from "@/public-site/ProjectTypes";
import AbiertoPassport from "@/public-site/ProjectPassport";
import GetInvolved from "@/public-site/GetInvolved";
import AbiertoInvitation from "@/public-site/AbiertoInvitation";
import Explore from "@/public-site/Explore";
import Pillars from "@/public-site/Pillars";
import CriteriaIndex from "@/public-site/CriteriaIndex";
import { WorkspaceProvider } from "@/workspace/WorkspaceProvider";
import { ProjectActionsProvider } from "@/public-site/ProjectActions";
import "@/public-site/public.css";
import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import About from "@/pages/About";
import BaselineDetail from "@/pages/BaselineDetail";
import Baselines from "@/pages/Baselines";
const BriefGenerator = lazy(() => import("@/pages/BriefGenerator"));
import References from "@/pages/Footprints";
const Home = lazy(() => import("@/pages/Home"));
import Index from "@/pages/Index";
import ProjectDetail from "@/pages/ProjectDetail";
import ProjectWorkspace from "@/pages/ProjectWorkspace";
import Projects from "@/pages/Projects";
const QuickProjectScan = lazy(() => import("@/pages/QuickProjectScan"));
const QuickProjectScanEmbed = lazy(() => import("@/pages/QuickProjectScanEmbed"));
const TheStandardAndTheSdgs = lazy(() => import("@/pages/TheStandardAndTheSdgs"));
import SiteChrome from "@/components/SiteChrome";
import Updates from "@/pages/Updates";
import UpdateDetail from "@/pages/UpdateDetail";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to, { replace: true });
  }, [setLocation, to]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<main className="public-page"><p role="status">Loading…</p></main>}><Switch>
      <Route path="/" component={Index} />
      <Route path="/explore/project-types" component={ProjectTypes} />
      <Route path="/about/get-involved" component={GetInvolved} />
      <Route path="/es/abierto/economia">{() => <AbiertoInvitation kind="economia" />}</Route>
      <Route path="/es/abierto/segunda-vida">{() => <AbiertoInvitation kind="segunda-vida" />}</Route>
      <Route path="/es/abierto/colabora">{() => <AbiertoInvitation kind="colabora" />}</Route>
      <Route path="/learn">{() => <Redirect to="/explore" />}</Route>
      <Route path="/imagine">{() => <Redirect to="/brief-generator" />}</Route>
      <Route path="/get-involved">{() => <Redirect to="/about/get-involved" />}</Route>
      <Route path="/explore" component={Explore} />
      <Route path="/explore/pillars" component={Pillars} />
      <Route path="/explore/criteria">{() => <CriteriaIndex />}</Route>
      <Route path="/es/criteria">{() => <CriteriaIndex spanish />}</Route>
      <Route path="/explore/sdgs" component={TheStandardAndTheSdgs} />
      <Route path="/about/updates" component={Updates} />
      <Route path="/about/updates/:slug">{params => <UpdateDetail params={params} />}</Route>
      <Route path="/about" component={About} />
      <Route path="/about/" component={About} />
      <Route path="/brief-generator" component={BriefGenerator} />
      <Route path="/brief-generator/" component={BriefGenerator} />
      <Route path="/calculator" component={Home} />
      <Route path="/calculator/" component={Home} />
      <Route path="/references" component={References} />
      <Route path="/references/" component={References} />
      <Route path="/footprints">{() => <Redirect to="/references" />}</Route>
      <Route path="/footprints/">{() => <Redirect to="/references" />}</Route>
      <Route path="/impact-snapshot" component={QuickProjectScan} />
      <Route path="/impact-snapshot/" component={QuickProjectScan} />
      <Route path="/impact-snapshot/embed" component={QuickProjectScanEmbed} />
      <Route path="/impact-snapshot/embed/" component={QuickProjectScanEmbed} />
      <Route path="/project-scan">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/project-scan/">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/quick-project-scan/embed">
        {() => <Redirect to="/impact-snapshot/embed" />}
      </Route>
      <Route path="/quick-project-scan/embed/">
        {() => <Redirect to="/impact-snapshot/embed" />}
      </Route>
      <Route path="/quick-project-scan">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/quick-project-scan/">
        {() => <Redirect to="/impact-snapshot" />}
      </Route>
      <Route path="/projects" component={Projects} />
      <Route path="/projects/" component={Projects} />
      <Route path="/projects/abierto" component={AbiertoPassport} />
      <Route path="/projects/:slug">
        {(params) => <ProjectDetail params={params} />}
      </Route>
      <Route path="/dev/project-file" component={ProjectWorkspace} />
      <Route path="/dev/project-file/" component={ProjectWorkspace} />
      <Route path="/workspace" component={ProjectWorkspace} />
      <Route path="/workspace/" component={ProjectWorkspace} />
      <Route path="/workspace/components" component={ProjectWorkspace} />
      <Route path="/workspace/components/" component={ProjectWorkspace} />
      <Route path="/workspace/criteria" component={ProjectWorkspace} />
      <Route path="/workspace/criteria/" component={ProjectWorkspace} />
      <Route path="/workspace/passport" component={ProjectWorkspace} />
      <Route path="/workspace/passport/" component={ProjectWorkspace} />
      <Route path="/workspace/project-file" component={ProjectWorkspace} />
      <Route path="/workspace/project-file/" component={ProjectWorkspace} />
      <Route path="/updates">{() => <Redirect to="/about/updates" />}</Route>
      <Route path="/updates/">{() => <Redirect to="/about/updates" />}</Route>
      <Route path="/updates/:slug">{params => <Redirect to={`/about/updates/${params.slug}`} />}</Route>
      <Route path="/the-standard-and-the-sdgs">{() => <Redirect to="/explore/sdgs" />}</Route>
      <Route path="/the-standard-and-the-sdgs/">{() => <Redirect to="/explore/sdgs" />}</Route>
      <Route path="/relationship-map">
        {() => <Redirect to="/explore/sdgs" />}
      </Route>
      <Route path="/relationship-map/">
        {() => <Redirect to="/explore/sdgs" />}
      </Route>
      <Route path="/baselines" component={Baselines} />
      <Route path="/baselines/" component={Baselines} />
      <Route path="/baselines/:slug">
        {(params) => <BaselineDetail params={params} />}
      </Route>
      <Route component={NotFound} />
    </Switch></Suspense>
  );
}

function HashScroll() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (location.length > 1 && location.endsWith("/")) { navigate(location.replace(/\/+$/, "") + window.location.search + window.location.hash, { replace: true }); return; }
    const hash = window.location.hash;
    if (location === "/" && hash === "#get-involved") { navigate("/about/get-involved", { replace: true }); return; }
    if (!hash) return;

    const scrollToTarget = () => {
      let target: HTMLElement | null = null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      target?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    };

    const timeout = window.setTimeout(scrollToTarget, 80);
    return () => window.clearTimeout(timeout);
  }, [location, navigate]);

  return null;
}

function App() {
  const [location] = useLocation();
  const chrome = location.startsWith("/impact-snapshot/embed") ||
    location.startsWith("/quick-project-scan/embed") ? (
    <Router />
  ) : (
    <SiteChrome>
      <Router />
    </SiteChrome>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider><ProjectActionsProvider><TooltipProvider>
        <Toaster />
        <HashScroll />
        {chrome}
      </TooltipProvider></ProjectActionsProvider></WorkspaceProvider>
    </QueryClientProvider>
  );
}

export default App;
