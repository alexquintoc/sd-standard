import { Link } from "wouter";
import { normalizeProject, type SDStandardProject } from "../../../../../packages/standard-core/src/project";
import abiertoRecord from "../../../../../content/project-passports/abierto.json";
import arbolesRecord from "../../../../../content/project-passports/arboles-para-la-naturaleza-bid2026-preliminary.json";
import ykuaRecord from "../../../../../content/project-passports/ykua-bid2026-preliminary.json";
import { PageMeta } from "./PageIntro";
import { PassportDocument } from "./PassportDocument";

const abierto = normalizeProject(abiertoRecord) as SDStandardProject;
const arboles = normalizeProject(arbolesRecord) as SDStandardProject;
const ykua = normalizeProject(ykuaRecord) as SDStandardProject;

export default function AbiertoPassport() {
  return <main className="public-page public-passport"><PageMeta lang="en" title={abierto.project.title} description={abierto.project.description} />
    <aside className="passport-review" aria-label="Editorial status"><strong>Public record under review</strong><span>Decisions are based on the current project archive. Materials, suppliers, quantities, contributors, and post-event evidence still require confirmation.</span></aside>
    <PassportDocument project={abierto} />
    <section className="public-section passport-next"><h2>Explore the complete Standard</h2><p>Review the four pillars and SD Standard criteria. This passport documents project decisions; it does not represent certification.</p><div className="public-actions"><Link className="public-button" href="/explore/criteria">View all criteria</Link><Link className="public-link" href="/explore/pillars">Explore the four pillars →</Link></div></section>
  </main>;
}

export function YkuaPassport() {
  return <main className="public-page public-passport"><PageMeta lang="es" title={ykua.project.title} description={ykua.project.description} />
    <aside className="passport-review" aria-label="Estado editorial"><strong>Evaluación preliminar para conversación</strong><span>Este registro distingue hechos documentados de información pendiente. No es una certificación, puntuación ni afirmación de sostenibilidad.</span></aside>
    <PassportDocument project={ykua} />
    <section className="public-section passport-next"><h2>Explora el estándar completo</h2><p>Consulta los cuatro pilares y los criterios del SD Standard. Este pasaporte se puede actualizar durante la conversación y volver a exportar desde el Workspace.</p><div className="public-actions"><Link className="public-button" href="/es/criteria">Ver todos los criterios</Link><Link className="public-link" href="/explore/pillars">Explorar los cuatro pilares →</Link></div></section>
  </main>;
}

export function ArbolesPassport() {
  return <main className="public-page public-passport"><PageMeta lang="es" title={arboles.project.title} description={arboles.project.description} />
    <aside className="passport-review" aria-label="Estado editorial"><strong>Evaluación preliminar para conversación — BID 2026</strong><span>Evaluación exploratoria basada en información pública. Los hallazgos requieren verificación con el equipo de diseño. Este documento no constituye certificación del SD Standard.</span></aside>
    <PassportDocument project={arboles} />
    <section className="public-section passport-next"><h2>Explora el estándar completo</h2><p>Consulta los cuatro pilares y los criterios del SD Standard. Este pasaporte distingue información publicada, aprendizaje, decisiones y resultados ecológicos sin convertir la intención ambiental en impacto verificado.</p><div className="public-actions"><Link className="public-button" href="/es/criteria">Ver todos los criterios</Link><Link className="public-link" href="/explore/pillars">Explorar los cuatro pilares →</Link></div></section>
  </main>;
}
