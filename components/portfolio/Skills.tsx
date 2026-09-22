"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    category: "Frontend",
    items: [
      ["React", "95"],
      ["Next.js", "92"],
      ["JavaScript", "94"],
      ["HTML / CSS", "96"],
    ],
  },
  {
    category: "Backend",
    items: [
      ["Node.js", "78"],
      ["Strapi", "84"],
      ["REST APIs", "86"],
      ["PostgreSQL", "70"],
    ],
  },
  {
    category: "Tools",
    items: [
      ["Git", "92"],
      ["Vercel", "88"],
      ["GSAP", "82"],
      ["Tailwind", "94"],
    ],
  },
];

export default function Skills() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section.current,
          start: "top 75%",
        },
      });

      gsap.from(".skill-fill", {
        width: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 65%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={section}
      className="border-t border-white/5 bg-[#050713] py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
            02 // Technology Systems
          </p>

          <h2 className="mt-5 text-4xl font-light sm:text-6xl">
            The tools behind
            <span className="block text-white/30">the mission.</span>
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {skills.map((group) => (
            <div
              key={group.category}
              className="skill-card rounded-3xl border border-white/10 bg-white/[0.02] p-7"
            >
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-lg font-light">{group.category}</h3>

                <span className="text-[9px] tracking-[0.25em] text-cyan-300/40">
                  SYSTEM
                </span>
              </div>

              <div className="space-y-6">
                {group.items.map(([name, value]) => (
                  <div key={name}>
                    <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-white/45">{name}</span>
                      <span className="text-white/25">{value}%</span>
                    </div>

                    <div className="h-px bg-white/10">
                      <div
                        className="skill-fill h-full bg-gradient-to-r from-blue-400 to-violet-400"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
