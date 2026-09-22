"use client";

import { useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-[100] w-full">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a
          href="#top"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/5">
            <span className="absolute h-4 w-4 rounded-full bg-cyan-300/30 blur-md" />
            <span className="relative text-xs font-bold text-cyan-200">RA</span>
          </span>

          <span className="hidden text-sm font-medium tracking-[0.3em] text-white/80 sm:block">
            RAMIL<span className="text-cyan-300">.</span>DEV
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] text-white/55 transition hover:text-cyan-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-cyan-300/30 bg-cyan-300/5 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/10 md:block"
        >
          Start a Mission
        </a>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={`h-px w-5 bg-white transition ${
                open ? "translate-y-1 rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-white transition ${
                open ? "-rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`absolute left-0 top-20 w-full border-b border-white/10 bg-[#03040d]/95 px-6 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <nav className="flex flex-col py-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/5 py-4 text-xs uppercase tracking-[0.2em] text-white/70"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
