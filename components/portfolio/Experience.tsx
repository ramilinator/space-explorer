"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experience = [
  {
    year: "2026",
    title: "Frontend Development",
    description:
      "Building modern React and Next.js applications with a focus on performance, responsive interfaces and interactive experiences.",
  },
  {
    year: "2024",
    title: "Web Development",
    description:
      "Developing websites and web applications using modern JavaScript frameworks and content management systems.",
  },
  {
    year: "2022",
    title: "Freelance Projects",
    description:
      "Working on websites, UI improvements, WordPress projects and custom web solutions.",
  },
];

export default function Experience() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".experience-item", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
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
      id="experience"
      ref={section}
      className="border-t border-white/5 bg-[#050713] py-32"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
            04 // Flight Log
          </p>

          <h2 className="mt-5 text-4xl font-light sm:text-6xl">
            Experience
            <span className="text-white/30"> timeline.</span>
          </h2>
        </div>

        <div className="relative border-l border-white/10 pl-8 md:pl-12">
          {experience.map((item) => (
            <div
              key={item.year}
              className="experience-item relative mb-16 last:mb-0"
            >
              <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full border border-cyan-300/50 bg-[#050713] shadow-[0_0_15px_rgba(103,232,249,0.5)] md:-left-[53px]" />

              <p className="text-[10px] tracking-[0.35em] text-cyan-300/50">
                {item.year}
              </p>

              <h3 className="mt-3 text-2xl font-light text-white">
                {item.title}
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/35">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
