import { Link } from "wouter";

const resources = [
  {
    stage: "Ideate / Start",
    title: "Brief Generator",
    description:
      "Generate a creative brief that brings environmental, social, cultural and financial considerations into the project from the start.",
    bestFor: "Early ideation, exploring possibilities and starting a new project.",
    cta: "Generate a brief",
    href: "/brief-generator",
    primary: true,
  },
  {
    stage: "Explore / Research",
    title: "References",
    description:
      "Explore projects from external sources that appear to illustrate ideas related to SD Standard criteria.",
    bestFor: "Inspiration, precedent research and seeing sustainability strategies in practice.",
    cta: "Browse references",
    href: "/references",
  },
  {
    stage: "Research / Benchmark",
    title: "Baseline Studies",
    description:
      "Use starter reference studies to understand typical impacts and establish a point of comparison for design decisions.",
    bestFor: "Research, benchmarking and understanding a project's starting conditions.",
    cta: "View baseline studies",
    href: "/baselines",
  },
  {
    stage: "Review / Improve",
    title: "Impact Snapshot",
    description:
      "Map a project description to suggested criteria and get a quick view across the Standard's four pillars.",
    bestFor: "Projects in development, design reviews and identifying possible next actions.",
    cta: "Take an Impact Snapshot",
    href: "/impact-snapshot",
  },
  {
    stage: "Assess / Document",
    title: "Evaluate",
    description:
      "Review a project criterion by criterion and record how sustainability considerations have been addressed.",
    bestFor: "Detailed self-assessment, later-stage reviews and documenting project decisions.",
    cta: "Evaluate a project",
    href: "/calculator",
  },
];

export function ToolsAndResources() {
  return (
    <section className="public-section public-resources" id="tools-and-resources">
      <div className="public-resources-intro">
        <h2>Explore tools and resources</h2>
        <p>
          Use these resources at different stages of a project, from generating ideas and
          finding relevant examples to reviewing work and documenting decisions.
        </p>
      </div>
      <div className="public-resource-grid">
        {resources.map((resource) => (
          <article
            className={`public-resource-card${resource.primary ? " is-primary" : ""}`}
            key={resource.href}
          >
            <p className="public-resource-stage">{resource.stage}</p>
            <h3>{resource.title}</h3>
            <p className="public-resource-description">{resource.description}</p>
            <div className="public-resource-use">
              <h4>Best for</h4>
              <p>{resource.bestFor}</p>
            </div>
            <Link className="public-resource-link" href={resource.href}>
              <span>{resource.cta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
      <p className="public-resources-note">
        These are suggested uses. Choose the resource that fits your project rather than
        treating them as required steps.
      </p>
    </section>
  );
}
