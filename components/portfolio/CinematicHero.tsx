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

/*
 * Deterministic star data.
 *
 * We intentionally don't use Math.random() during render.
 * That prevents hydration mismatches in Next.js.
 */
const normalStars = Array.from({ length: 150 }, (_, index) => {
  const top = (index * 83.21) % 100;

  const horizonFade = top < 48 ? 1 : top < 65 ? 0.75 : top < 80 ? 0.4 : 0.12;

  const opacity = (0.25 + ((index * 17) % 70) / 100) * horizonFade;

  return {
    left: `${(index * 47.37) % 100}%`,
    top: `${top}%`,
    size: `${1 + (index % 3) * 0.5}px`,
    opacity,
    twinkle: index % 4 !== 0,
    duration: 2.5 + ((index * 19) % 45) / 10,
    delay: ((index * 13) % 50) / 10,
  };
});

/*
 * Warp stars are distributed around a circular origin.
 *
 * Each star gets:
 * - an angle
 * - a starting radius
 * - a length
 *
 * During launch GSAP pushes each star along its angle,
 * creating a radial hyperspace effect.
 */
const warpStars = Array.from({ length: 110 }, (_, index) => {
  const angle = (index / 110) * Math.PI * 2;

  return {
    angle,
    radius: 20 + ((index * 29) % 180),
    width: 10 + ((index * 13) % 35),
  };
});

const shootingStars = Array.from({ length: 12 }, (_, index) => ({
  top: 5 + ((index * 17.37) % 58),
  left: -18 + ((index * 31.17) % 118),

  delay: index * 4.8 + ((index * 7) % 6),

  duration: 0.9 + ((index * 11) % 9) / 10,

  length: 70 + ((index * 37) % 120),

  angle: 22 + ((index * 13) % 16),
}));

/* ============================================================
   SHARED HUD COMPONENTS
============================================================ */

function HudTitleBar({
  label,
  status,
  accent = "cyan",
}: {
  label: string;
  status: string;
  accent?: "cyan" | "violet";
}) {
  const cyan = accent === "cyan";

  return (
    <div className="flex h-10 items-center justify-between border-b border-white/10 bg-black/20 px-4 md:px-5">
      <div className="flex items-center gap-3">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            cyan ? "bg-cyan-300" : "bg-violet-300"
          } ${
            cyan
              ? "shadow-[0_0_10px_rgba(34,211,238,1)]"
              : "shadow-[0_0_10px_rgba(167,139,250,1)]"
          }`}
        />

        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/55">
          {label}
        </span>
      </div>

      <div
        className={`flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.3em] ${
          cyan ? "text-cyan-300/70" : "text-violet-300/70"
        }`}
      >
        {status}

        <span
          className={`h-1 w-1 rounded-full ${
            cyan ? "bg-cyan-300" : "bg-violet-300"
          }`}
        />
      </div>
    </div>
  );
}

function HudCorners() {
  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l border-t border-cyan-300/35" />

      <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r border-t border-cyan-300/35" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b border-l border-cyan-300/35" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-cyan-300/35" />
    </>
  );
}

export default function CinematicHero() {
  const root = useRef<HTMLDivElement>(null);

  const shootingStarLayer = useRef<HTMLDivElement>(null);
  const welcome = useRef<HTMLDivElement>(null);
  const pilot = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLDivElement>(null);
  const system = useRef<HTMLDivElement>(null);
  const countdown = useRef<HTMLDivElement>(null);

  const spaceship = useRef<HTMLDivElement>(null);
  const cockpit = useRef<HTMLDivElement>(null);

  const launchGlow = useRef<HTMLDivElement>(null);
  const launchFlash = useRef<HTMLDivElement>(null);

  const selectedDestination = useRef<HTMLSpanElement>(null);
  const countNumber = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  const countdownState = useRef({ value: 10 });
  const lastCountdownValue = useRef(10);

  const [audioOn, setAudioOn] = useState(false);
  const [selectedMission, setSelectedMission] = useState(destinations[0]);

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
      // Browser autoplay protection.
    });
  };

  useEffect(() => {
    if (!root.current) return;

    /*
     * ---------------------------------------------------------
     * AUDIO INITIALIZATION
     * ---------------------------------------------------------
     */

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

    /*
     * ---------------------------------------------------------
     * RANDOM DESTINATION
     * ---------------------------------------------------------
     *
     * Generated only after mount so it doesn't cause a
     * server/client hydration mismatch.
     */

    const randomDestination =
      destinations[Math.floor(Math.random() * destinations.length)];

    setSelectedMission(randomDestination);

    /*
     * ---------------------------------------------------------
     * GSAP CONTEXT
     * ---------------------------------------------------------
     */

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /*
       * =======================================================
       * INITIAL STATES
       * =======================================================
       */

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

      gsap.set(spaceship.current, {
        scale: 0.55,
        y: 80,
        autoAlpha: 0,
      });

      gsap.set(cockpit.current, {
        scale: 0.96,
        autoAlpha: 0.6,
      });

      gsap.set(q(".engine-flame"), {
        scaleY: 0.3,
        scaleX: 0.85,
        transformOrigin: "50% 100%",
      });

      gsap.set(launchGlow.current, {
        scale: 0.3,
        autoAlpha: 0,
      });

      gsap.set(launchFlash.current, {
        opacity: 0,
      });

      /*
       * =======================================================
       * AMBIENT STAR ANIMATION
       * =======================================================
       */

      gsap.to(q(".star"), {
        opacity: "random(0.3, 0.9)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.04,
          from: "random",
        },
        ease: "sine.inOut",
      });
      gsap.to(".hero-star-layer .star", {
        y: -10,
        duration: 12,
        stagger: {
          each: 0.03,
          from: "random",
        },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      /*
       * =======================================================
       * PILOT SCAN
       * =======================================================
       */

      gsap.to(q(".pilot-scan-line"), {
        top: "100%",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * =======================================================
       * ENGINE IDLE ANIMATION
       * =======================================================
       */

      const engineIdle = gsap.to(q(".engine-flame"), {
        scaleY: 1,
        scaleX: 0.85,
        duration: 0.12,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      /*
       * =======================================================
       * SHIP IDLE FLOAT
       * =======================================================
       *
       * This animation is paused during the cinematic timeline
       * so it doesn't fight with ScrollTrigger.
       */

      const shipFloat = gsap.to(spaceship.current, {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * =======================================================
       * MASTER CINEMATIC TIMELINE
       * =======================================================
       */

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

      /*
       * =======================================================
       * SCENE 1 — DEEP SPACE
       * =======================================================
       */

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

      /*
       * =======================================================
       * SCENE 2 — WELCOME
       * =======================================================
       */

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
        .to(
          {},
          {
            duration: 0.8,
          },
        )
        .to(welcome.current, {
          autoAlpha: 0,
          scale: 1.05,
          duration: 0.6,
          ease: "power2.in",
        });

      /*
       * =======================================================
       * SCENE 3 — PILOT + SHIP
       * =======================================================
       */

      timeline.call(() => {
        shipFloat.pause();

        playSound(scanAudio.current, 0.45);
      });

      timeline
        .set(pilot.current, {
          autoAlpha: 1,
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
        .to(
          {},
          {
            duration: 1,
          },
        )
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

      /*
       * =======================================================
       * SCENE 4 — DESTINATION
       * =======================================================
       */

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
          playSound(navigationAudio.current, 0.3);
        })
        .to(
          {},
          {
            duration: 0.8,
          },
        )
        .to(destination.current, {
          autoAlpha: 0,
          duration: 0.5,
        });

      /*
       * =======================================================
       * SCENE 5 — SYSTEM CHECK
       * =======================================================
       */

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
        })
        .call(() => {
          playSound(systemAudio.current, 0.3);
        })
        .to(q(".system-progress"), {
          width: "100%",
          duration: 1.5,
          ease: "power2.inOut",
        })
        .to(
          {},
          {
            duration: 0.8,
          },
        )
        .to(system.current, {
          autoAlpha: 0,
          duration: 0.5,
        });

      /*
       * =======================================================
       * SCENE 6 — COUNTDOWN
       * =======================================================
       */

      countdownState.current.value = 10;
      lastCountdownValue.current = 10;

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
        .to(
          {},
          {
            duration: 0.3,
          },
        )
        .to(countdownState.current, {
          value: 0,
          duration: 2.2,
          ease: "none",

          onUpdate: () => {
            if (!countNumber.current) return;

            const nextValue = Math.ceil(countdownState.current.value);

            countNumber.current.textContent = String(nextValue);

            /*
             * Play a sound only when counting downward.
             *
             * This prevents sounds from firing continuously
             * while the user scrolls backward.
             */

            if (
              nextValue !== lastCountdownValue.current &&
              nextValue < lastCountdownValue.current
            ) {
              playSound(countdownAudio.current, 0.42);

              lastCountdownValue.current = nextValue;
            }
          },
        })
        .to(
          {},
          {
            duration: 0.25,
          },
        )
        .to(countdown.current, {
          autoAlpha: 0,
          duration: 0.4,
        });

      /*
       * =======================================================
       * SCENE 7 — IGNITION
       * =======================================================
       */

      timeline
        .call(() => {
          playSound(ignitionAudio.current, 0.7);

          engineIdle.pause();
        })
        .to(q(".launch-status"), {
          autoAlpha: 1,
          duration: 0.25,
        })
        .to(q(".engine-flame"), {
          scaleY: 2.5,
          scaleX: 1.5,
          duration: 0.45,
          ease: "power2.in",
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
        );
      timeline.to(
        shootingStarLayer.current,
        {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "<",
      );

      /*
       * =======================================================
       * SCENE 10 — SPACESHIP LAUNCH
       * =======================================================
       */

      timeline
        .call(() => {
          playSound(launchAudio.current, 0.9);
          playSound(whooshAudio.current, 0.55);
        })
        .to(
          spaceship.current,
          {
            y: -950,
            scale: 1.35,
            duration: 2,
            ease: "power3.in",
          },
          "-=1.15",
        );

      /*
       * =======================================================
       * SCENE 11 — CAMERA ACCELERATION
       * =======================================================
       */

      timeline
        .to(
          q(".launch-camera"),
          {
            x: -6,
            duration: 0.04,
            repeat: 10,
            yoyo: true,
            ease: "none",
          },
          "-=1.1",
        )
        .to(
          q(".engine-flame"),
          {
            scaleY: 5,
            scaleX: 2.2,
            duration: 0.5,
            ease: "power3.in",
          },
          "-=1.1",
        );

      /*
       * =======================================================
       * SCENE 12 — HYPERSPACE FLASH
       * =======================================================
       */

      timeline
        .to(
          launchFlash.current,
          {
            opacity: 1,
            duration: 0.12,
          },
          "-=0.65",
        )
        .to(launchFlash.current, {
          opacity: 0,
          duration: 0.5,
        });

      /*
       * =======================================================
       * SCENE 13 — FINAL WARP
       * =======================================================
       */

      timeline
        .to(
          q(".warp-star"),
          {
            scaleX: 16,
            opacity: 0,
            duration: 0.9,
            ease: "power4.in",
          },
          "-=0.35",
        )
        .to(
          q(".warp-core"),
          {
            scale: 4,
            opacity: 0,
            duration: 1.1,
            ease: "power3.in",
          },
          "<",
        )
        .to(
          q(".warp-vignette"),
          {
            opacity: 1,
            duration: 0.7,
          },
          "<",
        )
        .to(
          q(".hero-star-layer"),
          {
            scale: 2.5,
            opacity: 0,
            duration: 1.5,
            ease: "power3.in",
          },
          "-=0.7",
        )
        .to(
          q(".hero-background"),
          {
            scale: 2.5,
            opacity: 0,
            duration: 1.5,
            ease: "power3.in",
          },
          "<",
        )
        .to(
          launchGlow.current,
          {
            scale: 5,
            opacity: 0,
            duration: 1.2,
            ease: "power3.in",
          },
          "<",
        );

      /*
       * =======================================================
       * PROGRESS BAR
       * =======================================================
       */

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=6500",

        onUpdate: (self) => {
          if (progressBar.current) {
            progressBar.current.style.transform = `scaleY(${self.progress})`;
          }
        },
      });
    }, root);

    return () => {
      context.revert();

      ambientAudio.current?.pause();
      scanAudio.current?.pause();
      navigationAudio.current?.pause();
      systemAudio.current?.pause();
      countdownAudio.current?.pause();
      ignitionAudio.current?.pause();
      launchAudio.current?.pause();
      whooshAudio.current?.pause();

      ambientAudio.current = null;
      scanAudio.current = null;
      navigationAudio.current = null;
      systemAudio.current = null;
      countdownAudio.current = null;
      ignitionAudio.current = null;
      launchAudio.current = null;
      whooshAudio.current = null;
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative h-screen overflow-hidden bg-[#02030a] text-white"
    >
      <div className="launch-camera absolute inset-0">
        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div className="hero-background absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(70,50,180,0.22),transparent_40%),linear-gradient(180deg,#02030a_0%,#050719_50%,#010208_100%)]" />

          <div className="absolute left-1/2 top-1/2 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="absolute left-[70%] top-[35%] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        </div>

        {/* =====================================================
            NORMAL STARS
        ====================================================== */}

        <div className="hero-star-layer pointer-events-none absolute inset-0 overflow-hidden">
          {normalStars.map((star, index) => (
            <span
              key={index}
              className={`star absolute rounded-full bg-white ${
                star.twinkle ? "star-twinkle" : ""
              }`}
              style={{
                width: star.size,
                height: star.size,
                left: star.left,
                top: star.top,
                opacity: star.opacity,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {/* =====================================================
            SHOOTING STARS
        ====================================================== */}

        <div
          ref={shootingStarLayer}
          className="shooting-star-layer pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        >
          {shootingStars.map((star, index) => (
            <span
              key={index}
              className="shooting-star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.length}px`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                transform: `rotate(${star.angle}deg)`,
              }}
            >
              <span className="shooting-star-head" />
            </span>
          ))}
        </div>

        {/* =====================================================
             Horizon atmosphere
        ====================================================== */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[48%]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#010208] via-[#010208]/90 to-transparent" />

          <div className="absolute bottom-[18%] left-1/2 h-[18vh] w-[85vw] -translate-x-1/2 rounded-[50%] bg-cyan-500/[0.025] blur-[80px]" />

          <div className="absolute bottom-0 left-1/2 h-[12vh] w-[75vw] -translate-x-1/2 rounded-[50%] bg-blue-900/20 blur-[70px]" />
        </div>

        {/* =====================================================
            TOP HUD
        ====================================================== */}

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

        {/* =====================================================
            SIDE PROGRESS
        ====================================================== */}

        <div className="pointer-events-none absolute right-5 top-1/2 z-40 hidden h-32 w-px -translate-y-1/2 bg-white/10 md:block">
          <div
            ref={progressBar}
            className="absolute left-0 top-0 h-full w-full origin-top bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{
              transform: "scaleY(0)",
            }}
          />
        </div>

        {/* =====================================================
            WELCOME SCENE
        ===================================================== */}

        <div
          ref={welcome}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-3xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar
              label="Passenger Communication"
              status="Link Established"
            />

            <div className="welcome-line absolute left-5 top-[52px] font-mono text-[6px] uppercase tracking-[0.3em] text-white/20">
              CHANNEL // 01
            </div>

            <div className="px-6 py-16 text-center md:px-12 md:py-20">
              <div className="welcome-line font-mono text-[7px] uppercase tracking-[0.5em] text-cyan-300/60">
                Deep Space Transit Authority
              </div>

              <h1 className="welcome-line mt-6 text-4xl font-light tracking-tight md:text-7xl">
                Welcome,
                <br />
                <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                  passenger.
                </span>
              </h1>

              <div className="welcome-line mx-auto mt-8 h-px w-24 bg-cyan-300/40" />

              <p className="welcome-line mx-auto mt-7 max-w-lg font-mono text-[7px] uppercase leading-7 tracking-[0.28em] text-white/30">
                Your interstellar journey is about to begin.
                <br />
                Please remain seated while navigation systems initialize.
              </p>
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/20">
                PASSENGER CHANNEL
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-cyan-300/50">
                READY
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            SPACESHIP
        ====================================================== */}

        <div
          ref={spaceship}
          className="spaceship pointer-events-none absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />

          <div className="absolute left-1/2 top-[78%] h-10 w-[430px] -translate-x-1/2 rounded-[50%] bg-cyan-400/20 blur-3xl" />

          <div className="relative h-[300px] w-[520px]">
            {/* MAIN HULL */}

            <div className="absolute left-1/2 top-[32%] h-[105px] w-[380px] -translate-x-1/2 rounded-[48%_48%_30%_30%] border border-white/20 bg-gradient-to-b from-slate-200 via-slate-500 to-slate-950 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
              <div className="absolute left-[10%] right-[10%] top-3 h-px bg-white/40" />

              <div className="absolute bottom-0 left-[15%] right-[15%] h-8 rounded-full bg-black/30 blur-sm" />

              {/* COCKPIT */}

              <div className="absolute left-1/2 top-[-38px] h-[65px] w-[145px] -translate-x-1/2 rounded-[65%_65%_35%_35%] border border-cyan-300/30 bg-gradient-to-b from-cyan-200/30 via-blue-500/20 to-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.2)]">
                <div className="absolute inset-2 rounded-[60%_60%_35%_35%] border border-white/10" />

                <div className="absolute bottom-2 left-1/2 h-px w-16 -translate-x-1/2 bg-cyan-300/50 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              </div>

              {/* LEFT WING */}

              <div className="absolute left-[-105px] top-[22px] h-[65px] w-[150px] -skew-x-[28deg] rounded-l-full border border-white/10 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-500" />

              {/* RIGHT WING */}

              <div className="absolute right-[-105px] top-[22px] h-[65px] w-[150px] skew-x-[28deg] rounded-r-full border border-white/10 bg-gradient-to-l from-slate-950 via-slate-800 to-slate-500" />

              {/* NAV LIGHTS */}

              <div className="absolute left-[20%] top-[48%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />

              <div className="absolute right-[20%] top-[48%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />

              {/* MAIN ENGINE */}

              <div className="absolute bottom-[-7px] left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-cyan-300/70 blur-md" />

              <div className="engine-flame absolute bottom-[-4px] left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(34,211,238,1)]" />
            </div>

            {/* SIDE ENGINE LIGHTS */}

            <div className="absolute bottom-[82px] left-[92px]">
              <div className="h-3 w-16 rounded-full bg-cyan-400/40 blur-md" />

              <div className="absolute inset-0 h-2 w-16 rounded-full bg-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
            </div>

            <div className="absolute bottom-[82px] right-[92px]">
              <div className="h-3 w-16 rounded-full bg-cyan-400/40 blur-md" />

              <div className="absolute inset-0 h-2 w-16 rounded-full bg-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
            </div>

            <div className="absolute bottom-[55px] left-1/2 h-16 w-[330px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          {/* SHIP TELEMETRY */}

          <div className="absolute left-1/2 top-[calc(100%+12px)] -translate-x-1/2 whitespace-nowrap text-center font-mono text-[8px] uppercase tracking-[0.35em] text-white/30">
            <div>VESSEL // RA-01</div>

            <div className="mt-1 text-cyan-300/60">
              DOCKED • SYSTEMS STANDBY
            </div>
          </div>
        </div>

        {/* =====================================================
            COCKPIT FRAME
        ====================================================== */}

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

        {/* =====================================================
            PILOT SCENE
        ===================================================== */}

        <div
          ref={pilot}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-5xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar label="Crew Identification" status="Profile Active" />

            <div className="grid md:grid-cols-[280px_1fr]">
              {/* Pilot portrait */}

              <div className="pilot-line relative flex min-h-[310px] items-center justify-center border-b border-white/10 md:border-b-0 md:border-r">
                <div className="relative h-56 w-44 overflow-hidden border border-white/10 bg-black/30">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/[0.08] via-transparent to-black/70" />

                  {/* Portrait placeholder */}

                  <Image
                    src="/images/profile.png"
                    alt="Pilot profile"
                    fill
                    priority
                    className="object-cover object-center grayscale-[20%]"
                    sizes="340px"
                  />

                  {/* Scan */}

                  <div className="pilot-scan-line absolute left-0 top-0 h-px w-full bg-cyan-300/70 shadow-[0_0_10px_rgba(34,211,238,.8)]" />

                  <div className="absolute bottom-3 left-3 font-mono text-[5px] uppercase tracking-[0.25em] text-cyan-300/60">
                    BIOMETRIC LOCK
                  </div>

                  <div className="absolute bottom-3 right-3 font-mono text-[5px] text-white/20">
                    01
                  </div>
                </div>
              </div>

              {/* Pilot information */}

              <div className="flex flex-col justify-center px-7 py-10 md:px-12">
                <div className="pilot-line font-mono text-[7px] uppercase tracking-[0.35em] text-white/25">
                  Mission Commander
                </div>

                <h2 className="pilot-line mt-4 text-4xl font-light tracking-tight md:text-6xl">
                  Ramil
                  <br />
                  <span className="text-white/30">Aoanan.</span>
                </h2>

                <div className="pilot-line mt-7 h-px w-24 bg-cyan-300/40" />

                <p className="pilot-line mt-7 max-w-xl font-mono text-[7px] uppercase leading-7 tracking-[0.25em] text-white/30">
                  Full-stack developer and technical writer.
                  <br />
                  Frontend systems / interface architecture / digital
                  exploration.
                </p>

                <div className="pilot-line mt-9 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 md:grid-cols-3">
                  <div>
                    <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                      Clearance
                    </div>

                    <div className="mt-2 font-mono text-[7px] text-cyan-300/70">
                      LEVEL 07
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                      Role
                    </div>

                    <div className="mt-2 font-mono text-[7px] text-white/60">
                      PILOT
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                      Status
                    </div>

                    <div className="mt-2 font-mono text-[7px] text-cyan-300/70">
                      ACTIVE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/20">
                CREW DATABASE
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-cyan-300/50">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
    DESTINATION SCENE — COMPACT HUD
===================================================== */}

        <div
          ref={destination}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-4xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            {/* TITLE BAR */}

            <HudTitleBar
              label="Navigation System"
              status="Auto Nav // Online"
            />

            {/* HEADER */}

            <div className="destination-line flex items-end justify-between px-5 pb-4 pt-6 md:px-6">
              <div>
                <div className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/25">
                  Mission Navigation
                </div>

                <h2 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">
                  Destination
                  <span className="text-white/30"> acquisition.</span>
                </h2>
              </div>

              <div className="hidden text-right md:block">
                <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/25">
                  Navigation Status
                </div>

                <div className="mt-1 flex items-center justify-end gap-2 font-mono text-[7px] uppercase tracking-[0.25em] text-cyan-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                  TARGET LOCKED
                </div>
              </div>
            </div>

            {/* MAP */}

            <div className="destination-line relative mx-5 h-[280px] overflow-hidden border border-white/10 bg-black/20 md:mx-6 md:h-[300px]">
              {/* GRID */}

              <div
                className="map-grid absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(100,180,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.25) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* CROSSHAIR */}

              <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-cyan-300/10" />

              <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px bg-cyan-300/10" />

              {/* RADAR RINGS */}

              <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

              <div className="absolute left-1/2 top-1/2 h-[135px] w-[135px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />

              <div className="absolute left-1/2 top-1/2 h-[75px] w-[75px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />

              {/* NAVIGATION VECTORS */}

              <div className="absolute left-1/2 top-1/2 h-[210px] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />

              <div className="absolute left-1/2 top-1/2 h-[210px] w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />

              {/* ORIGIN */}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-xl" />

                <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(80,220,255,1)]" />
                </div>

                <div className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  ORIGIN
                </div>
              </div>

              {/* DESTINATION TARGET */}

              <div className="map-target absolute left-[68%] top-[30%]">
                <div className="relative flex h-11 w-11 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-300/20" />

                  <div className="absolute inset-2 rounded-full border border-cyan-300/30" />

                  <div className="absolute inset-4 rounded-full border border-cyan-300/50" />

                  <div className="relative h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(80,220,255,1)]" />
                </div>

                {/* TARGET CROSSHAIR */}

                <div className="absolute left-1/2 top-1/2 h-px w-12 -translate-x-1/2 bg-cyan-300/30" />

                <div className="absolute left-1/2 top-1/2 h-12 w-px -translate-y-1/2 bg-cyan-300/30" />

                {/* TARGET DATA */}

                <div className="absolute left-12 top-0 whitespace-nowrap">
                  <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-cyan-300">
                    <span ref={selectedDestination}>
                      {selectedMission.name}
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[5px] uppercase tracking-[0.25em] text-white/30">
                    TARGET // {selectedMission.code}
                  </div>

                  <div className="mt-1 font-mono text-[5px] uppercase tracking-[0.25em] text-white/20">
                    DIST // {selectedMission.distance}
                  </div>
                </div>
              </div>

              {/* VECTOR LINE */}

              <div className="absolute left-[52%] top-[48%] h-px w-[17%] origin-left rotate-[-18deg] bg-gradient-to-r from-cyan-300/10 via-cyan-300/30 to-cyan-300/70">
                <div className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 border-r border-t border-cyan-300/80" />
              </div>

              {/* TOP LEFT TELEMETRY */}

              <div className="absolute left-4 top-4 font-mono text-[5px] uppercase leading-4 tracking-[0.2em] text-white/30">
                <div className="text-cyan-300/60">GALACTIC NAVIGATION</div>

                <div>SECTOR // {selectedMission.code}</div>

                <div>VECTOR // CALCULATED</div>

                <div>TRAJECTORY // OPTIMAL</div>
              </div>

              {/* TOP RIGHT TELEMETRY */}

              <div className="absolute right-4 top-4 text-right font-mono text-[5px] uppercase leading-4 tracking-[0.2em] text-white/30">
                <div>SCAN // ACTIVE</div>

                <div>SIGNAL // STABLE</div>

                <div className="text-cyan-300/60">LOCK // CONFIRMED</div>
              </div>

              {/* BOTTOM LEFT */}

              <div className="absolute bottom-4 left-4 font-mono text-[5px] uppercase tracking-[0.2em] text-white/25">
                <div>DESTINATION</div>

                <div className="mt-1 text-cyan-300/70">
                  {selectedMission.name}
                </div>
              </div>

              {/* BOTTOM RIGHT */}

              <div className="absolute bottom-4 right-4 text-right font-mono text-[5px] uppercase tracking-[0.2em] text-white/25">
                <div>NAVIGATION</div>

                <div className="mt-1 text-cyan-300/70">AUTONOMOUS</div>
              </div>

              {/* CENTER STATUS */}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                <span className="mr-2 inline-block h-1 w-1 rounded-full bg-cyan-400" />
                MATRIX SYNCHRONIZED
              </div>
            </div>

            {/* TELEMETRY STRIP */}

            <div className="destination-line mx-5 mt-4 grid grid-cols-3 border-y border-white/10 md:mx-6">
              <div className="border-r border-white/10 px-4 py-3">
                <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  Destination
                </div>

                <div className="mt-1 text-xs font-light text-white/70">
                  {selectedMission.name}
                </div>
              </div>

              <div className="border-r border-white/10 px-4 py-3">
                <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  Distance
                </div>

                <div className="mt-1 text-xs font-light text-white/70">
                  {selectedMission.distance}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  Status
                </div>

                <div className="mt-1 flex items-center gap-2 font-mono text-[6px] text-cyan-300">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,1)]" />
                  LOCKED
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="destination-line flex items-center justify-between px-5 py-4 font-mono text-[5px] uppercase tracking-[0.25em] text-white/20 md:px-6">
              <span>{selectedMission.description}</span>

              <span className="hidden md:block">
                AUTO DESTINATION SELECTION
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            SYSTEM CHECK
        ===================================================== */}

        <div
          ref={system}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-4xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar
              label="Spacecraft Diagnostics"
              status="System Scan // Running"
            />

            <div className="system-line px-6 pb-5 pt-8 md:px-9">
              <div className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/25">
                Pre-flight diagnostic sequence
              </div>

              <h2 className="mt-3 text-4xl font-light md:text-5xl">
                Systems
                <span className="text-white/30"> check.</span>
              </h2>
            </div>

            <div className="px-6 pb-7 md:px-9">
              {[
                ["PROPULSION", "THRUST ARRAY"],
                ["NAVIGATION", "GUIDANCE CORE"],
                ["LIFE SUPPORT", "ENVIRONMENTAL"],
                ["COMMUNICATION", "DEEP SPACE LINK"],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="system-line border-t border-white/10 py-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono text-[7px] tracking-[0.25em] text-white/60">
                        {name}
                      </div>

                      <div className="mt-1 font-mono text-[5px] uppercase tracking-[0.2em] text-white/20">
                        {detail}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[6px] text-cyan-300/70">
                        100%
                      </span>

                      <span className="flex h-5 w-5 items-center justify-center border border-cyan-300/20 text-[8px] text-cyan-300">
                        ✓
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 h-px bg-white/5">
                    <div className="system-progress h-px w-0 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,.6)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/20">
                DIAGNOSTIC ENGINE
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-cyan-300/60">
                ALL SYSTEMS NOMINAL
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            COUNTDOWN
        ===================================================== */}

        <div
          ref={countdown}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-2xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar
              label="Launch Control"
              status="Sequence Armed"
              accent="violet"
            />

            <div className="countdown-line px-6 py-14 text-center md:px-10 md:py-16">
              <div className="font-mono text-[7px] uppercase tracking-[0.45em] text-violet-300/60">
                Final Departure Sequence
              </div>

              <div
                ref={countNumber}
                className="mt-6 text-[110px] font-extralight leading-none tracking-[-0.08em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,.15)] md:text-[160px]"
              >
                10
              </div>

              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-violet-300/30" />

                <span className="font-mono text-[7px] uppercase tracking-[0.4em] text-white/25">
                  T-MINUS
                </span>

                <span className="h-px w-10 bg-violet-300/30" />
              </div>
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/20">
                LAUNCH AUTHORIZATION
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-violet-300/60">
                CLEARED
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            LAUNCH GLOW
        ====================================================== */}

        <div
          ref={launchGlow}
          className="launch-glow pointer-events-none absolute left-1/2 top-[70%] z-40 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/50 blur-[70px]"
        />

        {/* =====================================================
            LAUNCH FLASH
        ====================================================== */}

        <div
          ref={launchFlash}
          className="launch-flash pointer-events-none absolute inset-0 z-[100] bg-white"
        />

        {/* =====================================================
            LAUNCH STATUS
        ====================================================== */}

        <div className="launch-status pointer-events-none absolute bottom-20 left-1/2 z-[80] -translate-x-1/2 opacity-0 font-mono text-[8px] uppercase tracking-[0.4em] text-cyan-300">
          <span className="mr-3 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,1)]" />
          LAUNCHING
        </div>

        {/* =====================================================
            BOTTOM HUD
        ====================================================== */}

        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-50 flex items-center justify-between px-6 font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 md:px-12">
          <span>LAT 14.5995°</span>

          <span className="hidden md:block">DIGITAL EXPLORATION UNIT</span>

          <span>LONG 120.9842°</span>
        </div>

        {/* =====================================================
            BOTTOM PROGRESS
        ====================================================== */}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[90] h-px bg-white/5">
          <div className="h-full origin-left bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>
      </div>
    </section>
  );
}
