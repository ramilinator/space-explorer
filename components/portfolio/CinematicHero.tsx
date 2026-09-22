"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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

  const spaceship = useRef<HTMLDivElement>(null);
  const cockpit = useRef<HTMLDivElement>(null);
  const rocket = useRef<HTMLDivElement>(null);
  const engine = useRef<HTMLDivElement>(null);
  const launchGlow = useRef<HTMLDivElement>(null);

  const selectedDestination = useRef<HTMLSpanElement>(null);
  const countNumber = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  const countdownState = { value: 10 };

  const [audioOn, setAudioOn] = useState(false);

  const audioEnabled = useRef(false);

  const ambientAudio = useRef<HTMLAudioElement | null>(null);
  const scanAudio = useRef<HTMLAudioElement | null>(null);
  const navigationAudio = useRef<HTMLAudioElement | null>(null);
  const systemAudio = useRef<HTMLAudioElement | null>(null);
  const countdownAudio = useRef<HTMLAudioElement | null>(null);
  const ignitionAudio = useRef<HTMLAudioElement | null>(null);
  const launchAudio = useRef<HTMLAudioElement | null>(null);
  const whooshAudio = useRef<HTMLAudioElement | null>(null);

  const playSound = (audio: HTMLAudioElement | null, volume = 0.5) => {
    if (!audioEnabled.current || !audio) return;

    audio.currentTime = 0;
    audio.volume = volume;

    audio.play().catch(() => {
      // Browser may block playback until user interaction.
    });
  };

  useEffect(() => {
    if (!root.current) return;

    ambientAudio.current = new Audio("/sounds/ambient-space.mp3");
    scanAudio.current = new Audio("/sounds/scan.mp3");
    navigationAudio.current = new Audio("/sounds/navigation.mp3");
    systemAudio.current = new Audio("/sounds/system-beep.mp3");
    countdownAudio.current = new Audio("/sounds/countdown.mp3");
    ignitionAudio.current = new Audio("/sounds/ignition.mp3");
    launchAudio.current = new Audio("/sounds/launch.mp3");
    whooshAudio.current = new Audio("/sounds/whoosh.mp3");

    if (ambientAudio.current) {
      ambientAudio.current.loop = true;
      ambientAudio.current.volume = 0.18;
    }

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

      gsap.to(q(".spaceship"), {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
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

      gsap.set(q(".warp-star"), {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "left center",
      });

      gsap.to(q(".planet"), {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(q(".pilot-scan-line"), {
        top: "100%",
        duration: 2.8,
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
        .call(() => {
          playSound(scanAudio.current, 0.45);
        })
        .fromTo(
          spaceship.current,
          {
            scale: 0.55,
            x: 0,
            y: 80,
            autoAlpha: 0.25,
          },
          {
            scale: 1,
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 1.5,
            ease: "power3.out",
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
        })
        .to(
          spaceship.current,
          {
            scale: 0.92,
            y: 15,
            autoAlpha: 0.65,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "<",
        );

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
        .call(() => {
          playSound(navigationAudio.current, 0.4);
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
        .call(() => {
          playSound(navigationAudio.current, 0.35);
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
        .to(
          spaceship.current,
          {
            scale: 0.82,
            autoAlpha: 0.3,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "<",
        )
        .to(q(".system-line"), {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          stagger: 0.22,
          ease: "power2.out",
          onStart: () => {
            playSound(systemAudio.current, 0.3);
          },
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
        .to(
          spaceship.current,
          {
            scale: 1,
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "<",
        )
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
        .set(countNumber.current, {
          textContent: "10",
        })
        .to(countdownState, {
          value: 0,
          duration: 2.2,
          ease: "none",
          onUpdate: () => {
            if (!countNumber.current) return;

            countNumber.current.textContent = String(
              Math.ceil(countdownState.value),
            );
          },
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
        .to(q(".launch-status"), {
          autoAlpha: 1,
          duration: 0.4,
        })
        .call(() => {
          playSound(ignitionAudio.current, 0.7);
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
        .call(() => {
          playSound(launchAudio.current, 0.9);
          playSound(whooshAudio.current, 0.55);
        })
        .to(q(".spaceship"), {
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

      timeline
        .to(q(".warp-star"), {
          opacity: 0.8,
          scaleX: "random(0.5, 3)",
          duration: 0.8,
          stagger: {
            each: 0.015,
            from: "random",
          },
          ease: "power2.out",
        })
        .to(
          q(".warp-star"),
          {
            x: "random(-1400, 1400)",
            y: "random(-900, 900)",
            scaleX: "random(2, 8)",
            duration: 1.8,
            stagger: {
              each: 0.01,
              from: "random",
            },
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

      <div className="warp-stars pointer-events-none absolute inset-0 z-[4] overflow-hidden">
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="warp-star absolute left-1/2 top-1/2 h-px w-12 origin-left bg-white/70"
            style={{
              transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 20}px)`,
            }}
          />
        ))}
      </div>

      {/* =====================================
          TOP HUD
      ====================================== */}

      <button
        type="button"
        onClick={() => {
          const nextState = !audioOn;

          audioEnabled.current = nextState;
          setAudioOn(nextState);

          if (nextState) {
            ambientAudio.current?.play().catch(() => {});
          } else {
            ambientAudio.current?.pause();
          }
        }}
        className="pointer-events-auto absolute right-6 top-20 z-[70] border border-cyan-300/20 bg-black/30 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-300/70 backdrop-blur-md transition hover:border-cyan-300/50 hover:text-cyan-300 md:right-12"
      >
        AUDIO SYSTEM // {audioOn ? "ONLINE" : "OFFLINE"}
      </button>

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
          SPACESHIP
      ====================================== */}

      <div
        ref={spaceship}
        className="spaceship pointer-events-none absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Atmospheric glow */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />

        {/* Ground illumination */}
        <div className="absolute left-1/2 top-[78%] h-10 w-[430px] -translate-x-1/2 rounded-[50%] bg-cyan-400/20 blur-3xl" />

        <div className="relative h-[300px] w-[520px]">
          {/* Main hull */}
          <div
            className="
        absolute left-1/2 top-[32%]
        h-[105px] w-[380px]
        -translate-x-1/2
        rounded-[48%_48%_30%_30%]
        border border-white/20
        bg-gradient-to-b
        from-slate-200
        via-slate-500
        to-slate-950
        shadow-[0_25px_70px_rgba(0,0,0,0.8)]
      "
          >
            {/* Hull highlight */}
            <div className="absolute left-[10%] right-[10%] top-3 h-px bg-white/40" />

            {/* Lower hull */}
            <div className="absolute bottom-0 left-[15%] right-[15%] h-8 rounded-full bg-black/30 blur-sm" />

            {/* Cockpit */}
            <div
              className="
          absolute left-1/2 top-[-38px]
          h-[65px] w-[145px]
          -translate-x-1/2
          rounded-[65%_65%_35%_35%]
          border border-cyan-300/30
          bg-gradient-to-b
          from-cyan-200/30
          via-blue-500/20
          to-slate-950
          shadow-[0_0_45px_rgba(34,211,238,0.2)]
        "
            >
              <div className="absolute inset-2 rounded-[60%_60%_35%_35%] border border-white/10" />

              <div className="absolute bottom-2 left-1/2 h-px w-16 -translate-x-1/2 bg-cyan-300/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </div>

            {/* Left wing */}
            <div
              className="
          absolute left-[-105px] top-[22px]
          h-[65px] w-[150px]
          -skew-x-[28deg]
          rounded-l-full
          border border-white/10
          bg-gradient-to-r from-slate-950 via-slate-800 to-slate-500
        "
            />

            {/* Right wing */}
            <div
              className="
          absolute right-[-105px] top-[22px]
          h-[65px] w-[150px]
          skew-x-[28deg]
          rounded-r-full
          border border-white/10
          bg-gradient-to-l from-slate-950 via-slate-800 to-slate-500
        "
            />

            {/* Left navigation light */}
            <div className="absolute left-[20%] top-[48%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />

            {/* Right navigation light */}
            <div className="absolute right-[20%] top-[48%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />

            {/* Center reactor */}
            <div className="absolute bottom-[-7px] left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-cyan-300/70 blur-md" />

            <div className="absolute bottom-[-4px] left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(34,211,238,1)]" />
          </div>

          {/* Left engine */}
          <div className="absolute bottom-[82px] left-[92px]">
            <div className="h-3 w-16 rounded-full bg-cyan-400/40 blur-md" />
            <div className="absolute inset-0 h-2 w-16 rounded-full bg-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
          </div>

          {/* Right engine */}
          <div className="absolute bottom-[82px] right-[92px]">
            <div className="h-3 w-16 rounded-full bg-cyan-400/40 blur-md" />
            <div className="absolute inset-0 h-2 w-16 rounded-full bg-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
          </div>

          {/* Engine glow */}
          <div className="absolute bottom-[55px] left-1/2 h-16 w-[330px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        {/* Ship telemetry */}
        <div className="absolute left-1/2 top-[calc(100%+12px)] -translate-x-1/2 whitespace-nowrap text-center font-mono text-[8px] uppercase tracking-[0.35em] text-white/30">
          <div>VESSEL // RA-01</div>
          <div className="mt-1 text-cyan-300/60">DOCKED • SYSTEMS STANDBY</div>
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
    SCENE 2 — PILOT IDENTIFIED
====================================== */}

      <div
        ref={pilot}
        className="hero-scene absolute inset-0 z-25 flex items-center justify-center"
      >
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:px-12">
          {/* =================================
        PILOT PORTRAIT
    ================================== */}

          <div className="pilot-line relative mx-auto w-full max-w-[340px]">
            {/* Outer atmospheric glow */}
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[90px]" />

            {/* Identification frame */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#050812]/80 shadow-[0_0_80px_rgba(34,211,238,0.08)]">
              {/* Grid overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-20 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(100,220,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,.15) 1px, transparent 1px)",
                  backgroundSize: "35px 35px",
                }}
              />

              {/* Sample profile image */}
              <Image
                src="/images/profile.png"
                alt="Pilot profile"
                fill
                priority
                className="object-cover object-center grayscale-[20%]"
                sizes="340px"
              />

              {/* Cinematic image overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#02040b]/20 via-transparent to-[#02040b]/95" />

              {/* Blue lighting */}
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.15),transparent_45%)]" />

              {/* Scan line */}
              <div className="pilot-scan-line pointer-events-none absolute left-0 right-0 top-0 z-30 h-px bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9),0_0_25px_rgba(34,211,238,0.6)]">
                <div className="absolute left-0 right-0 -top-3 h-7 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent blur-md" />
              </div>

              {/* Corner brackets */}

              <div className="absolute left-4 top-4 z-30 h-8 w-8 border-l border-t border-cyan-300/50" />

              <div className="absolute right-4 top-4 z-30 h-8 w-8 border-r border-t border-cyan-300/50" />

              <div className="absolute bottom-4 left-4 z-30 h-8 w-8 border-b border-l border-cyan-300/50" />

              <div className="absolute bottom-4 right-4 z-30 h-8 w-8 border-b border-r border-cyan-300/50" />

              {/* Image metadata */}
              <div className="absolute left-5 top-5 z-30 font-mono text-[7px] leading-4 tracking-[0.25em] text-white/50">
                <div>BIOMETRIC SCAN</div>
                <div className="text-cyan-300">MATCH 100%</div>
              </div>

              {/* Bottom identification panel */}
              <div className="cockpit-data absolute bottom-0 left-0 right-0 z-30 p-6">
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]" />
                  PILOT IDENTIFIED
                </div>

                <div className="mt-3 text-2xl font-light text-white">
                  Ramil Aoanan
                </div>

                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.25em] text-white/40">
                  Flight Commander / Developer
                </div>
              </div>
            </div>

            {/* ID number */}
            <div className="mt-4 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.3em] text-white/20">
              <span>IDENTIFICATION // RA-001</span>
              <span>VERIFIED</span>
            </div>
          </div>

          {/* =================================
        PILOT INFORMATION
    ================================== */}

          <div className="max-w-xl">
            <div className="pilot-line flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-300/70">
              <span className="h-px w-8 bg-cyan-400/50" />
              Flight Commander
            </div>

            <h2 className="pilot-line mt-5 text-4xl font-light leading-[1.1] tracking-tight md:text-6xl">
              Building digital
              <br />
              <span className="text-white/35">worlds from code.</span>
            </h2>

            <p className="pilot-line mt-7 max-w-lg text-sm leading-7 text-white/45 md:text-base">
              Welcome aboard. I design and build modern web experiences where
              technology, interaction, and visual storytelling meet.
            </p>

            {/* Pilot statistics */}
            <div className="pilot-line mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-y border-white/10 py-6">
              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Mission
                </div>

                <div className="mt-2 text-sm text-white/70">
                  Frontend Engineering
                </div>
              </div>

              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Specialty
                </div>

                <div className="mt-2 text-sm text-white/70">
                  Interactive Web
                </div>
              </div>

              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Environment
                </div>

                <div className="mt-2 text-sm text-white/70">
                  Next.js / React
                </div>
              </div>

              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Status
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-cyan-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                  ONLINE
                </div>
              </div>
            </div>

            {/* System message */}
            <div className="pilot-line mt-7 flex items-start gap-4 font-mono text-[8px] uppercase leading-5 tracking-[0.2em] text-white/25">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/60" />

              <span>
                Pilot authentication successful.
                <br />
                Navigation systems synchronized.
              </span>
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
          LAUNCH GLOW
      ====================================== */}

      <div
        ref={launchGlow}
        className="launch-glow pointer-events-none absolute left-1/2 top-[70%] z-40 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/50 blur-[70px]"
      />

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
