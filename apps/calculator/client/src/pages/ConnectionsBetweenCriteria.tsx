import { useEffect } from "react";
import { Link } from "wouter";
import criteriaV2 from "../../../../../packages/standard-core/src/criteria.v2.json";
import { CriterionConnections } from "@/components/CriterionConnections";
import { PageMeta } from "@/public-site/PageIntro";
import "./connections-between-criteria.css";

const pageTitle = "Connections between criteria";

export default function ConnectionsBetweenCriteria() {
  useEffect(() => {
    document.title = `${pageTitle} | SD Standard`;
  }, []);

  return (
    <main className="connections-page">
      <PageMeta
        title={pageTitle}
        description="Explore carefully curated relationships, possible pathways, and tensions between SD Standard criteria across the four pillars."
      />
      <section className="connections-intro">
        <p className="connections-eyebrow">Explore the SD Standard</p>
        <h1>{pageTitle}</h1>
        <p>
          Decisions in one pillar can shape what is possible in another. Select a criterion to explore
          a small set of human-curated relationships across Environment, Society, Culture, and Finance.
        </p>
        <p>
          A line shows a possible relationship under stated conditions. It does not mean that meeting
          one criterion automatically satisfies another or proves measurable impact.
        </p>
        <Link className="connections-text-link" href="/explore/sdgs">
          Explore the SDG visualization<span aria-hidden="true"> ↗</span>
        </Link>
      </section>

      <section className="connections-page__explorer" aria-label="Criterion connections explorer">
        <CriterionConnections criteriaData={criteriaV2} />
      </section>
    </main>
  );
}
