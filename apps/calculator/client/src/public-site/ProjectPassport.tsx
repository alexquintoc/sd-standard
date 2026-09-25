import { Link } from "wouter";
import { normalizeProject, type SDStandardProject } from "../../../../../packages/standard-core/src/project";
import abiertoRecord from "../../../../../content/project-passports/abierto.json";
import { PageMeta } from "./PageIntro";
import { PassportDocument } from "./PassportDocument";

const abierto = normalizeProject(abiertoRecord) as SDStandardProject;

export default function AbiertoPassport() {
  return <main className="public-page public-passport"><PageMeta lang="es" title={abierto.project.title} description={abierto.project.description} />
    <aside className="passport-review" aria-label="Estado editorial"><strong>Registro público en revisión</strong><span>Las decisiones se basan en el archivo actual del proyecto. Materiales, proveedores, cantidades, colaboradores y evidencia posterior al evento aún requieren confirmación.</span></aside>
    <PassportDocument project={abierto} />
    <section className="public-section passport-next"><h2>Explora el estándar completo</h2><p>Consulta los cuatro pilares y los criterios del SD Standard. Este pasaporte documenta decisiones del proyecto; no representa una certificación.</p><div className="public-actions"><Link className="public-button" href="/es/criteria">Ver todos los criterios</Link><Link className="public-link" href="/explore/pillars">Conocer los cuatro pilares →</Link></div></section>
  </main>;
}
