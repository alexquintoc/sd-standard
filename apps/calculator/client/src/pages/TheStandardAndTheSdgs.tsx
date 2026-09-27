import { PageMeta } from "@/public-site/PageIntro";
import { useEffect } from "react";
import criteriaV2 from "../../../../../packages/standard-core/src/criteria.v2.json";
import { RelationshipSankey } from "@/components/RelationshipSankey";
import { Link } from "wouter";

const pageTitle = "The SD Standard and the Sustainable Development Goals";

export default function TheStandardAndTheSdgs() {
  useEffect(() => {
    document.title = `${pageTitle} | SD Standard`;
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5ef]"><PageMeta title="The Standard and the SDGs" description="Explore the connections between the SD Standard and the UN Sustainable Development Goals." />
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#5f5a50]">
          SD Standard
        </p>
        <div className="mt-3 max-w-5xl">
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-normal text-[#1f241f] sm:text-5xl lg:text-6xl">
            {pageTitle}
          </h1>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[#5f5a50] sm:text-lg">
            <p>
              The Sustainable Development Goals provide a shared global framework for addressing
              environmental, social, cultural, and economic challenges. The SD Standard translates
              that broad framework into practical criteria that designers can use when planning,
              producing, evaluating, and communicating visual communication projects.
            </p>
            <p>
              This map shows how the SD Standard&apos;s pillars and criteria connect to the SDGs.
              Use it to explore which goals are supported by specific design decisions, and how
              individual criteria can contribute to broader sustainable development outcomes.
            </p>
          </div>
          <Link className="mt-5 inline-block font-extrabold text-[#205f4b] underline decoration-2 underline-offset-4" href="/explore/connections">
            Explore connections between criteria <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="mt-8">
          <RelationshipSankey criteriaData={criteriaV2} />
        </div>
      </section>
    </main>
  );
}
