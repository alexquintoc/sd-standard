import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProjects, getPillarLabel, type ProjectSummary } from "@/lib/projects";
import { PageMeta } from "@/public-site/PageIntro";

export default function References() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetchProjects()
      .then((nextProjects) => {
        setProjects(nextProjects);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <PageMeta
        title="References"
        description="Explore external design projects that offer useful references for ideas related to SD Standard criteria."
      />
      <div className="mx-auto max-w-7xl">
        <header className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
            References
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
            Ideas in practice
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
            Explore projects from external sources that appear to illustrate ideas related to
            one or more SD Standard criteria. Use them for inspiration and precedent research,
            not as verified examples of sustainability performance.
          </p>
        </header>

        <aside className="mt-8 rounded-lg border border-[#d9d4c8] bg-[#e5efe9] p-6 text-[#1f241f]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Help expand the reference library</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4f5a55]">
                Suggest an external project that may offer a useful reference for designers.
                Inclusion does not indicate certification, endorsement or formal evaluation.
              </p>
            </div>
            <a
              href="mailto:info@sdstandard.org?subject=Suggest%20a%20project%20reference"
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-[#28775e] bg-[#fffdf8] px-5 py-3 text-sm font-extrabold text-[#28775e] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              Suggest a project
            </a>
          </div>
        </aside>

        {status === "loading" ? (
          <div className="flex min-h-64 items-center justify-center text-[#5f5a50]" role="status">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" aria-hidden="true" />
            Loading references...
          </div>
        ) : null}

        {status === "error" ? (
          <div className="mt-8 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 text-[#5f5a50]" role="alert">
            References could not be loaded.
          </div>
        ) : null}

        {status === "ready" ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Project references">
            {projects.map((project) => (
              <a
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-lg border border-[#d9d4c8] bg-[#fffdf8] shadow-[0_18px_50px_rgba(45,39,28,0.08)] transition hover:-translate-y-1 hover:border-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
                key={project.slug}
              >
                <img
                  src={project.coverImage}
                  alt=""
                  className="aspect-[3/2] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2 text-sm font-bold text-[#5f5a50]">
                    <span>{project.year}</span>
                    <span>{project.location}</span>
                    <span>{project.projectType}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold">{project.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#5f5a50]">{project.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Related pillars">
                    {project.pillars.map((pillar) => (
                      <span
                        className="rounded-full border border-[#d9d4c8] px-3 py-1 text-xs font-bold text-[#5f5a50]"
                        key={pillar}
                      >
                        {getPillarLabel(pillar)}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center text-sm font-extrabold text-[#28775e]">
                    View reference
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
