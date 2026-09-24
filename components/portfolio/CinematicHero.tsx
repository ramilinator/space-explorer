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
 * =============================================================
 * DETERMINISTIC STARS
 * =============================================================
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

  /*
   * =============================================================
   * SCENE REFS
   * =============================================================
   */

  const cockpit = useRef<HTMLDivElement>(null);
  const welcome = useRef<HTMLDivElement>(null);
  const pilot = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLDivElement>(null);
  const selectedDestination = useRef<HTMLSpanElement>(null);
  const system = useRef<HTMLDivElement>(null);
  const countdown = useRef<HTMLDivElement>(null);

  /*
   * =============================================================
   * SHIP / CAMERA REFS
   * =============================================================
   */

  const spaceship = useRef<HTMLDivElement>(null);
  const shipCamera = useRef<HTMLDivElement>(null);

  const launchGlow = useRef<HTMLDivElement>(null);
  const launchFlash = useRef<HTMLDivElement>(null);
  const shootingStarLayer = useRef<HTMLDivElement>(null);

  /*
   * =============================================================
   * HUD REFS
   * =============================================================
   */

  const countNumber = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  /*
   * =============================================================
   * COUNTDOWN STATE
   * =============================================================
   */

  const countdownState = useRef({ value: 10 });
  const lastCountdownValue = useRef(10);

  /*
   * =============================================================
   * REACT STATE
   * =============================================================
   */

  const [audioOn, setAudioOn] = useState(false);
  const [selectedMission, setSelectedMission] = useState(destinations[0]);

  const audioEnabled = useRef(false);

  /*
   * =============================================================
   * AUDIO
   * =============================================================
   */

  const ambientAudio = useRef<HTMLAudioElement | null>(null);
  const scanAudio = useRef<HTMLAudioElement | null>(null);
  const navigationAudio = useRef<HTMLAudioElement | null>(null);
  const systemAudio = useRef<HTMLAudioElement | null>(null);
  const countdownAudio = useRef<HTMLAudioElement | null>(null);
  const ignitionAudio = useRef<HTMLAudioElement | null>(null);
  const launchAudio = useRef<HTMLAudioElement | null>(null);
  const whooshAudio = useRef<HTMLAudioElement | null>(null);

  /*
   * =============================================================
   * AUDIO HELPER
   * =============================================================
   */

  const playSound = (audio: HTMLAudioElement | null, volume = 0.5) => {
    if (!audioEnabled.current || !audio) return;

    audio.currentTime = 0;
    audio.volume = volume;

    audio.play().catch(() => {
      // Browser autoplay protection.
    });
  };

  /*
   * =============================================================
   * MAIN EFFECT
   * =============================================================
   */

  useEffect(() => {
    if (!root.current) return;

    /*
     * ===========================================================
     * AUDIO INITIALIZATION
     * ===========================================================
     */

    ambientAudio.current = new Audio("/sounds/ambient-space.mp3");
    scanAudio.current = new Audio("/sounds/scan.mp3");
    navigationAudio.current = new Audio("/sounds/navigation.mp3");
    systemAudio.current = new Audio("/sounds/system-beep.mp3");
    countdownAudio.current = new Audio("/sounds/countdown.mp3");
    ignitionAudio.current = new Audio("/sounds/ignition.mp3");
    launchAudio.current = new Audio("/sounds/launch.mp3");
    whooshAudio.current = new Audio("/sounds/whoosh.mp3");

    ambientAudio.current.loop = true;
    ambientAudio.current.volume = 0.18;

    /*
     * ===========================================================
     * RANDOM DESTINATION
     * ===========================================================
     */

    const randomDestination =
      destinations[Math.floor(Math.random() * destinations.length)];

    setSelectedMission(randomDestination);

    /*
     * ===========================================================
     * GSAP CONTEXT
     * ===========================================================
     */

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /*
       * ===========================================================
       * INITIAL SHIP STATE
       *
       * The ship starts completely dormant.
       * Nothing moves.
       * Nothing glows.
       * The spacecraft is parked.
       * ===========================================================
       */

      gsap.set(spaceship.current, {
        y: 50,
        scale: 0.5,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
      });

      gsap.set(q(".ship-aura"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-ground-glow"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-cockpit-light"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-side-light"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-nav-light"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-engine-glow"), {
        autoAlpha: 0,
        scale: 1,
      });

      gsap.set(q(".engine-flame"), {
        scaleY: 0,
        scaleX: 0.5,
        autoAlpha: 0,
        transformOrigin: "50% 0%",
      });

      gsap.set(q(".ship-awake-status"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-docked-status"), {
        autoAlpha: 1,
      });

      /*
       * ===========================================================
       * CAMERA
       *
       * Start far away.
       * The first cinematic movement is a slow push toward
       * the spacecraft.
       * ===========================================================
       */

      gsap.set(shipCamera.current, {
        scale: 1,
        y: 0,
      });

      /*
       * ===========================================================
       * WELCOME
       * ===========================================================
       */

      gsap.set(welcome.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".welcome-modal"), {
        autoAlpha: 0,
        scale: 0.94,
        y: 25,
      });

      gsap.set(q(".welcome-line"), {
        y: 22,
        autoAlpha: 0,
      });

      /*
       * ===========================================================
       * PILOT
       * ===========================================================
       */

      gsap.set(pilot.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".pilot-line"), {
        y: 25,
        autoAlpha: 0,
      });

      /*
       * ===========================================================
       * DESTINATION
       * ===========================================================
       */

      gsap.set(destination.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".destination-line"), {
        y: 20,
        autoAlpha: 0,
      });

      gsap.set(q(".map-grid"), {
        scale: 1.15,
        opacity: 0,
      });

      gsap.set(q(".map-target"), {
        scale: 0.7,
        opacity: 0,
      });

      /*
       * ===========================================================
       * SYSTEM
       * ===========================================================
       */

      gsap.set(system.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".system-line"), {
        x: -25,
        autoAlpha: 0,
      });

      gsap.set(q(".system-progress"), {
        width: "0%",
      });

      /*
       * ===========================================================
       * COUNTDOWN
       * ===========================================================
       */

      gsap.set(countdown.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".countdown-line"), {
        y: 20,
        autoAlpha: 0,
      });

      /*
       * ===========================================================
       * LAUNCH EFFECTS
       * ===========================================================
       */

      gsap.set(launchGlow.current, {
        scale: 0.25,
        autoAlpha: 0,
      });

      gsap.set(launchFlash.current, {
        opacity: 0,
      });

      /*
       * ===========================================================
       * PILOT SCANNER
       *
       * Runs continuously but is only visible when pilot UI exists.
       * ===========================================================
       */

      gsap.to(q(".pilot-scan-line"), {
        top: "100%",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * ===========================================================
       * ENGINE IDLE
       *
       * Created paused.
       * It will only begin after ignition.
       * ===========================================================
       */

      const engineIdle = gsap.to(q(".engine-flame"), {
        scaleY: 0.86,
        scaleX: 0.94,
        duration: 0.14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      /*
       * ===========================================================
       * SHIP FLOAT
       *
       * The ship is stationary until the power-up sequence
       * has completely finished.
       * ===========================================================
       */

      const shipFloat = gsap.to(spaceship.current, {
        y: -7,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      /*
       * ===========================================================
       * MASTER TIMELINE
       *
       * Long timeline = more cinematic scrolling.
       *
       * Every scene is separated deliberately.
       * No duplicate labels.
       * No scene is responsible for starting another scene.
       * ===========================================================
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=9000",
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
        },
      });

      /*
       * ===========================================================
       * SCENE 1
       * DORMANT SPACECRAFT
       *
       * The viewer first sees the spacecraft from far away.
       *
       * Nothing is powered on.
       * ===========================================================
       */

      timeline
        .addLabel("scene1")

        // Hold the empty space
        .to(
          {},
          {
            duration: 2,
          },
        );

      /*
       * ===========================================================
       * SCENE 2
       * SPACECRAFT POWER-UP
       *
       * The ship is still parked.
       *
       * Power sequence:
       *
       * cockpit
       * ↓
       * navigation
       * ↓
       * side lights
       * ↓
       * engine housing
       * ↓
       * aura
       * ↓
       * ground reflection
       * ↓
       * status
       * ===========================================================
       */

      timeline
        .addLabel("scene2")

        .call(() => {
          playSound(scanAudio.current, 0.45);
        })

        /*
         * Cockpit first.
         */
        .to(
          q(".ship-cockpit-light"),
          {
            autoAlpha: 0.85,
            duration: 0.55,
            ease: "power2.out",
          },
          "scene2",
        )

        /*
         * Navigation lights follow.
         */
        .to(
          q(".ship-nav-light"),
          {
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.16,
            ease: "power2.out",
          },
          "scene2+=0.45",
        )

        /*
         * Side lights.
         */
        .to(
          q(".ship-side-light"),
          {
            autoAlpha: 0.9,
            duration: 0.35,
            stagger: 0.16,
            ease: "power2.out",
          },
          "scene2+=0.8",
        )

        /*
         * Engine housing slowly receives energy.
         */
        .to(
          q(".ship-engine-glow"),
          {
            autoAlpha: 0.55,
            scale: 1.04,
            duration: 0.8,
            ease: "power2.out",
          },
          "scene2+=1.1",
        )

        /*
         * Ship aura.
         */
        .to(
          q(".ship-aura"),
          {
            autoAlpha: 0.3,
            duration: 1,
            ease: "power2.out",
          },
          "scene2+=1.4",
        )

        /*
         * Ground reflection.
         */
        .to(
          q(".ship-ground-glow"),
          {
            autoAlpha: 0.25,
            duration: 0.8,
            ease: "power2.out",
          },
          "scene2+=1.7",
        )

        /*
         * Status transition.
         */
        .to(
          q(".ship-docked-status"),
          {
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.in",
          },
          "scene2+=2.1",
        )

        .to(
          q(".ship-awake-status"),
          {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          "scene2+=2.3",
        )

        /*
         * Hold the completed power state.
         */
        .to(
          {},
          {
            duration: 1.2,
          },
        );

      /*
       * ===========================================================
       * SCENE 4
       * WELCOME PASSENGER
       *
       * Previous scene completely finished.
       * ===========================================================
       */

      timeline
        .addLabel("scene4")

        .set(welcome.current, {
          autoAlpha: 1,
        })

        .call(() => {
          playSound(navigationAudio.current, 0.4);
        })

        /*
         * Small pause before interface appears.
         */
        .to(
          {},
          {
            duration: 0.35,
          },
        )

        /*
         * HUD frame enters.
         */
        .to(q(".welcome-modal"), {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })

        /*
         * Text appears line by line.
         */
        .to(
          q(".welcome-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.18,
            ease: "power3.out",
          },
          "-=0.3",
        )

        /*
         * Hold.
         */
        .to(
          {},
          {
            duration: 1.2,
          },
        )

        /*
         * Complete exit before pilot scene.
         */
        .to(welcome.current, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 0.45,
          },
        );

      /*
       * ===========================================================
       * SCENE 5
       * PILOT IDENTIFICATION
       * ===========================================================
       */

      timeline
        .addLabel("scene5")

        .call(() => {
          playSound(navigationAudio.current, 0.4);
        })

        .set(pilot.current, {
          autoAlpha: 1,
        })

        /*
         * Initial scan pause.
         */
        .to(
          {},
          {
            duration: 0.3,
          },
        )

        /*
         * Pilot data appears.
         */
        .to(q(".pilot-line"), {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.16,
          ease: "power3.out",
        })

        /*
         * Hold information on screen.
         */
        .to(
          {},
          {
            duration: 1.4,
          },
        )

        /*
         * Remove pilot UI completely.
         */
        .to(pilot.current, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 0.45,
          },
        );

      /*
       * ===========================================================
       * SCENE 6
       * NAVIGATION / DESTINATION
       * ===========================================================
       */

      timeline
        .addLabel("scene6")

        .set(destination.current, {
          autoAlpha: 1,
        })

        .call(() => {
          playSound(navigationAudio.current, 0.4);
        })

        /*
         * Map establishes itself first.
         */
        .to(q(".map-grid"), {
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
        })

        /*
         * Destination information.
         */
        .to(
          q(".destination-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.16,
            ease: "power3.out",
          },
          "-=0.35",
        )

        /*
         * Target appears after information.
         */
        .to(q(".map-target"), {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        })

        /*
         * Target pulse.
         */
        .to(q(".map-target"), {
          scale: 1.12,
          duration: 0.45,
          repeat: 2,
          yoyo: true,
          ease: "sine.inOut",
        })

        .call(() => {
          playSound(navigationAudio.current, 0.3);
        })

        /*
         * Hold selected destination.
         */
        .to(
          {},
          {
            duration: 1.1,
          },
        )

        /*
         * Entire navigation UI exits.
         */
        .to(destination.current, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 0.5,
          },
        );

      /*
       * ===========================================================
       * SCENE 7
       * SYSTEM DIAGNOSTICS
       *
       * This is deliberately separated from navigation.
       * ===========================================================
       */

      timeline
        .addLabel("scene7")

        .set(system.current, {
          autoAlpha: 1,
        })

        /*
         * System interface appears.
         */
        .to(q(".system-line"), {
          x: 0,
          autoAlpha: 1,
          duration: 0.45,
          stagger: 0.22,
          ease: "power2.out",
        })

        /*
         * Diagnostic beeps begin after the interface appears.
         */
        .call(() => {
          playSound(systemAudio.current, 0.3);
        })

        /*
         * Progress scan.
         */
        .to(q(".system-progress"), {
          width: "100%",
          duration: 2.1,
          ease: "power1.inOut",
        })

        /*
         * Short completion pause.
         */
        .to(
          {},
          {
            duration: 0.7,
          },
        )

        /*
         * System interface exits.
         */
        .to(system.current, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 1.8,
          },
        );

      /*
       * ===========================================================
       * SCENE 8
       * ENGINE PREPARATION
       *
       * No flame yet.
       *
       * The ship prepares before actual ignition.
       * ===========================================================
       */

      timeline
        .addLabel("scene8")

        /*
         * Engine housing becomes more energetic.
         */
        .to(q(".ship-engine-glow"), {
          autoAlpha: 0.85,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.out",
        })

        /*
         * Aura expands slightly.
         */
        .to(
          q(".ship-aura"),
          {
            autoAlpha: 0.5,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4",
        )

        /*
         * Ground glow increases.
         */
        .to(
          q(".ship-ground-glow"),
          {
            autoAlpha: 0.45,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4",
        )

        .call(() => {
          shipFloat.play();
        })

        /*
         * Brief anticipation pause.
         */
        .to(
          {},
          {
            duration: 1,
          },
        );

      /*
       * ===========================================================
       * SCENE 9
       * ENGINE IGNITION
       * ===========================================================
       */

      timeline
        .addLabel("scene9")

        /*
         * Ignition sound starts first.
         */
        .call(() => {
          playSound(ignitionAudio.current, 0.7);
        })

        /*
         * Engine suddenly intensifies.
         */
        .to(q(".ship-engine-glow"), {
          autoAlpha: 1,
          scale: 1.18,
          duration: 0.45,
          ease: "power2.out",
        })

        /*
         * Small ignition flame.
         */
        .to(q(".engine-flame"), {
          autoAlpha: 1,
          scaleY: 0.3,
          scaleX: 0.75,
          duration: 0.25,
          ease: "power2.out",
        })

        /*
         * Flame grows.
         */
        .to(q(".engine-flame"), {
          scaleY: 1,
          scaleX: 1,
          duration: 0.65,
          ease: "power2.inOut",
        })

        /*
         * Build launch energy.
         */
        .to(launchGlow.current, {
          autoAlpha: 0.45,
          scale: 0.65,
          duration: 0.9,
          ease: "power2.out",
        })

        /*
         * Start engine idle only after ignition is complete.
         */
        .call(() => {
          shipFloat.play();
          engineIdle.play();
        })

        /*
         * Hold the running engine.
         */
        .to(
          {},
          {
            duration: 1.2,
          },
        );

      /*
       * ===========================================================
       * SCENE 10
       * COUNTDOWN
       *
       * The countdown gets its own isolated scene.
       *
       * No launch movement happens here.
       * ===========================================================
       */

      countdownState.current.value = 10;
      lastCountdownValue.current = 10;

      timeline
        .addLabel("scene10")

        .set(countdown.current, {
          autoAlpha: 1,
        })

        /*
         * Countdown UI enters.
         */
        .to(q(".countdown-line"), {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.14,
          ease: "power3.out",
        })

        /*
         * Pause before countdown begins.
         */
        .to(
          {},
          {
            duration: 0.5,
          },
        )

        .set(countNumber.current, {
          textContent: "10",
        })

        /*
         * 10 → 0
         */
        .to(countdownState.current, {
          value: 0,
          duration: 10,
          ease: "none",

          onUpdate: () => {
            if (!countNumber.current) return;

            const nextValue = Math.ceil(countdownState.current.value);

            countNumber.current.textContent = String(nextValue);

            if (
              nextValue !== lastCountdownValue.current &&
              nextValue < lastCountdownValue.current
            ) {
              playSound(countdownAudio.current, 0.42);

              lastCountdownValue.current = nextValue;
            }
          },
        })

        /*
         * Countdown disappears completely.
         */
        .to(countdown.current, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 0.4,
          },
        );

      /*
       * ===========================================================
       * SCENE 11
       * FINAL IGNITION / LAUNCH PREPARATION
       *
       * This is the final moment before movement.
       * ===========================================================
       */

      timeline
        .addLabel("scene11")

        .call(() => {
          shipFloat.pause();
        })

        /*
         * Engine becomes extremely bright.
         */
        .to(q(".ship-engine-glow"), {
          autoAlpha: 1,
          scale: 1.3,
          duration: 0.6,
          ease: "power2.out",
        })

        /*
         * Launch glow expands.
         */
        .to(
          launchGlow.current,
          {
            autoAlpha: 0.8,
            scale: 0.95,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3",
        )

        /*
         * Short tension hold.
         */
        .to(
          {},
          {
            duration: 0.8,
          },
        );

      /*
       * ---------------------------------------------------------
       * SCENE 12 — DEPARTURE / FLY INTO DEEP SPACE
       * ---------------------------------------------------------
       */

      timeline
        // Begin departure
        .call(() => {
          playSound(launchAudio.current);
          playSound(whooshAudio.current);
        })

        // Hide cockpit and glow together
        .to(cockpit.current, {
          opacity: 0,
          scale: 1.03,
          duration: 1.2,
          ease: "power2.inOut",
        })

        // Subtle camera pull-back
        .to(shipCamera.current, {
          scale: 1.08,
          y: -35,
          duration: 0.6,
          ease: "power2.out",
        })

        .to(
          launchGlow.current,
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "power2.in",
          },
          "<",
        )

        // Ship flies forward into deep space
        .to(spaceship.current, {
          // Subtle trajectory
          y: -35,

          // Move away from the viewer
          z: -1200,

          // Get smaller as it travels into the distance
          scale: 0.025,

          // Eventually disappear
          opacity: 0,

          duration: 4,
          ease: "power3.in",
        })

        // Stars subtly react to the ship's departure
        .to(
          ".hero-star-layer",
          {
            scale: 1.15,
            opacity: 0.65,
            duration: 2.5,
            ease: "power2.inOut",
          },
          "<",
        )

        // Final deep-space hold
        .to(
          {},
          {
            duration: 1.5,
          },
        );

      /*
       * ===========================================================
       * PROGRESS BAR
       * ===========================================================
       */

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=9000",

        onUpdate: (self) => {
          if (progressBar.current) {
            progressBar.current.style.transform = `scaleY(${self.progress})`;
          }
        },
      });
    }, root);

    /*
     * ===========================================================
     * CLEANUP
     *
     * No manual DOM manipulation.
     * GSAP context owns the animations.
     * ===========================================================
     */

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
            SPACE BACKGROUND
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
            HORIZON ATMOSPHERE
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
          className="pointer-events-auto absolute right-6 top-20 z-[80] border border-cyan-300/20 bg-black/30 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-300/70 backdrop-blur-md transition hover:border-cyan-300/50 hover:text-cyan-300 md:right-12"
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
            SHIP CAMERA
        ====================================================== */}

        <div ref={shipCamera} className="absolute inset-0 z-10">
          {/* ===================================================
              SPACESHIP
          ==================================================== */}

          {/* =========================================================
              CINEMATIC EXPLORATION SPACECRAFT
          ========================================================= */}
          <div
            ref={spaceship}
            className="spaceship pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2"
          >
            {/* =======================================================
      SHIP AURA
      Hidden initially by GSAP.
  ======================================================== */}

            <div
              className="ship-aura absolute left-1/2 top-1/2 h-[500px] w-[500px]
      -translate-x-1/2 -translate-y-1/2 rounded-full
      bg-cyan-500/10 blur-[120px]"
            />

            {/* =======================================================
      GROUND / ENGINE AMBIENT GLOW
      Hidden initially by GSAP.
  ======================================================== */}

            <div
              className="ship-ground-glow absolute left-1/2 top-[79%]
      h-10 w-[470px] -translate-x-1/2 rounded-[50%]
      bg-cyan-400/20 blur-3xl"
            />

            {/* =======================================================
      SHIP BODY
  ======================================================== */}

            <div className="relative h-[340px] w-[620px]">
              {/* =====================================================
        REAR SHADOW / SILHOUETTE
    ====================================================== */}

              <div
                className="absolute left-1/2 top-[42%]
        h-[115px] w-[480px]
        -translate-x-1/2
        rounded-[50%]
        bg-black/80
        blur-2xl"
              />

              {/* =====================================================
        LEFT OUTER WING
    ====================================================== */}

              <div
                className="absolute left-[8px] top-[126px]
        h-[90px] w-[245px]
        origin-right
        -skew-x-[25deg]
        rounded-[30px_8px_8px_45px]
        border border-white/[0.08]
        bg-gradient-to-br
        from-slate-700/80
        via-slate-900
        to-black"
              >
                {/* Wing armor panel */}

                <div
                  className="absolute left-[35px] top-[15px]
          h-px w-[150px]
          rotate-[-8deg]
          bg-white/[0.12]"
                />

                <div
                  className="absolute left-[55px] top-[42px]
          h-px w-[110px]
          rotate-[-8deg]
          bg-white/[0.06]"
                />

                {/* Wing edge */}

                <div
                  className="absolute bottom-[12px] left-[25px]
          h-px w-[170px]
          rotate-[-7deg]
          bg-slate-400/20"
                />

                {/* Navigation light */}

                <div
                  className="ship-nav-light absolute left-[46px] bottom-[24px]
          h-1.5 w-7 rounded-full
          bg-cyan-300
          opacity-0
          shadow-[0_0_15px_rgba(34,211,238,1)]"
                />
              </div>

              {/* =====================================================
        RIGHT OUTER WING
    ====================================================== */}

              <div
                className="absolute right-[8px] top-[126px]
        h-[90px] w-[245px]
        origin-left
        skew-x-[25deg]
        rounded-[8px_30px_45px_8px]
        border border-white/[0.08]
        bg-gradient-to-bl
        from-slate-700/80
        via-slate-900
        to-black"
              >
                {/* Wing armor panel */}

                <div
                  className="absolute right-[35px] top-[15px]
          h-px w-[150px]
          rotate-[8deg]
          bg-white/[0.12]"
                />

                <div
                  className="absolute right-[55px] top-[42px]
          h-px w-[110px]
          rotate-[8deg]
          bg-white/[0.06]"
                />

                {/* Wing edge */}

                <div
                  className="absolute bottom-[12px] right-[25px]
          h-px w-[170px]
          rotate-[7deg]
          bg-slate-400/20"
                />

                {/* Navigation light */}

                <div
                  className="ship-nav-light absolute right-[46px] bottom-[24px]
          h-1.5 w-7 rounded-full
          bg-cyan-300
          opacity-0
          shadow-[0_0_15px_rgba(34,211,238,1)]"
                />
              </div>

              {/* =====================================================
        MAIN FUSELAGE
    ====================================================== */}

              <div
                className="absolute left-1/2 top-[72px]
        h-[170px] w-[410px]
        -translate-x-1/2
        overflow-visible
        rounded-[46%_46%_24%_24%]
        border border-white/[0.13]
        bg-gradient-to-b
        from-slate-600
        via-slate-800
        to-[#05070b]
        shadow-[0_35px_80px_rgba(0,0,0,0.9)]"
              >
                {/* ===================================================
          TOP ARMOR PLATE
      ==================================================== */}

                <div
                  className="absolute left-1/2 top-[8px]
          h-[42px] w-[270px]
          -translate-x-1/2
          rounded-[50%_50%_20%_20%]
          border border-white/[0.10]
          bg-gradient-to-b
          from-slate-400/20
          to-transparent"
                />

                {/* ===================================================
          CENTER ARMOR RIDGE
      ==================================================== */}

                <div
                  className="absolute left-1/2 top-[25px]
          h-[110px] w-[2px]
          -translate-x-1/2
          bg-gradient-to-b
          from-white/[0.18]
          via-white/[0.04]
          to-transparent"
                />

                {/* ===================================================
          LEFT ARMOR PANEL
      ==================================================== */}

                <div
                  className="absolute left-[28px] top-[70px]
          h-[55px] w-[95px]
          skew-x-[-12deg]
          border border-white/[0.06]
          bg-black/20"
                />

                {/* ===================================================
          RIGHT ARMOR PANEL
      ==================================================== */}

                <div
                  className="absolute right-[28px] top-[70px]
          h-[55px] w-[95px]
          skew-x-[12deg]
          border border-white/[0.06]
          bg-black/20"
                />

                {/* ===================================================
          LOWER ARMOR STRIP
      ==================================================== */}

                <div
                  className="absolute bottom-[23px] left-1/2
          h-[18px] w-[290px]
          -translate-x-1/2
          rounded-full
          border border-white/[0.07]
          bg-black/30"
                />

                {/* ===================================================
          COCKPIT CANOPY
      ==================================================== */}

                <div
                  className="absolute left-1/2 top-[-46px]
          h-[82px] w-[170px]
          -translate-x-1/2
          overflow-hidden
          rounded-[70%_70%_28%_28%]
          border border-slate-300/20
          bg-gradient-to-b
          from-slate-700/70
          via-slate-950
          to-black
          shadow-[inset_0_8px_20px_rgba(255,255,255,0.05)]"
                >
                  {/* Canopy glass */}

                  <div
                    className="absolute inset-[7px]
            rounded-[65%_65%_25%_25%]
            border border-white/[0.07]
            bg-gradient-to-br
            from-slate-500/10
            via-black/60
            to-black"
                  />

                  {/* Canopy center division */}

                  <div
                    className="absolute left-1/2 top-[8px]
            h-[58px] w-px
            -translate-x-1/2
            rotate-[2deg]
            bg-white/[0.08]"
                  />

                  {/* Cockpit reflection */}

                  <div
                    className="absolute left-[25px] top-[14px]
            h-px w-[55px]
            rotate-[12deg]
            bg-white/10"
                  />

                  {/* =================================================
            COCKPIT POWER INDICATOR
            Hidden initially by GSAP.
        ================================================== */}

                  <div
                    className="ship-cockpit-light absolute bottom-[10px]
            left-1/2 h-px w-12
            -translate-x-1/2
            bg-cyan-300
            opacity-0
            shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                  />
                </div>

                {/* ===================================================
          LEFT SIDE NAVIGATION STRIP
      ==================================================== */}

                <div
                  className="absolute left-[42px] top-[133px]
          h-px w-[65px]
          rotate-[-8deg]
          bg-white/[0.08]"
                />

                {/* ===================================================
          RIGHT SIDE NAVIGATION STRIP
      ==================================================== */}

                <div
                  className="absolute right-[42px] top-[133px]
          h-px w-[65px]
          rotate-[8deg]
          bg-white/[0.08]"
                />

                {/* ===================================================
          LEFT SIDE ENGINE POD
      ==================================================== */}

                <div
                  className="absolute left-[36px] bottom-[-24px]
          h-[46px] w-[105px]
          rotate-[5deg]
          rounded-[40%_20%_20%_40%]
          border border-white/[0.10]
          bg-gradient-to-b
          from-slate-700
          via-slate-900
          to-black"
                >
                  {/* Mechanical seam */}

                  <div
                    className="absolute left-[16px] top-1/2
            h-px w-[65px]
            -translate-y-1/2
            bg-white/[0.08]"
                  />

                  {/* Engine opening */}

                  <div
                    className="absolute right-[10px] top-1/2
            h-5 w-8
            -translate-y-1/2
            rounded-full
            border border-slate-400/20
            bg-black"
                  />

                  {/* Side engine light */}

                  <div
                    className="ship-side-light absolute right-[13px] top-1/2
            h-2 w-5
            -translate-y-1/2
            rounded-full
            bg-cyan-200
            opacity-0
            shadow-[0_0_12px_rgba(34,211,238,1)]"
                  />
                </div>

                {/* ===================================================
          RIGHT SIDE ENGINE POD
      ==================================================== */}

                <div
                  className="absolute right-[36px] bottom-[-24px]
          h-[46px] w-[105px]
          -rotate-[5deg]
          rounded-[20%_40%_40%_20%]
          border border-white/[0.10]
          bg-gradient-to-b
          from-slate-700
          via-slate-900
          to-black"
                >
                  {/* Mechanical seam */}

                  <div
                    className="absolute right-[16px] top-1/2
            h-px w-[65px]
            -translate-y-1/2
            bg-white/[0.08]"
                  />

                  {/* Engine opening */}

                  <div
                    className="absolute left-[10px] top-1/2
            h-5 w-8
            -translate-y-1/2
            rounded-full
            border border-slate-400/20
            bg-black"
                  />

                  {/* Side engine light */}

                  <div
                    className="ship-side-light absolute left-[13px] top-1/2
            h-2 w-5
            -translate-y-1/2
            rounded-full
            bg-cyan-200
            opacity-0
            shadow-[0_0_12px_rgba(34,211,238,1)]"
                  />
                </div>

                {/* ===================================================
          MAIN REAR ENGINE HOUSING
      ==================================================== */}

                <div
                  className="absolute bottom-[-12px] left-1/2
          h-[34px] w-[135px]
          -translate-x-1/2
          rounded-[50%]
          border border-white/[0.12]
          bg-gradient-to-b
          from-slate-700
          to-black"
                >
                  {/* Engine chamber */}

                  <div
                    className="absolute left-1/2 top-1/2
            h-[20px] w-[85px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border border-white/[0.08]
            bg-black"
                  />

                  {/* Engine glow */}

                  <div
                    className="ship-engine-glow absolute left-1/2 top-1/2
            h-[12px] w-[70px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-300/70
            opacity-0
            blur-md"
                  />

                  {/* Engine flame */}

                  <div
                    className="engine-flame absolute bottom-[-8px] left-1/2
            h-[28px] w-[42px]
            -translate-x-1/2
            origin-top
            rounded-[50%]
            bg-white
            opacity-0
            shadow-[0_0_22px_rgba(34,211,238,1)]"
                  />
                </div>

                {/* ===================================================
          LOWER REACTOR / STRUCTURAL DETAILS
      ==================================================== */}

                <div
                  className="absolute bottom-[-2px] left-1/2
          h-[8px] w-[240px]
          -translate-x-1/2
          rounded-full
          bg-black/70"
                />

                <div
                  className="absolute bottom-[2px] left-[82px]
          h-1 w-12
          bg-slate-500/20"
                />

                <div
                  className="absolute bottom-[2px] right-[82px]
          h-1 w-12
          bg-slate-500/20"
                />
              </div>

              {/* =====================================================
        TOP FIN / SENSOR ARRAY
    ====================================================== */}

              <div
                className="absolute left-1/2 top-[38px]
        h-[55px] w-[42px]
        -translate-x-1/2
        border-x border-t border-white/[0.10]
        bg-gradient-to-b from-slate-700/50 to-black/60
        [clip-path:polygon(50%_0%,100%_100%,0%_100%)]"
              />

              {/* =====================================================
        LEFT REAR FIN
    ====================================================== */}

              <div
                className="absolute left-[125px] top-[105px]
        h-[55px] w-[35px]
        rotate-[-25deg]
        border border-white/[0.08]
        bg-slate-900"
              />

              {/* =====================================================
        RIGHT REAR FIN
    ====================================================== */}

              <div
                className="absolute right-[125px] top-[105px]
        h-[55px] w-[35px]
        rotate-[25deg]
        border border-white/[0.08]
        bg-slate-900"
              />

              {/* =====================================================
        SHIP TELEMETRY
    ====================================================== */}

              <div
                className="absolute left-1/2 top-[calc(100%+18px)]
        -translate-x-1/2
        whitespace-nowrap
        text-center
        font-mono text-[8px]
        uppercase tracking-[0.35em]
        text-white/30"
              >
                <div>VESSEL // RA-01</div>

                <div className="relative mt-1">
                  {/* Initial state */}

                  <span className="ship-docked-status text-white/30">
                    DOCKED • SYSTEMS STANDBY
                  </span>

                  {/* Activated state */}

                  <span
                    className="ship-awake-status absolute left-0 top-0
            text-cyan-300 opacity-0"
                  >
                    AWAKE • FLIGHT SYSTEMS ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SCENE 1
            COCKPIT
        ====================================================== */}

        <div
          ref={cockpit}
          className="cockpit-frame pointer-events-none absolute inset-0 z-30"
        >
          {/* TOP COCKPIT FRAME */}
          <div className="absolute left-0 right-0 top-0 h-[14vh] border-b border-white/10 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.5em] text-white/25">
              FLIGHT DECK
            </div>
          </div>

          {/* BOTTOM COCKPIT / DASHBOARD */}
          <div className="absolute bottom-0 left-1/2 h-[32vh] w-[120%] -translate-x-1/2 rounded-[50%_50%_0_0] border border-white/10 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* BOTTOM STATUS */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-[8px] tracking-[0.4em] text-white/25">
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            FLIGHT DECK
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
          </div>
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
            SCENE 8
            COUNTDOWN
        ====================================================== */}

        <div
          ref={countdown}
          className="hero-scene absolute inset-0 z-50 flex items-center justify-center"
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
            ENGINE / LAUNCH GLOW
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
      </div>
    </section>
  );
}
