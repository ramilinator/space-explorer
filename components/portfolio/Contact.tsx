"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
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
      id="contact"
      ref={section}
      className="relative overflow-hidden border-t border-white/5 bg-[#03040d] py-40"
    >
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="contact-reveal text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
          05 // Establish Connection
        </p>

        <h2 className="contact-reveal mt-6 text-5xl font-light tracking-tight sm:text-7xl md:text-8xl">
          Ready for the
          <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
            next mission?
          </span>
        </h2>

        <p className="contact-reveal mx-auto mt-8 max-w-xl text-sm leading-8 text-white/35">
          Have a project, idea or opportunity? Let's build something remarkable
          together.
        </p>

        <div className="contact-reveal mt-10">
          <a
            href="mailto:ramilaoanan@gmail.com"
            className="inline-flex items-center gap-4 rounded-full border border-cyan-300/30 bg-cyan-300/5 px-7 py-4 text-[10px] uppercase tracking-[0.25em] text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/10"
          >
            Start a Conversation
            <span className="text-base">→</span>
          </a>
        </div>

        <div className="contact-reveal mt-20 flex flex-wrap justify-center gap-8 text-[9px] uppercase tracking-[0.25em] text-white/25">
          <a
            href="https://github.com/ramilinator"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cyan-200"
          >
            GitHub
          </a>

          <a
            href="mailto:ramilaoanan@gmail.com"
            className="transition hover:text-cyan-200"
          >
            Email
          </a>

          <span>Philippines</span>
        </div>

        <div className="mt-16 text-[8px] uppercase tracking-[0.35em] text-white/15">
          © {new Date().getFullYear()} Ramil Aoanan // All systems operational
        </div>
      </div>
    </section>
  );
}
