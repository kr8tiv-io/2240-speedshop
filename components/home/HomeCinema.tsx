"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/lib/site";
import { splitChars } from "@/lib/split";
import { Preloader } from "./Preloader";
import { HeroScene, type Shot } from "./HeroScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The film, in three acts. One 900vh runway, one sticky stage, ONE master
 * ScrollTrigger timeline of 300 beats — a hundred per act.
 *
 * A single scrubbed float, `shot.film` (0 → 3), is the entire projector: the
 * scene derives from it which car is on stage, how far its matrix reveal has
 * assembled, and where the camera sits along that act's arc. Because the
 * reveal curve is zero at both ends of every act, the cut between cars ALWAYS
 * lands on a frame where the stage is empty. Nothing to keep in sync.
 *
 *   ACT I    the finished car     Challenger, oxblood candy, one lamp on
 *   ACT II   the bay              1972 coupe, hood up, lamp down in the motor
 *   ACT III  the donor            pre-war shell, moonlight through the door
 *
 * All chapter copy is DOM, prerendered in the build, layered over the canvas.
 * Reduced motion / no-JS: the copy is stacked over a static graded photograph.
 */

/** Beats are absolute on the 300-beat timeline. One act = 100. */
const ACT = [0, 100, 200];

export function HomeCinema() {
  const shot = useRef<Shot>({
    film: 0,
    flare: 0,
    lamp: 1,
    warm: 0,
    cool: 0,
    tail: 0,
  }).current;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [heroActive, setHeroActive] = useState(true);
  /** Set once every shader in the film is compiled — gates the preloader. */
  const [sceneReady, setSceneReady] = useState(false);
  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const flared = useRef(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Once the film is scrolled past, the sticky canvas is invisible — stop
  // rendering it entirely (frameloop "never") until it scrolls back in.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([e]) => setHeroActive(e.isIntersecting), {
      rootMargin: "160px 0px",
    });
    io.observe(wrap);
    return () => io.disconnect();
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const q = gsap.utils.selector(wrap);

      /* Kinetic H1: split once, revealed when the preloader hands off. */
      const h1 = wrap.querySelector<HTMLElement>("[data-kinetic-h1]");
      let h1Chars: HTMLElement[] = [];
      if (h1) h1Chars = splitChars(h1);

      const reveal = gsap.timeline({ paused: true });
      reveal.to(h1Chars, { y: 0, duration: 1.0, ease: "power4.out", stagger: 0.018 });
      reveal.fromTo(
        q("[data-ch0-sub]"),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
        0.35,
      );
      wrap.addEventListener("cinema:start", () => reveal.play(), { once: true });

      /* The act HUD: mono readout, room caption and a 1px progress rule,
         ticked from the same ScrollTrigger that drives the film. */
      const hudAct = wrap.querySelector<HTMLElement>("[data-hud-act]");
      const hudRoom = wrap.querySelector<HTMLElement>("[data-hud-room]");
      const hudBar = wrap.querySelector<HTMLElement>("[data-hud-bar]");
      const barSet = hudBar ? gsap.quickSetter(hudBar, "scaleX") : null;
      const ROOMS = ["ONE LAMP ON", "HOOD UP · BAY TWO", "BACK BAY · MOONLIGHT"];
      let lastAct = -1;

      /* The master timeline: 300 beats of film. */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (!flared.current && self.progress > 0.005) {
              flared.current = true;
              // The headlights flare once, then settle to a low burn.
              gsap
                .timeline()
                .to(shot, { flare: 1, duration: 0.16, ease: "power2.in" })
                .to(shot, { flare: 0.22, duration: 0.9, ease: "power2.out" });
            }
            // HUD: the rule fills with the film; the readout ticks per act
            // with a tungsten flash on change. The act comes from PROGRESS,
            // not shot.film — the scrub tween settles after the last scroll
            // event, and onUpdate would sample it one beat stale.
            barSet?.(self.progress);
            const act = Math.min(2, Math.floor(self.progress * 3));
            if (act !== lastAct) {
              lastAct = act;
              if (hudAct) {
                hudAct.textContent = `ACT 0${act + 1}`;
                gsap.fromTo(
                  hudAct,
                  { color: "#ffd9ad" },
                  { color: "#ffb066", duration: 0.8, ease: "power2.out" },
                );
              }
              if (hudRoom) {
                hudRoom.textContent = ROOMS[act];
                gsap.fromTo(hudRoom, { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 0.7 });
              }
              if (hudBar) {
                gsap.fromTo(
                  hudBar,
                  { backgroundColor: "rgba(255,217,173,1)" },
                  { backgroundColor: "rgba(255,176,102,0.8)", duration: 0.8, ease: "power2.out" },
                );
              }
            }
          },
        },
      });

      /* THE PROJECTOR. One linear float; the scene does the rest. */
      tl.to(shot, { film: 3, duration: 300 }, 0);

      /* ── ACT I — the finished car ───────────────────────────────────── */
      // The title card holds while the Challenger precipitates in behind it.
      tl.to(q("[data-scroll-cue]"), { autoAlpha: 0, duration: 6 }, 4);
      tl.to(q("[data-chapter='0']"), { autoAlpha: 0, y: -70, duration: 9 }, 24);
      tl.fromTo(
        q("[data-chapter='1']"),
        { autoAlpha: 0, y: 46 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[0] + 42,
      );
      tl.to(q("[data-chapter='1']"), { autoAlpha: 0, y: -46, duration: 6 }, ACT[0] + 76);
      // The lamp swings warmer and tighter over the finished paint.
      tl.to(shot, { warm: 1, duration: 8 }, ACT[0] + 28);
      tl.to(shot, { warm: 0.3, duration: 10 }, ACT[0] + 70);

      /* ── INTERLUDE 01 — the written beat, on the empty stage ─────────── */
      // Lives in the gap the Director leaves: the ACT I car is gone by beat 90
      // and the ACT II car does not start building until beat 110.
      tl.fromTo(
        q("[data-interlude='0']"),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[0] + 88,
      );
      tl.to(q("[data-interlude='0']"), { autoAlpha: 0, y: -30, duration: 6 }, ACT[1] + 10);

      /* ── ACT II — the bay, hood up ──────────────────────────────────── */
      tl.fromTo(
        q("[data-slate='1']"),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 5 },
        ACT[1] + 22,
      );
      tl.to(q("[data-slate='1']"), { autoAlpha: 0, duration: 5 }, ACT[1] + 40);
      tl.fromTo(
        q("[data-chapter='2']"),
        { autoAlpha: 0, y: 46 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[1] + 50,
      );
      tl.to(q("[data-chapter='2']"), { autoAlpha: 0, y: -46, duration: 6 }, ACT[1] + 78);

      /* ── INTERLUDE 02 — the second written beat ──────────────────────── */
      tl.fromTo(
        q("[data-interlude='1']"),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[1] + 88,
      );
      tl.to(q("[data-interlude='1']"), { autoAlpha: 0, y: -30, duration: 6 }, ACT[2] + 10);
      // Inspection light: warm and close, with a thin cool bounce off the wing.
      tl.to(shot, { warm: 0.75, cool: 0.4, duration: 10 }, ACT[1] + 10);
      tl.to(shot, { warm: 0.2, duration: 10 }, ACT[1] + 72);

      /* ── ACT III — the donor ────────────────────────────────────────── */
      tl.fromTo(
        q("[data-slate='2']"),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 5 },
        ACT[2] + 22,
      );
      tl.to(q("[data-slate='2']"), { autoAlpha: 0, duration: 5 }, ACT[2] + 40);
      tl.fromTo(
        q("[data-chapter='3']"),
        { autoAlpha: 0, y: 46 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[2] + 52,
      );
      // Moonlight rises off the bay door; the lamp dims; the tail glow leads
      // the last move and the film ends on a lit car, never an empty room.
      tl.to(shot, { cool: 1, duration: 12 }, ACT[2] + 12);
      tl.to(shot, { lamp: 0.45, duration: 12 }, ACT[2] + 40);
      tl.to(shot, { tail: 1, duration: 12 }, ACT[2] + 62);

      /* Display echoes inside the film: the outline layer drifts against its
         bone face for the whole three hundred beats. */
      tl.fromTo(q("[data-echo-film]"), { y: 22 }, { y: -26, duration: 300 }, 0);
    },
    { scope: wrapRef, dependencies: [reduced] },
  );

  const onPreloaderDone = () => {
    setReady(true);
    wrapRef.current?.dispatchEvent(new Event("cinema:start"));
  };

  /* ── Reduced motion: a still composition, everything readable. ────────── */
  if (reduced) {
    return (
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
        <StaticBackdrop />
        <div className="relative mx-auto w-full max-w-[92rem] px-5 pb-20 pt-40 sm:px-8">
          <ChapterZeroCopy />
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <Preloader onDone={onPreloaderDone} sceneReady={sceneReady} />

      {/* the runway — its height IS the length of the film, three acts of it */}
      {/* 1200vh, not 900: the two written interludes need real scroll of their
          own or they flash past between cars. */}
      <div data-film className="relative h-[1200vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* the stage */}
          <div className="absolute inset-0">
            <HeroScene shot={shot} mobile={mobile} active={heroActive} onReady={onSceneReady} />
          </div>

          {/* corner instrumentation + act HUD. Below 380px the coordinates
              and the readout cannot share a line without colliding — and the
              readout is the one carrying information, so the coordinates go. */}
          <div className="pointer-events-none absolute inset-x-0 top-[72px] flex justify-between px-5 sm:px-8">
            <p className="corner-note hidden min-[380px]:block">53.4818°N — 113.3773°W</p>
            {/* ml-auto, not justify-between alone: once the coordinates hide
                below 380px this becomes the only child and space-between
                parks it on the LEFT. */}
            <div className="ml-auto text-right">
              <p className="corner-note hidden sm:block">
                AFTER HOURS · <span data-hud-room>ONE LAMP ON</span>
              </p>
              <p className="corner-note mt-1.5">
                <span data-hud-act className="text-tungsten">ACT 01</span>
                <span className="text-steel/40"> / 03</span>
              </p>
              <div className="hud-rule ml-auto mt-2">
                <span data-hud-bar />
              </div>
            </div>
          </div>

          {/* CH.00 — the title card. `inset-0` + justify-end rather than
              `bottom-0`: on a 320x568 SE the block is taller than the room it
              had, and anchored only at the bottom it grew UP through the nav —
              the headline came out on top of the wordmark. Pinned top and
              bottom it can only ever run out of space downwards, and the type
              scale below makes sure it does not. */}
          <div
            data-chapter="0"
            className="absolute inset-0 flex flex-col justify-end px-5 pb-9 pt-[84px] sm:px-8 sm:pb-20"
          >
            <div className="mx-auto w-full max-w-[92rem]">
              <ChapterZeroCopy kinetic ready={ready} />
            </div>
          </div>

          {/* CH.01 — the standard (ACT I) */}
          <div
            data-chapter="1"
            className="pointer-events-none absolute inset-0 flex items-end px-5 pb-8 pt-[84px] opacity-0 sm:items-center sm:px-8 sm:py-0"
          >
            <div className="copy-plate mx-auto w-full max-w-[92rem]">
              <p className="corner-note text-tungsten">ACT I — THE ONE THAT GETS LOOKED AT</p>
              <div className="relative mt-4 max-w-4xl sm:mt-5">
                <p
                  aria-hidden="true"
                  data-echo-film
                  className="echo-outline text-balance font-display text-[clamp(2.05rem,8.2vw,6.5rem)] uppercase leading-[0.95] tracking-[0.005em] sm:leading-[0.86]"
                >
                  Parked, it still <em className="accent-serif">stops</em> people.
                </p>
                <h2 className="text-balance font-display text-[clamp(2.05rem,8.2vw,6.5rem)] uppercase leading-[0.95] tracking-[0.005em] text-bone sm:leading-[0.86]">
                  Parked, it still <em className="accent-serif">stops</em> people.
                </h2>
              </div>
              <p className="mt-5 max-w-md font-body text-[15px] leading-[1.7] text-steel sm:mt-6 sm:text-base">
                Last September a photographer pulled over mid-drive to shoot the shop&rsquo;s D100 —
                patina, rust-bloomed tailgate, no wax on it. Nobody staged that. That is the whole
                job: build the one that makes a stranger turn the car around.
              </p>
              <Link
                href="/builds/1960s-dodge-d100"
                className="pointer-events-auto mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.24em] text-tungsten transition-colors hover:text-ember sm:mt-6"
              >
                The D100&rsquo;s build page →
              </Link>
            </div>
          </div>

          {/* INTERLUDE 01 — the writing beat between ACT I and ACT II */}
          <Interlude
            index={0}
            eyebrow={["INTERLUDE 01", "INTERLUDE — WHAT YOU ARE ACTUALLY BUYING"]}
            lead={
              <>
                A restoration is a <em className="accent-serif">decision</em>, not a purchase.
              </>
            }
            body="You are not buying parts and labour. You are deciding what this car is going to be for the next thirty years — how it sits, what it sounds like at 2,000 rpm, whether the door still shuts like a bank vault in 2055. That decision gets made once. Most of what people regret is the shop that made it for them without asking."
            stat={{ figure: "200–400", caption: "extra hours a true frame-off adds. We quote them out loud." }}
          />

          {/* ACT II slate — the room announces itself as the coupe assembles */}
          <ActSlate
            index={1}
            act="ACT II"
            title="Hood up"
            subject="1972 coupe · mid-build, panels in primer"
            note="THE HONEST PART OF THE JOB"
          />

          {/* CH.02 — six trades (ACT II) */}
          <div
            data-chapter="2"
            className="pointer-events-none absolute inset-0 flex items-end justify-end px-5 pb-8 pt-[84px] opacity-0 sm:items-center sm:px-8 sm:py-0"
          >
            <div className="copy-plate text-right w-full max-w-xl">
              <p className="corner-note text-tungsten">ACT II — NOBODY SUBS THIS OUT</p>
              <div className="relative mt-4 sm:mt-5">
                <p
                  aria-hidden="true"
                  data-echo-film
                  className="echo-outline text-balance font-display text-[clamp(2.05rem,7.8vw,6rem)] uppercase leading-[0.95] tracking-[0.005em] sm:leading-[0.86]"
                >
                  It never <em className="accent-serif">leaves</em> the building.
                </p>
                <h2 className="text-balance font-display text-[clamp(2.05rem,7.8vw,6rem)] uppercase leading-[0.95] tracking-[0.005em] text-bone sm:leading-[0.86]">
                  It never <em className="accent-serif">leaves</em> the building.
                </h2>
              </div>
              <p className="mt-4 font-body text-[15px] leading-[1.7] text-steel sm:mt-5 sm:text-base">
                Most shops farm out the paint, then the trim, then the wiring — and your car spends
                a year in other people&rsquo;s parking lots. Here the metal, the motor, the colour
                and the interior all happen under one roof, with one person answerable for it.
              </p>
              {/* 12px mono at 0.22em wraps every one of these onto two lines at
                  320 — six rows become twelve and the list swallows the shot. */}
              <ul className="mt-5 space-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-steel sm:mt-6 sm:space-y-1.5 sm:text-[12px] sm:tracking-[0.2em]">
                <li>Frame-off &amp; rolling restorations</li>
                <li>Restomods and proper hot rods</li>
                <li>LS swaps · diesel conversions</li>
                <li>Carbs, ignition, tune</li>
                <li>Metal, body, colour</li>
                <li>Interiors and trim</li>
              </ul>
            </div>
          </div>

          {/* INTERLUDE 02 — the writing beat between ACT II and ACT III */}
          <Interlude
            index={1}
            eyebrow={["INTERLUDE 02", "INTERLUDE — THE PART NOBODY PHOTOGRAPHS"]}
            lead={
              <>
                Anyone can make it shiny. <em className="accent-serif">Straight</em> is the hard part.
              </>
            }
            body="Gaps, reveals, the way a body line carries from the front fender through the door and lands on the quarter. That work happens in bare metal and primer, months before anything gets sprayed, and it is the entire difference between a car that photographs well and a car that holds up when someone who knows walks around it."
            stat={{ figure: "One", caption: "person owns your build start to finish. You will have his number." }}
          />

          {/* ACT III slate */}
          <ActSlate
            index={2}
            act="ACT III"
            title="Yours next"
            subject="Late-60s Charger · original paint, kept"
            note="EVERY ONE OF THESE STARTED AS A PHONE CALL"
          />

          {/* CH.03 — the sheet (ACT III) */}
          <div
            data-chapter="3"
            className="pointer-events-none absolute inset-0 flex items-end px-5 pb-8 pt-[84px] opacity-0 sm:items-center sm:px-8 sm:py-0"
          >
            <div className="copy-plate mx-auto w-full max-w-[92rem]">
              <p className="corner-note text-tungsten">ACT III — BRING US THE PROBLEM</p>
              <div className="relative mt-4 max-w-3xl sm:mt-5">
                <p
                  aria-hidden="true"
                  data-echo-film
                  className="echo-outline text-balance font-display text-[clamp(2.05rem,8.2vw,6.5rem)] uppercase leading-[0.95] tracking-[0.005em] sm:leading-[0.86]"
                >
                  Tell me what it&rsquo;s <em className="accent-serif">worth</em> to you.
                </p>
                <h2 className="text-balance font-display text-[clamp(2.05rem,8.2vw,6.5rem)] uppercase leading-[0.95] tracking-[0.005em] text-bone sm:leading-[0.86]">
                  Tell me what it&rsquo;s <em className="accent-serif">worth</em> to you.
                </h2>
              </div>
              <p className="mt-5 max-w-md font-body text-[15px] leading-[1.7] text-steel sm:mt-6 sm:text-base">
                {/* The tallest copy block on the page. At 320 the full version
                    still reached the car; phones get the short cut. */}
                <span className="sm:hidden">
                  Barn find, stalled project, or a car that deserves better. Terry reads every
                  request himself — real hours, a real number, two business days.
                </span>
                <span className="hidden sm:inline">
                  Barn find, stalled project, or the car you already love that deserves better than
                  it&rsquo;s getting. Terry reads every request himself and tells you straight what
                  it takes — real hours, a real number, two business days. No discovery fee, no
                  sales guy, no runaround.
                </span>
              </p>
              <div className="pointer-events-auto mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                <Link href="/quote" data-magnetic className="cta cta-compact">
                  Start your build
                </Link>
                <a href={`tel:${site.phone}`} className="cta cta-ghost cta-compact">
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * THE INTERLUDE — the written beat between two cars.
 *
 * The film used to be car, car, car. Now each vehicle dissolves away, the
 * stage sits genuinely empty, and a page of writing owns the frame before the
 * next one builds. It plays in the wide gap the Director leaves between acts
 * (reveal is zero from 0.90 of one act to 0.10 of the next), so it costs no
 * extra scroll machinery — the empty stage WAS the opportunity.
 */
function Interlude({
  index,
  eyebrow,
  lead,
  body,
  stat,
}: {
  index: number;
  /** [phone, desktop] — the long form wraps to two lines at 320 and pushes
      the whole centred block up under the fixed nav. */
  eyebrow: [string, string];
  lead: React.ReactNode;
  body: string;
  stat: { figure: string; caption: string };
}) {
  return (
    <div
      data-interlude={index}
      className="pointer-events-none absolute inset-0 flex items-center px-5 py-[76px] opacity-0 sm:px-8 sm:py-0"
    >
      <div className="copy-plate mx-auto w-full max-w-[68rem]">
        <p className="corner-note text-tungsten">
          <span className="sm:hidden">{eyebrow[0]}</span>
          <span className="hidden sm:inline">{eyebrow[1]}</span>
        </p>
        <p className="mt-4 max-w-3xl text-balance font-display text-[clamp(1.5rem,5.4vw,3.6rem)] uppercase leading-[1.06] tracking-[0.005em] text-bone sm:mt-6 sm:leading-[0.98]">
          {lead}
        </p>
        <div className="mt-5 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:items-start sm:gap-12">
          <p className="max-w-lg font-body text-[13.5px] leading-[1.62] text-steel sm:text-base sm:leading-[1.75]">
            {body}
          </p>
          <div className="shrink-0 border-l border-tungsten/30 pl-4 sm:pl-5">
            <p className="font-display text-[clamp(1.6rem,5vw,3.4rem)] leading-none text-tungsten">
              {stat.figure}
            </p>
            <p className="corner-note mt-2 max-w-[15rem]">{stat.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The act slate: the mono card that flashes up while a new car is still
 * assembling out of its point cloud — a title card for the machine on stage.
 */
function ActSlate({
  index,
  act,
  title,
  subject,
  note,
}: {
  index: number;
  act: string;
  title: string;
  subject: string;
  note: string;
}) {
  return (
    <div
      data-slate={index}
      className="pointer-events-none absolute inset-x-0 top-[58%] px-5 opacity-0 sm:top-[36%] sm:px-8"
    >
      <div className="mx-auto max-w-[92rem]">
        <div className="copy-plate max-w-md border-l border-tungsten/40 pl-4 sm:pl-5">
          <p className="corner-note text-tungsten">
            {act} — {note}
          </p>
          <p className="mt-2 font-display text-[clamp(1.65rem,6.4vw,3.2rem)] uppercase leading-[0.92] tracking-[0.02em] text-bone">
            {title}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-steel sm:text-[11px] sm:tracking-[0.22em]">
            Subject — {subject}
          </p>
        </div>
      </div>
    </div>
  );
}

/* The H1 block — shared by the film and the reduced-motion still. */
function ChapterZeroCopy({ kinetic = false }: { kinetic?: boolean; ready?: boolean }) {
  return (
    <div>
      <p data-ch0-sub className="corner-note text-tungsten" style={kinetic ? { opacity: 0 } : undefined}>
        {/* Two lines of address on a 320 is a line of vertical budget spent on
            something the footer already says — the street alone still places
            the shop. */}
        <span className="sm:hidden">{site.street} · Sherwood Park line</span>
        <span className="hidden sm:inline">
          {site.name} · {site.street} · Sherwood Park line
        </span>
      </p>
      {/* The display clamp floors at 2.45rem, not 3.4rem: at 320px the old
          floor put two 54px lines plus copy plus two stacked buttons into a
          568px-tall screen, and something had to give. */}
      <div className="relative mt-3 sm:mt-4">
        <p
          aria-hidden="true"
          data-echo-film
          className="echo-outline whitespace-pre-line font-display text-[clamp(2.45rem,12.5vw,12rem)] uppercase leading-[0.84] tracking-[0.005em]"
        >
          {"Customs "}
          <em className="accent-serif">and</em>
          {"\nclassics."}
        </p>
        <h1
          data-kinetic-h1={kinetic ? "" : undefined}
          data-accent-word="and"
          className="whitespace-pre-line font-display text-[clamp(2.45rem,12.5vw,12rem)] uppercase leading-[0.84] tracking-[0.005em] text-bone"
        >
          {"Customs and\nclassics."}
        </h1>
      </div>
      <div
        data-ch0-sub
        className="mt-5 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
        style={kinetic ? { opacity: 0 } : undefined}
      >
        <p className="max-w-md font-body text-[15px] leading-relaxed text-steel sm:text-base">
          Restorations, restomods, and engine swaps from a working shop on the Sherwood Park line.
          Built in Edmonton. Driven anywhere.
        </p>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link href="/quote" data-magnetic className="cta cta-compact">
            Start your build
          </Link>
          <Link href="/builds" className="cta cta-ghost cta-compact">
            See the work
          </Link>
        </div>
      </div>
      <p data-scroll-cue className="corner-note mt-6 flex items-center gap-3 sm:mt-10">
        <span className="inline-block h-px w-10 shrink-0 bg-tungsten/50" />
        {/* The full line wraps onto two at 320 and the rule ends up beside a
            fragment. Shorter cue below sm; same promise. */}
        <span className="sm:hidden">SCROLL — THREE CARS</span>
        <span className="hidden sm:inline">SCROLL — THREE CARS, ONE LAMP</span>
      </p>
    </div>
  );
}

function StaticBackdrop() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src="/shop/IMG_0434-black-muscle-car.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="graded object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bay-black via-bay-black/70 to-bay-black/30" />
    </div>
  );
}

export default HomeCinema;
