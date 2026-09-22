"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    name: "NEBULA",
    code: "NX-07",
    distance: "1,240 LY",
    description: "Deep-space nebula research zone",
  },
  {
    name: "ORION",
    code: "OR-19",
    distance: "1,344 LY",
    description: "Outer Orion exploration sector",
  },
  {
    name: "ANDROMEDA",
    code: "AD-01",
    distance: "2.53 MLY",
    description: "Intergalactic exploration destination",
  },
];

export default function CinematicHero() {
  const root = useRef<HTMLDivElement>(null);

  const welcome = useRef<HTMLDivElement>(null);
  const pilot = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLDivElement>(null);
  const system = useRef<HTMLDivElement>(null);
  const countdown = useRef<HTMLDivElement>(null);

  const planet = useRef<HTMLDivElement>(null);
  const cockpit = useRef<HTMLDivElement>(null);
  const rocket = useRef<HTMLDivElement>(null);
  const engine = useRef<HTMLDivElement>(null);
  const launchGlow = useRef<HTMLDivElement>(null);

  const selectedDestination = useRef<HTMLSpanElement>(null);
  const countNumber = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /* ---------------------------------------
         Initial state
      --------------------------------------- */

      gsap.set(q(".hero-scene"), {
        autoAlpha: 0,
      });

      gsap.set(welcome.current, {
        autoAlpha: 1,
      });

      gsap.set(q(".welcome-line"), {
        y: 30,
        autoAlpha: 0,
      });

      gsap.set(q(".pilot-line"), {
        y: 25,
        autoAlpha: 0,
      });

      gsap.set(q(".destination-line"), {
        y: 20,
        autoAlpha: 0,
      });

      gsap.set(q(".system-line"), {
        x: -20,
        autoAlpha: 0,
      });

      gsap.set(q(".countdown-line"), {
        y: 20,
        autoAlpha: 0,
      });

      gsap.set(q(".rocket"), {
        y: 100,
        scale: 0.8,
        rotation: 0,
        autoAlpha: 0,
      });

      gsap.set(q(".planet"), {
        scale: 0.75,
        autoAlpha: 0.5,
      });

      gsap.set(q(".cockpit-frame"), {
        scale: 0.96,
        autoAlpha: 0.6,
      });

      gsap.set(q(".engine-flame"), {
        scaleY: 0.3,
        transformOrigin: "50% 100%",
      });

      gsap.set(q(".launch-glow"), {
        scale: 0.3,
        autoAlpha: 0,
      });

      /* ---------------------------------------
         Ambient animations
      --------------------------------------- */

      gsap.to(q(".star"), {
        opacity: "random(0.25, 1)",
        duration: "random(1.5, 4)",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.03,
          from: "random",
        },
        ease: "sine.inOut",
      });

      gsap.to(q(".planet-glow"), {
        scale: 1.08,
        opacity: 0.8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(q(".engine-flame"), {
        scaleY: 1,
        scaleX: 0.85,
        duration: 0.12,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      /* ---------------------------------------
         Main cinematic timeline
      --------------------------------------- */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=6500",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      /* =======================================
         SCENE 1 — DEEP SPACE
      ======================================= */

      timeline
        .to(q(".hero-background"), {
          scale: 1.05,
          duration: 1,
          ease: "none",
        })
        .to(
          q(".hero-star-layer"),
          {
            scale: 1.2,
            duration: 1,
            ease: "none",
          },
          "<",
        );

      /* =======================================
         SCENE 2 — WELCOME
      ======================================= */

      timeline
        .to(
          q(".welcome-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.18,
            ease: "power3.out",
          },
          "+=0.3",
        )
        .to({}, { duration: 0.8 })
        .to(welcome.current, {
          autoAlpha: 0,
          scale: 1.05,
          duration: 0.6,
          ease: "power2.in",
        });

      /* =======================================
         SCENE 3 — PLANET / COCKPIT
      ======================================= */

      timeline
        .set(pilot.current, {
          autoAlpha: 1,
        })
        .to(
          planet.current,
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          cockpit.current,
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          q(".pilot-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
          },
          "+=0.3",
        )
        .to({}, { duration: 1 })
        .to(pilot.current, {
          autoAlpha: 0,
          duration: 0.6,
        });

      /* =======================================
         SCENE 4 — DESTINATION MAP
      ======================================= */

      const randomDestination =
        destinations[Math.floor(Math.random() * destinations.length)];

      if (selectedDestination.current) {
        selectedDestination.current.textContent = randomDestination.name;
      }

      timeline
        .set(destination.current, {
          autoAlpha: 1,
        })
        .fromTo(
          q(".map-grid"),
          {
            scale: 1.3,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
        )
        .to(
          q(".destination-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .to(q(".map-target"), {
          scale: 1.15,
          opacity: 1,
          duration: 0.5,
          repeat: 2,
          yoyo: true,
          ease: "sine.inOut",
        })
        .to({}, { duration: 0.8 })
        .to(destination.current, {
          autoAlpha: 0,
          duration: 0.5,
        });

      /* =======================================
         SCENE 5 — SYSTEM CHECK
      ======================================= */

      timeline
        .set(system.current, {
          autoAlpha: 1,
        })
        .to(q(".system-line"), {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          stagger: 0.22,
          ease: "power2.out",
        })
        .to(q(".system-progress"), {
          width: "100%",
          duration: 1.5,
          ease: "power2.inOut",
        })
        .to({}, { duration: 0.8 })
        .to(system.current, {
          autoAlpha: 0,
          duration: 0.5,
        });

      /* =======================================
         SCENE 6 — COUNTDOWN
      ======================================= */

      timeline
        .set(countdown.current, {
          autoAlpha: 1,
        })
        .to(q(".countdown-line"), {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power3.out",
        })
        .set(countNumber.current, {
          textContent: "10",
        })
        .to({}, { duration: 0.4 })
        .call(() => {
          if (!countNumber.current) return;

          let current = 10;

          const interval = window.setInterval(() => {
            current -= 1;

            if (countNumber.current) {
              countNumber.current.textContent = String(Math.max(current, 0));
            }

            if (current <= 0) {
              window.clearInterval(interval);
            }
          }, 180);
        })
        .to({}, { duration: 2.2 })
        .to(countdown.current, {
          autoAlpha: 0,
          duration: 0.4,
        });

      /* =======================================
         SCENE 7 — ROCKET LAUNCH
      ======================================= */

      timeline
        .set(rocket.current, {
          autoAlpha: 1,
          y: 100,
          scale: 0.8,
        })
        .to(rocket.current, {
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        })
        .to(q(".launch-status"), {
          autoAlpha: 1,
          duration: 0.4,
        })
        .to(
          launchGlow.current,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "<",
        )
        .to(rocket.current, {
          y: -900,
          scale: 1.35,
          duration: 2,
          ease: "power3.in",
        })
        .to(
          q(".launch-flash"),
          {
            opacity: 1,
            duration: 0.15,
          },
          "-=1.2",
        )
        .to(q(".launch-flash"), {
          opacity: 0,
          duration: 0.5,
        })
        .to(
          q(".hero-star-layer"),
          {
            scale: 2,
            opacity: 0,
            duration: 1.5,
            ease: "power3.in",
          },
          "-=1",
        )
        .to(
          q(".hero-background"),
          {
            scale: 2,
            opacity: 0,
            duration: 1.5,
            ease: "power3.in",
          },
          "<",
        )
        .to(
          launchGlow.current,
          {
            scale: 4,
            opacity: 0,
            duration: 1.2,
            ease: "power3.in",
          },
          "<",
        );

      /* ---------------------------------------
         Progress indicator
      --------------------------------------- */

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=6500",
        onUpdate: (self) => {
          if (progressBar.current) {
            progressBar.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  /* ---------------------------------------
     Stars
  --------------------------------------- */

  const stars = Array.from({ length: 120 });

  return (
    <section
      id="top"
      ref={root}
      className="relative h-screen overflow-hidden bg-[#02030a] text-white"
    >
      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="hero-background absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(70,50,180,0.22),transparent_40%),linear-gradient(180deg,#02030a_0%,#050719_50%,#010208_100%)]" />

        {/* Blue atmospheric glow */}
        <div className="absolute left-1/2 top-1/2 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        {/* Purple atmospheric glow */}
        <div className="absolute left-[70%] top-[35%] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* =====================================
          STARS
      ====================================== */}

      <div className="hero-star-layer pointer-events-none absolute inset-0">
        {stars.map((_, index) => (
          <span
            key={index}
            className="star absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.2,
            }}
          />
        ))}
      </div>

      {/* =====================================
          TOP HUD
      ====================================== */}

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-6 font-mono text-[10px] tracking-[0.3em] text-white/40 md:px-12">
        <span>RAMIL / EXPLORATION SYSTEM</span>

        <span className="hidden md:block">MISSION // 001</span>

        <span>ONLINE</span>
      </div>

      {/* =====================================
          SIDE PROGRESS
      ====================================== */}

      <div className="pointer-events-none absolute right-5 top-1/2 z-40 hidden h-32 w-px -translate-y-1/2 bg-white/10 md:block">
        <div
          ref={progressBar}
          className="absolute left-0 top-0 h-full w-full origin-top bg-cyan-400"
          style={{
            transform: "scaleY(0)",
          }}
        />
      </div>

      {/* =====================================
          SCENE 1 — WELCOME
      ====================================== */}

      <div
        ref={welcome}
        className="hero-scene absolute inset-0 z-20 flex items-center justify-center"
      >
        <div className="relative w-full max-w-5xl px-6 text-center">
          <div className="welcome-line mb-5 font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-300/70">
            Passenger communication channel
          </div>

          <h1 className="welcome-line text-5xl font-light tracking-tight text-white sm:text-7xl md:text-8xl">
            Welcome,
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Traveler.
            </span>
          </h1>

          <p className="welcome-line mx-auto mt-8 max-w-xl text-sm leading-7 text-white/50 md:text-base">
            Your journey through the digital universe is about to begin.
          </p>

          <div className="welcome-line mx-auto mt-10 flex items-center justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
            <span className="h-px w-12 bg-white/20" />
            Prepare for departure
            <span className="h-px w-12 bg-white/20" />
          </div>
        </div>
      </div>

      {/* =====================================
          PLANET
      ====================================== */}

      <div
        ref={planet}
        className="planet pointer-events-none absolute left-1/2 top-[58%] z-10 h-[35vw] w-[35vw] min-h-[280px] min-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div className="planet-glow absolute -inset-[20%] rounded-full bg-blue-500/20 blur-[80px]" />

        <div className="absolute inset-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#526bff_0%,#17245e_35%,#070b22_65%,#010208_100%)] shadow-[0_0_100px_rgba(70,100,255,0.3)]">
          <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_60%_35%,rgba(130,180,255,0.18),transparent_40%)]" />

          <div className="absolute left-[20%] top-[25%] h-16 w-32 rotate-12 rounded-full bg-white/5 blur-xl" />

          <div className="absolute bottom-[25%] right-[20%] h-20 w-40 -rotate-12 rounded-full bg-violet-400/5 blur-2xl" />
        </div>
      </div>

      {/* =====================================
          COCKPIT FRAME
      ====================================== */}

      <div
        ref={cockpit}
        className="cockpit-frame pointer-events-none absolute inset-0 z-30"
      >
        <div className="absolute bottom-0 left-1/2 h-[32vh] w-[120%] -translate-x-1/2 rounded-[50%_50%_0_0] border border-white/10 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-[8px] tracking-[0.4em] text-white/25">
          <span className="h-1 w-1 rounded-full bg-cyan-400" />
          FLIGHT DECK
          <span className="h-1 w-1 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* =====================================
          SCENE 2 — PILOT
      ====================================== */}

      <div
        ref={pilot}
        className="hero-scene absolute inset-0 z-25 flex items-center justify-center"
      >
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:px-12">
          {/* Pilot portrait */}
          <div className="pilot-line relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(90,130,255,0.3),transparent_50%)]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-cyan-400/30 bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                <span className="font-mono text-4xl text-white/50">RA</span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
              <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-300">
                PILOT IDENTIFIED
              </div>

              <div className="mt-2 text-xl font-medium">Ramil Aoanan</div>

              <div className="mt-1 text-xs text-white/40">
                Frontend / Full-Stack Developer
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div>
            <div className="pilot-line font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-300/70">
              Flight Commander
            </div>

            <h2 className="pilot-line mt-4 text-4xl font-light leading-tight md:text-6xl">
              Building digital
              <br />
              <span className="text-white/40">worlds from code.</span>
            </h2>

            <p className="pilot-line mt-6 max-w-lg text-sm leading-7 text-white/45">
              Welcome aboard. I design and build modern web experiences where
              technology, interaction, and visual storytelling meet.
            </p>

            <div className="pilot-line mt-8 grid grid-cols-2 gap-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
              <div className="border-l border-cyan-400/40 pl-4">
                <span className="block text-white/70">Mission</span>
                Frontend Engineering
              </div>

              <div className="border-l border-violet-400/40 pl-4">
                <span className="block text-white/70">Experience</span>
                Web Development
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          SCENE 3 — DESTINATION
      ====================================== */}

      <div
        ref={destination}
        className="hero-scene absolute inset-0 z-30 flex items-center justify-center"
      >
        <div className="w-full max-w-5xl px-6 md:px-12">
          <div className="destination-line text-center font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-300/70">
            Navigation System
          </div>

          <h2 className="destination-line mt-4 text-center text-4xl font-light md:text-6xl">
            Select destination
          </h2>

          {/* Map */}
          <div className="map-grid relative mx-auto mt-12 h-[360px] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(100,180,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.3) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />

            {/* Orbit */}
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20" />

            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/20" />

            {/* Center */}
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(80,220,255,1)]" />

            {/* Destination */}
            <div className="map-target absolute left-[68%] top-[30%]">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
                <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(80,220,255,1)]" />
              </div>

              <div className="absolute left-12 top-1 whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-cyan-300">
                <span ref={selectedDestination}>---</span>
              </div>
            </div>

            {/* Coordinates */}
            <div className="absolute left-5 top-5 font-mono text-[8px] leading-5 tracking-[0.2em] text-white/30">
              <div>GALACTIC NAVIGATION</div>
              <div>SECTOR 07 / 19</div>
              <div>SCANNING...</div>
            </div>

            <div className="absolute bottom-5 right-5 text-right font-mono text-[8px] leading-5 tracking-[0.2em] text-white/30">
              <div>VECTOR LOCK</div>
              <div className="text-cyan-300">ACTIVE</div>
            </div>
          </div>

          <div className="destination-line mt-6 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
            Automated destination selection engaged
          </div>
        </div>
      </div>

      {/* =====================================
          SCENE 4 — SYSTEM CHECK
      ====================================== */}

      <div
        ref={system}
        className="hero-scene absolute inset-0 z-30 flex items-center justify-center"
      >
        <div className="w-full max-w-3xl px-6">
          <div className="system-line mb-3 font-mono text-[10px] uppercase tracking-[0.45em] text-cyan-300">
            Ship Diagnostics
          </div>

          <h2 className="system-line text-4xl font-light md:text-6xl">
            System check
          </h2>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
            {[
              ["Navigation Core", "READY"],
              ["Quantum Drive", "READY"],
              ["Life Support", "READY"],
              ["Navigation Matrix", "READY"],
              ["Communication", "READY"],
              ["Launch Sequence", "ARMED"],
            ].map(([label, status], index) => (
              <div
                key={label}
                className="system-line flex items-center justify-between border-b border-white/5 px-5 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] text-white/20">
                    0{index + 1}
                  </span>

                  <span className="text-sm text-white/60">{label}</span>
                </div>

                <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-300">
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 h-px overflow-hidden bg-white/10">
            <div className="system-progress h-full w-0 bg-gradient-to-r from-cyan-400 to-violet-400" />
          </div>

          <div className="system-line mt-4 flex justify-between font-mono text-[8px] uppercase tracking-[0.25em] text-white/30">
            <span>All systems nominal</span>
            <span>Launch authorized</span>
          </div>
        </div>
      </div>

      {/* =====================================
          SCENE 5 — COUNTDOWN
      ====================================== */}

      <div
        ref={countdown}
        className="hero-scene absolute inset-0 z-40 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="countdown-line font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-300/70">
            Launch sequence
          </div>

          <div
            ref={countNumber}
            className="countdown-line mt-5 text-[12rem] font-extralight leading-none tracking-tighter text-white md:text-[18rem]"
          >
            10
          </div>

          <div className="countdown-line mt-5 font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            Prepare for ignition
          </div>
        </div>
      </div>

      {/* =====================================
          SCENE 6 — ROCKET
      ====================================== */}

      <div
        ref={rocket}
        className="rocket absolute bottom-[12%] left-1/2 z-50 -translate-x-1/2"
      >
        {/* Rocket body */}
        <div className="relative h-72 w-32">
          {/* Nose */}
          <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 overflow-hidden rounded-t-[50%] bg-gradient-to-br from-white/90 via-slate-300 to-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          {/* Body */}
          <div className="absolute bottom-10 left-1/2 h-48 w-24 -translate-x-1/2 rounded-b-[45%] rounded-t-[20%] bg-gradient-to-r from-slate-700 via-white to-slate-500 shadow-[0_0_50px_rgba(100,150,255,0.15)]">
            <div className="absolute left-1/2 top-12 h-12 w-12 -translate-x-1/2 rounded-full border border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_25px_rgba(80,220,255,0.4)]" />

            <div className="absolute bottom-8 left-1/2 h-12 w-4 -translate-x-1/2 rounded-full bg-slate-800" />
          </div>

          {/* Left fin */}
          <div className="absolute bottom-8 left-0 h-20 w-10 -skew-x-12 rounded-bl-xl bg-slate-700" />

          {/* Right fin */}
          <div className="absolute bottom-8 right-0 h-20 w-10 skew-x-12 rounded-br-xl bg-slate-700" />

          {/* Engine */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="engine-flame h-24 w-12 rounded-b-full bg-gradient-to-b from-white via-cyan-300 to-blue-600 blur-[2px]" />

            <div className="absolute left-1/2 top-2 h-24 w-20 -translate-x-1/2 rounded-full bg-blue-500/30 blur-2xl" />
          </div>
        </div>

        <div className="launch-status absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-300 opacity-0">
          Launch sequence initiated
        </div>
      </div>

      {/* =====================================
          LAUNCH GLOW
      ====================================== */}

      <div
        ref={launchGlow}
        className="launch-glow pointer-events-none absolute left-1/2 top-[70%] z-40 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/50 blur-[70px]"
      />

      {/* =====================================
          LAUNCH FLASH
      ====================================== */}

      <div className="launch-flash pointer-events-none absolute inset-0 z-[60] bg-white opacity-0" />

      {/* =====================================
          BOTTOM HUD
      ====================================== */}

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-50 flex items-center justify-between px-6 font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 md:px-12">
        <span>LAT 14.5995°</span>

        <span className="hidden md:block">DIGITAL EXPLORATION UNIT</span>

        <span>LONG 120.9842°</span>
      </div>
    </section>
  );
}
