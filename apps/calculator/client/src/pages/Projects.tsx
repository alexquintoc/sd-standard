import { PageMeta } from "@/public-site/PageIntro";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProjects, getPillarLabel, type ProjectSummary } from "@/lib/projects";

export default function Projects() {
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
      <PageMeta title="Projects" description="Projects and case studies explored through the SD Standard, including the Abierto Project Passport." /><div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
            SD Standard
          </p>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
            Projects
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
            Explore projects and case studies mapped to SD Standard pillars, criteria,
            scores, and ratings.
          </p>
        </header>

        <section className="public-passport-entry" aria-label="Project Passports" id="projects"><p className="public-eyebrow">Project Passport · In development</p><h2>SD Standard × Abierto de Diseño</h2><p>An installation presenting the framework as a communication tool and a material experiment.</p><p className="public-count">Exhibition installation · Mexico City · September 25 – October 4, 2026</p><Link className="public-link" href="/projects/abierto">View Project Passport →</Link></section><h2 className="public-gallery-heading" id="case-studies">Project case studies</h2>
        <aside className="mb-8 rounded-lg border border-[#d9d4c8] bg-[#e5efe9] p-6 text-[#1f241f]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Compare projects against baseline studies</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4f5a55]">
                Baselines provide reference assumptions for common design formats, making it easier
                to understand where a project performs above or below an expected model.
              </p>
            </div>
            <a
              href="/baselines"
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-[#28775e] bg-[#fffdf8] px-5 py-3 text-sm font-extrabold text-[#28775e] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              View baselines
            </a>
          </div>
        </aside>

        {status === "loading" ? (
          <div className="flex min-h-64 items-center justify-center text-[#5f5a50]">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#28775e]" />
            Loading projects...
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 text-[#5f5a50]">
            Projects could not be loaded.
          </div>
        ) : null}

        {status === "ready" ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Projects">
            {projects.map((project) => (
              <a
                href={`/projects/${project.slug}`}
                className="public-project-card group focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
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
                  <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-extrabold text-white">
                      {project.rating}
                    </span>
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
                    View project
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
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
