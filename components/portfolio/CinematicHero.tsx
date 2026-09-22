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
const normalStars = Array.from({ length: 120 }, (_, index) => ({
  left: `${(index * 47.37) % 100}%`,
  top: `${(index * 83.21) % 100}%`,
  size: `${1 + (index % 2)}px`,
  opacity: 0.25 + ((index * 17) % 70) / 100,
}));

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

export default function CinematicHero() {
  const root = useRef<HTMLDivElement>(null);

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
       * Warp layer begins completely invisible.
       */

      gsap.set(q(".warp-stars"), {
        autoAlpha: 0,
      });

      gsap.set(q(".warp-star"), {
        opacity: 0,
        scaleX: 0.05,
        transformOrigin: "left center",
      });

      gsap.set(q(".warp-core"), {
        scale: 0.2,
        opacity: 0,
      });

      gsap.set(q(".warp-vignette"), {
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

      /*
       * =======================================================
       * SCENE 8 — WARP FIELD ACTIVATION
       * =======================================================
       *
       * IMPORTANT:
       *
       * The warp stars activate BEFORE the spaceship starts
       * leaving the screen.
       *
       * This creates acceleration instead of simply moving
       * the ship upward.
       */

      timeline
        .to(q(".warp-stars"), {
          autoAlpha: 1,
          duration: 0.2,
        })
        .to(q(".warp-star"), {
          opacity: "random(0.45, 0.95)",
          scaleX: "random(0.8, 2)",
          duration: 0.45,
          stagger: {
            each: 0.006,
            from: "random",
          },
          ease: "power2.out",
        })
        .to(
          q(".warp-core"),
          {
            opacity: 0.7,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          q(".warp-vignette"),
          {
            opacity: 0.65,
            duration: 0.5,
          },
          "<",
        );

      /*
       * =======================================================
       * SCENE 9 — ACCELERATION
       * =======================================================
       */

      timeline.to(q(".warp-star"), {
        x: (index) => {
          const star = warpStars[index % warpStars.length];

          return Math.cos(star.angle) * 1050;
        },

        y: (index) => {
          const star = warpStars[index % warpStars.length];

          return Math.sin(star.angle) * 1050;
        },

        scaleX: "random(3, 7)",
        opacity: "random(0.7, 1)",

        duration: 1.45,

        stagger: {
          each: 0.006,
          from: "random",
        },

        ease: "power3.in",
      });

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
        )
        .to(
          q(".warp-star"),
          {
            scaleX: 10,
            opacity: 0.95,
            duration: 0.7,
            ease: "power4.in",
          },
          "-=0.8",
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

        <div className="hero-star-layer pointer-events-none absolute inset-0">
          {normalStars.map((star, index) => (
            <span
              key={index}
              className="star absolute rounded-full bg-white"
              style={{
                width: star.size,
                height: star.size,
                left: star.left,
                top: star.top,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        {/* =====================================================
            WARP STAR FIELD
        ====================================================== */}

        <div className="warp-stars pointer-events-none absolute inset-0 z-[4] overflow-hidden">
          {warpStars.map((star, index) => {
            const x = Math.cos(star.angle) * star.radius;
            const y = Math.sin(star.angle) * star.radius;

            return (
              <span
                key={index}
                className="warp-star absolute left-1/2 top-1/2 h-px rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(165,243,252,0.9)]"
                style={{
                  width: `${star.width}px`,
                  transform: `translate(${x}px, ${y}px) rotate(${star.angle}rad)`,
                }}
              />
            );
          })}

          {/* Hyperspace core */}

          <div className="warp-core absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-[110px]" />

          <div className="absolute left-1/2 top-1/2 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[45px]" />

          <div className="warp-vignette absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_22%,rgba(0,0,0,0.9)_100%)]" />
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
            WELCOME
        ====================================================== */}

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
            PILOT
        ====================================================== */}

        <div
          ref={pilot}
          className="hero-scene absolute inset-0 z-25 flex items-center justify-center"
        >
          <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:px-12">
            {/* PORTRAIT */}

            <div className="pilot-line relative mx-auto w-full max-w-[340px]">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[90px]" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#050812]/80 shadow-[0_0_80px_rgba(34,211,238,0.08)]">
                <div
                  className="pointer-events-none absolute inset-0 z-20 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(100,220,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,.15) 1px, transparent 1px)",
                    backgroundSize: "35px 35px",
                  }}
                />

                <Image
                  src="/images/profile.png"
                  alt="Pilot profile"
                  fill
                  priority
                  className="object-cover object-center grayscale-[20%]"
                  sizes="340px"
                />

                <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#02040b]/20 via-transparent to-[#02040b]/95" />

                <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.15),transparent_45%)]" />

                <div className="pilot-scan-line pointer-events-none absolute left-0 right-0 top-0 z-30 h-px bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9),0_0_25px_rgba(34,211,238,0.6)]">
                  <div className="absolute -top-3 left-0 right-0 h-7 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent blur-md" />
                </div>

                <div className="absolute left-4 top-4 z-30 h-8 w-8 border-l border-t border-cyan-300/50" />

                <div className="absolute right-4 top-4 z-30 h-8 w-8 border-r border-t border-cyan-300/50" />

                <div className="absolute bottom-4 left-4 z-30 h-8 w-8 border-b border-l border-cyan-300/50" />

                <div className="absolute bottom-4 right-4 z-30 h-8 w-8 border-b border-r border-cyan-300/50" />

                <div className="absolute left-5 top-5 z-30 font-mono text-[7px] leading-4 tracking-[0.25em] text-white/50">
                  <div>BIOMETRIC SCAN</div>
                  <div className="text-cyan-300">MATCH 100%</div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] text-cyan-300">
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

              <div className="mt-4 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.3em] text-white/20">
                <span>IDENTIFICATION // RA-001</span>

                <span>VERIFIED</span>
              </div>
            </div>

            {/* INFORMATION */}

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

        {/* =====================================================
            DESTINATION
        ====================================================== */}

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

            <div className="map-grid relative mx-auto mt-12 h-[360px] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(100,180,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.3) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20" />

              <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/20" />

              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(80,220,255,1)]" />

              <div className="map-target absolute left-[68%] top-[30%]">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
                  <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(80,220,255,1)]" />
                </div>

                <div className="absolute left-12 top-1 whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-cyan-300">
                  <span ref={selectedDestination}>{selectedMission.name}</span>
                </div>
              </div>

              <div className="absolute left-5 top-5 font-mono text-[8px] leading-5 tracking-[0.2em] text-white/30">
                <div>GALACTIC NAVIGATION</div>
                <div>SECTOR {selectedMission.code}</div>
                <div>SCANNING...</div>
              </div>

              <div className="absolute bottom-5 right-5 text-right font-mono text-[8px] leading-5 tracking-[0.2em] text-white/30">
                <div>VECTOR LOCK</div>
                <div className="text-cyan-300">ACTIVE</div>
              </div>
            </div>

            <div className="destination-line mt-6 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">
              Automated destination selection engaged
              <span className="mx-2 text-white/10">//</span>
              {selectedMission.distance}
            </div>
          </div>
        </div>

        {/* =====================================================
            SYSTEM CHECK
        ====================================================== */}

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

        {/* =====================================================
            COUNTDOWN
        ====================================================== */}

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
