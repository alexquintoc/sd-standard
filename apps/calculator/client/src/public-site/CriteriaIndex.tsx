import { Link, useLocation, useSearch } from "wouter";
import { filterCriteria, localizedCriterion, scopeLabel } from "./criteria";
import { PageIntro, PageMeta } from "./PageIntro";

const pillars = ["all", "environment", "society", "culture", "finance"];
const english = ["All pillars", "Environment", "Society", "Culture", "Finance"];
const spanishLabels = ["Todos los pilares", "Medio ambiente", "Sociedad", "Cultura", "Finanzas"];

export default function CriteriaIndex({ spanish = false }: { spanish?: boolean }) {
  const search = useSearch();
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("q") || "";
  const pillar = pillars.includes(params.get("pillar") || "") ? params.get("pillar")! : "all";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(search);
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    navigate(`${location}${next.size ? `?${next}` : ""}`, { replace: true });
  };
  const rows = filterCriteria(query, pillar, spanish);
  const labels = spanish ? spanishLabels : english;
  const title = spanish ? "Criterios para diseñar con impacto." : "Find a place to make a difference.";
  const description = spanish ? "Explora los criterios del SD Standard por pilar, nombre o código." : "Browse the SD Standard criteria by pillar, name or code. Follow a criterion to the Knowledge Base for guidance and detail.";

  return <main className="public-page" lang={spanish ? "es" : "en"}>
    <PageMeta title={spanish ? "Criterios" : "Criteria"} description={description} lang={spanish ? "es" : "en"} />
    <PageIntro title={title} description={description} eyebrow={spanish ? "Explora el estándar" : "Criteria"}><Link className="public-link" href={`${spanish ? "/explore/criteria" : "/es/criteria"}${search ? `?${search}` : ""}`}>{spanish ? "View in English" : "Ver en español"}</Link></PageIntro>
    {spanish && <p className="public-count">Las traducciones de los criterios están pendientes de revisión editorial. Por ahora se muestra el texto original en inglés, identificado en cada entrada.</p>}
    <div className="public-filters"><label>{spanish ? "Buscar por código, nombre o resumen" : "Search by code, name or summary"}<input type="search" value={query} onChange={event => update("q", event.target.value)} /></label><label>{spanish ? "Pilar" : "Pillar"}<select value={pillar} onChange={event => update("pillar", event.target.value)}>{pillars.map((value, index) => <option value={value} key={value}>{labels[index]}</option>)}</select></label><button className="public-link" onClick={() => navigate(location, { replace: true })}>{spanish ? "Limpiar filtros" : "Clear filters"}</button></div>
    <p className="public-count" role="status">{rows.length} {spanish ? "criterios" : "criteria"}</p>
    <section aria-label={spanish ? "Lista de criterios" : "Criteria list"}>{rows.map(item => {
      const copy = localizedCriterion(item, spanish);
      const moreLabel = spanish ? "Más información (en inglés)" : "More information";
      return <article className="public-criterion" id={item.id} data-criterion-id={item.id} key={item.id}>
        <a className="public-code" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.displayId}: ${copy.label}${spanish ? " (en inglés)" : ""} (opens in a new tab)`}>{item.displayId}</a>
        <div lang={copy.fallback ? "en" : undefined}><h2>{copy.label}</h2><p>{copy.summary}</p>{copy.fallback && <p className="public-fallback" lang="es">Texto original en inglés · Traducción pendiente</p>}</div>
        <div className="public-criterion-meta"><p>{labels[pillars.indexOf(item.pillarId)]}</p><span className="public-badge">{scopeLabel(item.appliesTo, spanish)}</span><a className="public-link" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${moreLabel} (opens in a new tab)`}>{moreLabel} ↗</a></div>
      </article>;
    })}</section>
    {!rows.length && <p>{spanish ? "No hay resultados. Prueba otra búsqueda o elimina los filtros." : "No criteria match. Try another search or clear the filters."}</p>}
  </main>;
}
