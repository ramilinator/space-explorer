"use client";

import { ArrowUpRight, ExternalLink, GitBranch } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "CMS Explorer",
    category: "FULL-STACK / NEXT.JS",
    description:
      "A modern headless CMS blog platform built with Next.js and Strapi, featuring dynamic content, categories, SEO metadata, and optimized media delivery.",
    tech: ["Next.js", "React", "Strapi", "Tailwind"],
    status: "DEPLOYED",
    featured: true,
  },
  {
    id: "02",
    title: "Movie Universe",
    category: "FRONTEND APPLICATION",
    description:
      "A cinematic movie discovery experience powered by a movie API with search, filtering, details, and responsive layouts.",
    tech: ["React", "API", "Tailwind"],
    status: "COMPLETED",
    featured: false,
  },
  {
    id: "03",
    title: "GitHub Explorer",
    category: "WEB APPLICATION",
    description:
      "An interactive GitHub repository explorer for discovering developers, repositories, and featured projects.",
    tech: ["React", "GitHub API", "CSS"],
    status: "COMPLETED",
    featured: false,
  },
  {
    id: "04",
    title: "Portfolio System",
    category: "CREATIVE DEVELOPMENT",
    description:
      "A cinematic developer portfolio focused on immersive storytelling, smooth scrolling, and interactive motion.",
    tech: ["Next.js", "GSAP", "Tailwind"],
    status: "ACTIVE",
    featured: false,
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#03040c] px-6 py-32 text-white md:px-12 lg:px-20"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* =====================================
            SECTION HEADER
        ====================================== */}

        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.45em] text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              MISSION ARCHIVE
            </div>

            <h2 className="text-5xl font-light tracking-tight md:text-7xl">
              Selected
              <br />
              <span className="text-white/35">Projects.</span>
            </h2>
          </div>

          <div className="max-w-sm font-mono text-[10px] leading-6 tracking-[0.15em] text-white/30">
            A collection of digital systems, interfaces, and experiences
            engineered for the modern web.
          </div>
        </div>

        {/* =====================================
            FEATURED PROJECT
        ====================================== */}

        {projects
          .filter((project) => project.featured)
          .map((project) => (
            <div
              key={project.id}
              className="group relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
            >
              <div className="grid min-h-[520px] md:grid-cols-[1.15fr_0.85fr]">
                {/* Project visual */}
                <div className="relative min-h-[350px] overflow-hidden border-b border-white/10 md:border-b-0 md:border-r">
                  {/* Grid */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(80,180,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(80,180,255,.15) 1px, transparent 1px)",
                      backgroundSize: "45px 45px",
                    }}
                  />

                  {/* Glow */}
                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

                  {/* Mock interface */}
                  <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 rotate-[-2deg] rounded-2xl border border-white/10 bg-[#080b18]/90 p-4 shadow-2xl transition duration-700 group-hover:rotate-0 group-hover:scale-[1.02]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white/20" />
                        <span className="h-2 w-2 rounded-full bg-white/20" />
                        <span className="h-2 w-2 rounded-full bg-white/20" />
                      </div>

                      <span className="font-mono text-[7px] tracking-[0.3em] text-white/20">
                        CMS.EXPLORER
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-4">
                      <div className="col-span-2 h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/10" />

                      <div className="space-y-3">
                        <div className="h-4 rounded bg-white/10" />
                        <div className="h-4 w-3/4 rounded bg-white/5" />
                        <div className="h-20 rounded bg-white/5" />
                      </div>

                      <div className="col-span-3 h-3 rounded bg-white/5" />
                      <div className="col-span-3 h-3 w-2/3 rounded bg-white/5" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 font-mono text-[8px] tracking-[0.3em] text-white/20">
                    SYSTEM // 001
                  </div>
                </div>

                {/* Project information */}
                <div className="flex flex-col justify-between p-8 md:p-12">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-300">
                        FEATURED MISSION
                      </span>

                      <span className="font-mono text-[9px] text-white/20">
                        {project.id}
                      </span>
                    </div>

                    <h3 className="mt-8 text-4xl font-light md:text-5xl">
                      {project.title}
                    </h3>

                    <p className="mt-3 font-mono text-[9px] tracking-[0.25em] text-white/30">
                      {project.category}
                    </p>

                    <p className="mt-8 text-sm leading-7 text-white/45">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mt-8 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] tracking-[0.15em] text-white/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                    <div>
                      <div className="font-mono text-[8px] tracking-[0.2em] text-white/20">
                        STATUS
                      </div>

                      <div className="mt-1 font-mono text-[9px] tracking-[0.2em] text-cyan-300">
                        ● {project.status}
                      </div>
                    </div>

                    <button className="group/button flex items-center gap-3 border border-white/10 px-5 py-3 font-mono text-[9px] tracking-[0.2em] transition hover:border-cyan-400/40 hover:bg-cyan-400/5">
                      VIEW PROJECT
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover/button:-translate-y-1 group-hover/button:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* =====================================
            PROJECT GRID
        ====================================== */}

        <div className="grid gap-6 md:grid-cols-3">
          {projects
            .filter((project) => !project.featured)
            .map((project) => (
              <article
                key={project.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition duration-500 hover:-translate-y-1 hover:border-cyan-400/20"
              >
                {/* Project number */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-300">
                    PROJECT {project.id}
                  </span>

                  <ArrowUpRight
                    size={17}
                    className="text-white/20 transition group-hover:text-cyan-300"
                  />
                </div>

                {/* Mini visual */}
                <div className="relative mt-8 h-36 overflow-hidden rounded-xl border border-white/10 bg-[#070914]">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(100,180,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.12) 1px, transparent 1px)",
                      backgroundSize: "25px 25px",
                    }}
                  />

                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_50px_rgba(34,211,238,0.1)] transition duration-500 group-hover:scale-125" />

                  <div className="absolute bottom-3 right-3 font-mono text-[7px] tracking-[0.2em] text-white/20">
                    ACTIVE
                  </div>
                </div>

                {/* Info */}
                <h3 className="mt-7 text-2xl font-light">{project.title}</h3>

                <p className="mt-2 font-mono text-[8px] tracking-[0.25em] text-white/25">
                  {project.category}
                </p>

                <p className="mt-5 text-sm leading-6 text-white/40">
                  {project.description}
                </p>

                {/* Tech */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-[8px] text-white/25">
                      #{tech.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-mono text-[8px] tracking-[0.2em] text-cyan-300/60">
                    {project.status}
                  </span>

                  <div className="flex gap-3 text-white/25">
                    <a
                      href="https://github.com/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View GitHub repository"
                      className="transition hover:text-white"
                    >
                      <GitBranch size={14} />
                    </a>

                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View live project"
                      className="transition hover:text-cyan-300"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* =====================================
            BOTTOM
        ====================================== */}

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <div className="font-mono text-[9px] tracking-[0.3em] text-white/20">
            END OF MISSION ARCHIVE
          </div>

          <a
            href="#contact"
            className="flex items-center gap-3 font-mono text-[9px] tracking-[0.25em] text-cyan-300 transition hover:text-white"
          >
            START A NEW MISSION
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
