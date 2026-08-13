"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/lib/site";
import { splitChars } from "@/lib/split";
import { RollText } from "@/components/fx/RollText";
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
 * lands on a frame where the cyc is empty. Nothing to keep in sync.
 *
 *   ACT I    the finished car     Challenger, speed red, full white box
 *   ACT II   the bay              1972 coupe, hood up, primer and copper
 *   ACT III  the driver           1960s pickup, patina, overcast rim
 *
 * All chapter copy is DOM, prerendered in the build, layered over the canvas.
 * Reduced motion / no-JS: the copy is stacked over a static graded photograph.
 */

/** Beats are absolute on the 300-beat timeline. One act = 100. */
const ACT = [0, 100, 200];

export function HomeCinema() {
  const shot = useRef<Shot>({ film: 0, flare: 0 }).current;
  const wrapRef = useRef<HTMLDivElement>(null);
  const hudLabelRef = useRef<HTMLParagraphElement>(null);
  const hudRoomRef = useRef<HTMLSpanElement>(null);
  const hudBarRef = useRef<HTMLDivElement>(null);
  const hudAct = useRef(-1);
  const hudProgress = useRef(-1);
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
      // Static echoes on phones: the drift tweens repaint large stroked text
      // under throttled CPUs — desktop-only depth, mobile keeps the layer.
      const phone = window.matchMedia("(max-width: 767px)").matches;

      /* Kinetic H1: split once, revealed when the preloader hands off. */
      const h1 = wrap.querySelector<HTMLElement>("[data-kinetic-h1]");
      let h1Chars: HTMLElement[] = [];
      if (h1) h1Chars = splitChars(h1);

      const reveal = gsap.timeline({ paused: true });
      reveal.to(h1Chars, { y: 0, duration: 1.0, ease: "power4.out", stagger: 0.018 });
      reveal.fromTo(
        q("[data-h1-ghost]"),
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power4.out" },
        0.42,
      );
      reveal.fromTo(
        q("[data-ch0-sub]"),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
        0.35,
      );
      wrap.addEventListener("cinema:start", () => reveal.play(), { once: true });

      const ROOMS = ["WHITE BOX", "HOOD UP · BAY TWO", "OPEN DOOR · OVERCAST"];

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
              // The taillights pulse red once, then settle to a low burn.
              gsap
                .timeline()
                .to(shot, { flare: 1, duration: 0.16, ease: "power2.in" })
                .to(shot, { flare: 0.22, duration: 0.9, ease: "power2.out" });
            }
            // Act HUD — mono ticker + 1px progress rule, refs only, no React
            // state in the scroll hot path. The act comes from PROGRESS, not
            // shot.film: the scrub tween settles after the last scroll event
            // and would be sampled one beat stale.
            const p = self.progress;
            const act = Math.min(2, Math.floor(p * 3));
            if (hudAct.current !== act) {
              hudAct.current = act;
              if (hudLabelRef.current) hudLabelRef.current.textContent = `ACT 0${act + 1} / 03`;
              if (hudRoomRef.current) {
                hudRoomRef.current.textContent = ROOMS[act];
                gsap.fromTo(hudRoomRef.current, { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 0.7 });
              }
            }
            if (hudBarRef.current && Math.abs(p - hudProgress.current) > 0.004) {
              hudProgress.current = p;
              hudBarRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
            }
          },
        },
      });

      /* THE PROJECTOR. One linear float; the scene does the rest. */
      tl.to(shot, { film: 3, duration: 300 }, 0);

      /* ── ACT I — the finished car ───────────────────────────────────── */
      tl.to(q("[data-scroll-cue]"), { autoAlpha: 0, duration: 6 }, 4);
      // The echo lags the face (+26 against the container's −70) for parallax.
      tl.to(q("[data-chapter='0']"), { autoAlpha: 0, y: -70, duration: 9 }, 24);
      if (!phone) tl.to(q("[data-h1-ghost]"), { y: 26, duration: 9 }, 24);
      tl.fromTo(
        q("[data-chapter='1']"),
        { autoAlpha: 0, y: 46 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[0] + 42,
      );
      if (!phone) {
        tl.fromTo(q("[data-chapter='1'] .echo-ghost"), { y: 15 }, { y: -15, duration: 30 }, ACT[0] + 42);
      }
      tl.to(q("[data-chapter='1']"), { autoAlpha: 0, y: -46, duration: 6 }, ACT[0] + 76);

      /* ── INTERLUDE 01 — the written beat, on the empty cyc ───────────── */
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
      if (!phone) {
        tl.fromTo(q("[data-chapter='2'] .echo-ghost"), { y: 15 }, { y: -15, duration: 30 }, ACT[1] + 50);
      }
      tl.to(q("[data-chapter='2']"), { autoAlpha: 0, y: -46, duration: 6 }, ACT[1] + 78);

      /* ── INTERLUDE 02 — the second written beat ──────────────────────── */
      tl.fromTo(
        q("[data-interlude='1']"),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 7 },
        ACT[1] + 88,
      );
      tl.to(q("[data-interlude='1']"), { autoAlpha: 0, y: -30, duration: 6 }, ACT[2] + 10);

      /* ── ACT III — the driver ───────────────────────────────────────── */
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
      if (!phone) {
        tl.fromTo(q("[data-chapter='3'] .echo-ghost"), { y: 12 }, { y: -8, duration: 20 }, ACT[2] + 44);
      }
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
      <div data-film className="relative h-[1200vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* the stage */}
          <div className="absolute inset-0">
            <HeroScene shot={shot} mobile={mobile} active={heroActive} onReady={onSceneReady} />
          </div>

          {/* corner instrumentation. Below 380px the coordinates and the act
              readout cannot share a line without colliding — and the readout
              is the one carrying information, so the coordinates go. */}
          <div className="pointer-events-none absolute inset-x-0 top-[72px] flex justify-between px-5 sm:px-8">
            <p className="corner-note hidden min-[380px]:block">53.4818°N — 113.3773°W</p>
            <p className="corner-note hidden sm:block">
              DAYLIGHT · <span ref={hudRoomRef}>WHITE BOX</span>
            </p>
          </div>

          {/* act HUD — ticks as acts pass; 1px film-progress rule */}
          <div className="pointer-events-none absolute right-5 top-[98px] text-right sm:right-8">
            <p ref={hudLabelRef} className="corner-note">
              ACT 01 / 03
            </p>
            <div className="ml-auto mt-1.5 h-px w-16 bg-[#141414]/10">
              <div
                ref={hudBarRef}
                className="h-full w-full origin-left bg-tungsten/80"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* CH.00 — the title card */}
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
            {/* Mobile-only readability scrim: at 390px the copy block lands on
                the red body panels — feather a paper gradient up behind it so
                the secondary text stays legible. Invisible on the white cyc,
                gone at sm+ where the copy sits clear of the car. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[-30%] bg-gradient-to-t from-bay-black via-bay-black/75 to-transparent sm:hidden"
            />
            <div className="relative mx-auto w-full max-w-[92rem]">
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
              <h2 className="relative mt-4 max-w-4xl font-display text-[clamp(2.05rem,8.2vw,6.5rem)] uppercase leading-[0.88] tracking-[0.01em] text-bone sm:mt-5">
                <span aria-hidden="true" className="echo-ghost">
                  Parked, it still <em data-accent>stops</em> people.
                </span>
                <span className="relative z-[1]">
                  Parked, it still <em data-accent>stops</em> people.
                </span>
              </h2>
              <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-steel sm:mt-6 sm:text-base">
                In September 2025 a photographer pulled over mid-drive to shoot the shop&rsquo;s
                Dodge D100 — patina, rust-bloomed tailgate and all. Nobody staged that.
              </p>
              <Link
                href="/builds/1960s-dodge-d100"
                className="pointer-events-auto mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.24em] text-tungsten sm:mt-6"
              >
                <RollText text="The D100's build page →" />
              </Link>
            </div>
          </div>

          {/* INTERLUDE 01 — the writing beat between ACT I and ACT II */}
          <Interlude
            index={0}
            eyebrow={["INTERLUDE 01", "INTERLUDE — WHAT YOU ARE ACTUALLY BUYING"]}
            lead={<>A restoration is a <em data-accent>decision</em>, not a purchase.</>}
            body="You are not buying parts and labour. You are deciding what this car is going to be for the next thirty years — how it sits, what it sounds like at 2,000 rpm, whether the door still shuts like a bank vault in 2055. That decision gets made once. Most of what people regret is the shop that made it for them without asking."
            stat={{ figure: "200-400", caption: "extra hours a true frame-off adds. We quote them out loud." }}
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
              <h2 className="relative mt-4 font-display text-[clamp(2.05rem,7.8vw,6rem)] uppercase leading-[0.88] tracking-[0.01em] text-bone sm:mt-5">
                <span aria-hidden="true" className="echo-ghost">
                  It never <em data-accent>leaves</em> the building.
                </span>
                <span className="relative z-[1]">
                  It never <em data-accent>leaves</em> the building.
                </span>
              </h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-steel sm:mt-5 sm:text-base">
                Hood up, motor open, panels in primer. The car in the middle of the job is the one
                that tells you who did the work.
              </p>
              {/* 12px mono at 0.22em wraps every one of these onto two lines at
                  320 — six rows become twelve and the list swallows the shot. */}
              <ul className="mt-5 space-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-steel sm:mt-6 sm:space-y-1.5 sm:text-[12px] sm:tracking-[0.22em]">
                <li>Restoration · frame-off or rolling</li>
                <li>Restomods &amp; hot rods</li>
                <li>LS &amp; diesel swaps</li>
                <li>Carbs, ignition &amp; tuning</li>
                <li>Body, paint &amp; metal</li>
                <li>Interiors &amp; classic service</li>
              </ul>
            </div>
          </div>

          {/* INTERLUDE 02 — the writing beat between ACT II and ACT III */}
          <Interlude
            index={1}
            eyebrow={["INTERLUDE 02", "INTERLUDE — THE PART NOBODY PHOTOGRAPHS"]}
            lead={<>Anyone can make it shiny. <em data-accent>Straight</em> is the hard part.</>}
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
              <h2 className="relative mt-4 max-w-3xl font-display text-[clamp(2.05rem,8.2vw,6.5rem)] uppercase leading-[0.88] tracking-[0.01em] text-bone sm:mt-5">
                <span aria-hidden="true" className="echo-ghost">
                  Tell me what it&rsquo;s <em data-accent>worth</em> to you.
                </span>
                <span className="relative z-[1]">
                  Tell me what it&rsquo;s <em data-accent>worth</em> to you.
                </span>
              </h2>
              <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-steel sm:mt-6 sm:text-base">
                <span className="sm:hidden">
                  Barn find, stalled project, or a car that deserves better. Honest scope, real
                  hours, a number in two business days.
                </span>
                <span className="hidden sm:inline">
                  Barn find, stalled project, or a driver that deserves better. Terry Harmider
                  scopes every request himself — honest scope, real hours, a number band in two
                  business days.
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
 * The film used to be car, car, car. Now each vehicle dissolves away, the cyc
 * sits genuinely empty, and a page of writing owns the frame before the next
 * one builds. It plays in the wide gap the Director leaves between acts, so it
 * costs no extra scroll machinery — the empty stage WAS the opportunity.
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
          <div className="shrink-0 border-l border-tungsten/40 pl-4 sm:pl-5">
            <p className="font-display text-[clamp(1.6rem,5vw,3.4rem)] leading-none text-tungsten">
              {stat.figure}
            </p>
            <p className="corner-note mt-2 max-w-[13rem]">{stat.caption}</p>
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
        <div className="copy-plate max-w-md border-l border-tungsten/50 pl-4 sm:pl-5">
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
        {/* the outline echo — a stroked ghost a hair behind the face */}
        <span
          aria-hidden="true"
          data-h1-ghost
          className="echo-ghost whitespace-pre-line font-display text-[clamp(2.45rem,12.5vw,12rem)] uppercase leading-[0.84] tracking-[0.005em]"
          style={kinetic ? { opacity: 0 } : undefined}
        >
          {"Customs and\n"}
          <em data-accent>classics.</em>
        </span>
        <h1
          data-kinetic-h1={kinetic ? "" : undefined}
          className="relative z-[1] whitespace-pre-line font-display text-[clamp(2.45rem,12.5vw,12rem)] uppercase leading-[0.84] tracking-[0.005em] text-bone"
        >
          {"Customs and\n"}
          <em data-accent>classics.</em>
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
        <span className="hidden sm:inline">SCROLL — THREE CARS, ONE BAY</span>
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
