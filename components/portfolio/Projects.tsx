"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "001",
    title: "Cinematic Portfolio",
    description:
      "An immersive developer portfolio using scroll-driven storytelling, animation and futuristic interface design.",
    tech: ["Next.js", "React", "GSAP"],
  },
  {
    number: "002",
    title: "CMS Blog Platform",
    description:
      "A production-ready headless CMS architecture combining Next.js and Strapi with optimized content delivery.",
    tech: ["Next.js", "Strapi", "Tailwind"],
  },
  {
    number: "003",
    title: "Movie Explorer",
    description:
      "A responsive movie discovery experience featuring API integration, search, filtering and modern UI.",
    tech: ["React", "API", "JavaScript"],
  },
];

export default function Projects() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section.current,
          start: "top 70%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={section}
      className="border-t border-white/5 bg-[#03040d] py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
              03 // Mission Archive
            </p>

            <h2 className="mt-5 text-4xl font-light sm:text-6xl">
              Selected
              <span className="text-white/30"> projects.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-white/30">
            A selection of interfaces, applications and digital experiences
            built across different missions.
          </p>
        </div>

        <div className="space-y-5">
          {projects.map((project) => (
            <article
              key={project.number}
              className="project-card group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-7 transition duration-500 hover:border-cyan-300/20 md:p-10"
            >
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px] transition duration-500 group-hover:bg-violet-500/10" />

              <div className="relative grid gap-10 md:grid-cols-[120px_1fr_auto] md:items-center">
                <span className="text-xs tracking-[0.3em] text-cyan-300/40">
                  {project.number}
                </span>

                <div>
                  <h3 className="text-2xl font-light transition group-hover:text-cyan-100 md:text-4xl">
                    {project.title}
                  </h3>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/35">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-cyan-200/70 transition group-hover:text-cyan-200"
                >
                  View Project
                  <span className="text-base transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
