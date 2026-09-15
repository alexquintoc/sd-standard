import { Link } from "wouter";
import { PageIntro, PageMeta } from "./PageIntro";
import { pillars } from "./content";
import { projectTypes } from "./project-types";
import { DesignQuestions } from "./DesignQuestions";
import { ToolsAndResources } from "./ToolsAndResources";

export default function Explore() {
  return <main className="public-page">
    <PageMeta title="Explore" description="Understand the SD Standard and find criteria relevant to your design practice." />
    <PageIntro title="A wider view of design." description="Start with the framework, or follow a question from your own practice. These are different ways into the same body of knowledge." />
    <section className="public-section">
      <h2>Understand the Standard</h2>
      <div className="public-discovery">{[["Four Pillars", "/explore/pillars"], ["Criteria", "/explore/criteria"], ["Project Types", "/explore/project-types"], ["The Standard and the SDGs", "/explore/sdgs"]].map(([label, href]) => <Link href={href} key={href}>{label}<span aria-hidden="true">↗</span></Link>)}</div>
      <p className="mt-8">The Knowledge Base brings together detailed criterion guidance, terminology and references.</p>
      <a className="public-link" href="/knowledge-base" target="_blank" rel="noopener noreferrer" aria-label="Visit the Knowledge Base (opens in a new tab)">Visit the Knowledge Base ↗</a>
    </section>
    <section className="public-section" id="project-types">
      <h2>Find what is relevant to you</h2>
      <h3 className="public-small-heading">By project type</h3>
      <div className="public-type-links">{projectTypes.map(type => <Link href={`/explore/project-types#${type.id}`} key={type.id}>{type.name}</Link>)}</div>
      <h3 className="public-small-heading">By impact area</h3>
      <div className="public-actions">{pillars.map(pillar => <Link className="public-link" key={pillar.colorKey} href={`/explore/criteria?pillar=${pillar.colorKey}`}>{pillar.title} →</Link>)}</div>
    </section>
    <DesignQuestions />
    <ToolsAndResources />
  </main>;
}
