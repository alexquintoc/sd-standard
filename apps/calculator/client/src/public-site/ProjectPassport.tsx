import { Link } from "wouter";
import { normalizeProject, type SDStandardProject } from "../../../../../packages/standard-core/src/project";
import abiertoRecord from "../../../../../content/project-passports/abierto.json";
import { PageMeta } from "./PageIntro";
import { PassportDocument } from "./PassportDocument";

const abierto = normalizeProject(abiertoRecord) as SDStandardProject;

export default function AbiertoPassport() {
  return <main className="public-page public-passport"><PageMeta lang="en" title={abierto.project.title} description={abierto.project.description} />
    <aside className="passport-review" aria-label="Editorial status"><strong>Public record under review</strong><span>Decisions are based on the current project archive. Materials, suppliers, quantities, contributors, and post-event evidence still require confirmation.</span></aside>
    <PassportDocument project={abierto} />
    <section className="public-section passport-next"><h2>Explore the complete Standard</h2><p>Review the four pillars and SD Standard criteria. This passport documents project decisions; it does not represent certification.</p><div className="public-actions"><Link className="public-button" href="/explore/criteria">View all criteria</Link><Link className="public-link" href="/explore/pillars">Explore the four pillars →</Link></div></section>
  </main>;
}
