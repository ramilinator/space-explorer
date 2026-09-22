"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section.current,
          start: "top 75%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={section}
      className="relative overflow-hidden border-t border-white/5 bg-[#03040d] py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="about-reveal">
            <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
              01 // Mission Profile
            </p>

            <h2 className="mt-5 text-4xl font-light tracking-[-0.02em] text-white sm:text-6xl">
              Building digital
              <br />
              <span className="text-white/35">experiences.</span>
            </h2>
          </div>

          <div className="about-reveal">
            <p className="max-w-3xl text-lg leading-9 text-white/50">
              I'm Ramil Aoanan, a frontend developer focused on creating modern,
              responsive and interactive web experiences. I enjoy combining
              clean engineering with strong visual design to build websites that
              feel as good as they function.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                ["05+", "Years"],
                ["20+", "Projects"],
                ["∞", "Curiosity"],
                ["24/7", "Learning"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#070914] p-6">
                  <p className="text-2xl font-light text-cyan-200">{value}</p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-white/30">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
