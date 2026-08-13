"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { services, site } from "@/lib/site";

/**
 * `?service=` / `?lane=` → a service slug, forgivingly. Read on the CLIENT so
 * the /quote page prerenders fully static (`output: export` needs it) while a
 * link from a service page still lands with its lane pre-picked.
 */
function resolveService(raw: string | null): string {
  if (!raw) return "";
  const value = raw.trim().toLowerCase();
  if (!value) return "";
  const exact = services.find((s) => s.slug === value);
  if (exact) return exact.slug;
  const loose = services.find(
    (s) =>
      s.slug.includes(value) ||
      s.nav.toLowerCase() === value ||
      s.title.toLowerCase() === value ||
      s.keyword.toLowerCase().includes(value),
  );
  return loose ? loose.slug : "";
}

/* ------------------------------------------------------------------ config */

type StepId = "work" | "vehicle" | "scope" | "photos" | "contact";

const STEPS: ReadonlyArray<{ id: StepId; label: string; heading: string; blurb: string }> = [
  {
    id: "work",
    label: "The work",
    heading: "What are we building?",
    blurb: "Pick the lane closest to the job. We sort the details later.",
  },
  {
    id: "vehicle",
    label: "The vehicle",
    heading: "What is it, and where is it sitting?",
    blurb: "Year, make, model, and how far gone it is. Best guess is fine.",
  },
  {
    id: "scope",
    label: "Scope",
    heading: "How far do you want to take it?",
    blurb: "Scope and a budget band. A band is a planning range, not a commitment.",
  },
  {
    id: "photos",
    label: "Photos",
    heading: "Show us the car.",
    blurb: "Photos beat paragraphs. Floors, rockers, engine bay, interior, both quarters.",
  },
  {
    id: "contact",
    label: "You",
    heading: "Where do we send the answer?",
    blurb: "A name and one way to reach you. That is it.",
  },
];

const CONDITIONS = [
  { value: "Running and driving", note: "Starts, moves, stops. Wants to be better." },
  { value: "Stalled project", note: "Somebody started it. Boxes of parts included." },
  { value: "Barn find", note: "Parked for years. Nobody has turned it over." },
  { value: "Rolling shell", note: "Body and frame. No drivetrain in it." },
] as const;

const SCOPES = [
  { value: "Frame-off", note: "Body off the chassis. Everything apart, everything addressed." },
  { value: "Rolling restoration", note: "Fixed in stages so you keep driving it." },
  { value: "A specific list", note: "Rust, paint, a swap, brakes — named jobs only." },
  { value: "Not sure yet", note: "Look at it and tell me what it actually needs." },
] as const;

const BUDGETS = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000 +",
  "Need a number before I can say",
] as const;

const TIMELINES = [
  "Winter build slot",
  "Driving it next season",
  "No rush — right, not fast",
  "As soon as you have room",
] as const;

const METHODS = ["Call", "Text", "Email"] as const;

/* ------------------------------------------------------------------- state */

type FormState = {
  service: string;
  year: string;
  make: string;
  model: string;
  condition: string;
  scope: string;
  budget: string;
  timeline: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  method: string;
  town: string;
};

type FieldName = keyof FormState;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: FormState = {
  service: "",
  year: "",
  make: "",
  model: "",
  condition: "",
  scope: "",
  budget: "",
  timeline: "",
  notes: "",
  name: "",
  phone: "",
  email: "",
  method: "Call",
  town: "",
};

type PhotoRef = { name: string; size: number };

/* ---------------------------------------------------------------- helpers */

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function serviceTitle(slug: string): string {
  const match = services.find((s) => s.slug === slug);
  return match ? match.title : "Not sure yet";
}

// Kept out of the component body: both read the clock, which is impure.
function makeReference(): string {
  return `Q-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function yearCeiling(): number {
  return new Date().getFullYear() + 1;
}

const inputClass =
  "w-full border border-rust/40 bg-bay-black px-3 py-2.5 font-body text-[15px] text-bone transition-colors placeholder:text-steel/35 focus:border-neon-bloom focus:outline-none aria-[invalid=true]:border-neon-bloom";

const labelClass = "block font-sub text-[10px] uppercase tracking-[0.24em] text-steel";

// Deliberately not .plate — that utility class lives outside Tailwind's layers
// in globals.css, so its border-color would beat any has-[:checked] variant.
const cardClass =
  "flex cursor-pointer items-start gap-3 border border-rust/35 bg-panel p-4 transition-colors hover:border-rust/70 has-[:checked]:border-tungsten has-[:checked]:bg-tungsten/5";

/* ----------------------------------------------------------------- fields */

function TextField(props: {
  id: FieldName;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  required?: boolean;
  registerRef: (name: FieldName) => (el: HTMLElement | null) => void;
}) {
  const { id, label, value, onChange, error, hint, registerRef } = props;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        {props.required ? <span className="text-neon-bloom"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        ref={registerRef(id)}
        type={props.type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 ${inputClass}`}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 font-body text-xs text-steel/70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 font-mono text-xs text-neon-bloom">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField(props: {
  id: FieldName;
  label: string;
  value: string;
  options: ReadonlyArray<string>;
  placeholder: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  registerRef: (name: FieldName) => (el: HTMLElement | null) => void;
}) {
  const { id, label, value, options, onChange, error, registerRef } = props;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        {props.required ? <span className="text-neon-bloom"> *</span> : null}
      </label>
      <select
        id={id}
        name={id}
        ref={registerRef(id)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`mt-2 ${inputClass}`}
      >
        <option value="">{props.placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="mt-1.5 font-mono text-xs text-neon-bloom">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RadioCard({
  name,
  value,
  checked,
  title,
  note,
  onChange,
  focusTarget,
}: {
  name: FieldName;
  value: string;
  checked: boolean;
  title: string;
  note?: string;
  onChange: (v: string) => void;
  focusTarget?: (el: HTMLElement | null) => void;
}) {
  return (
    <label className={cardClass}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        ref={focusTarget}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 shrink-0 accent-[#a02d2d]"
      />
      <span className="min-w-0">
        <span className="block font-sub text-[12px] uppercase tracking-[0.16em] text-bone">
          {title}
        </span>
        {note ? (
          <span className="mt-1 block font-body text-sm leading-snug text-steel">{note}</span>
        ) : null}
      </span>
    </label>
  );
}

/* -------------------------------------------------------------- component */

export function QuoteForm({ initialService }: { initialService?: string }) {
  const params = useSearchParams();
  const preselected =
    initialService ?? resolveService(params.get("service") ?? params.get("lane"));
  const [form, setForm] = useState<FormState>({ ...EMPTY, service: preselected });

  // Client-side navigation between lanes updates the param after mount; adopt
  // it as long as the reader has not picked a lane by hand.
  useEffect(() => {
    if (preselected) setForm((f) => (f.service ? f : { ...f, service: preselected }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselected]);
  const [photos, setPhotos] = useState<PhotoRef[]>([]);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const refs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const doneRef = useRef<HTMLParagraphElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFocus = useRef(false);

  // Move focus to the new panel after React commits it, so keyboard and screen
  // reader users land on the step they just opened instead of the page top.
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    const target = sent ? doneRef.current : headingRef.current;
    target?.focus();
  }, [step, sent]);

  const registerRef = (name: FieldName) => (el: HTMLElement | null) => {
    refs.current[name] = el;
  };

  const set = (name: FieldName, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  function validate(index: number): Errors {
    const next: Errors = {};
    const id = STEPS[index].id;

    if (id === "work" && !form.service) {
      next.service = "Pick the closest lane — you can change it later.";
    }

    if (id === "vehicle") {
      const year = Number(form.year);
      const ceiling = yearCeiling();
      if (!/^\d{4}$/.test(form.year.trim()) || year < 1900 || year > ceiling) {
        next.year = `Four digits, 1900 to ${ceiling}.`;
      }
      if (!form.make.trim()) next.make = "Make, please. Ford, Chevy, Dodge, MG.";
      if (!form.model.trim()) next.model = "Model, or the closest you know.";
      if (!form.condition) next.condition = "Tell us how far gone it is.";
    }

    if (id === "scope") {
      if (!form.scope) next.scope = "Pick a depth. Not sure yet is a valid answer.";
      if (!form.budget) next.budget = "Pick a band so we quote something real.";
    }

    if (id === "contact") {
      if (!form.name.trim()) next.name = "A name to put on the sheet.";
      const phoneDigits = form.phone.replace(/\D/g, "");
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
      if (form.method === "Email") {
        if (!emailOk) next.email = "We need a working email to send it there.";
      } else if (phoneDigits.length < 10) {
        next.phone = "Ten digits so we can reach you.";
      }
      if (form.email.trim() && !emailOk) next.email = "That email is missing something.";
    }

    return next;
  }

  function focusFirstError(errs: Errors) {
    const first = (Object.keys(errs) as FieldName[])[0];
    const el = first ? refs.current[first] : null;
    if (el) el.focus();
  }

  function goTo(index: number) {
    pendingFocus.current = true;
    setStep(index);
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validate(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    pendingFocus.current = true;
    setSent(makeReference());
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).map((f) => ({ name: f.name, size: f.size }));
    setPhotos((prev) => {
      const seen = new Set(prev.map((p) => `${p.name}:${p.size}`));
      return prev.concat(incoming.filter((f) => !seen.has(`${f.name}:${f.size}`)));
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function reset() {
    setForm({ ...EMPTY, service: preselected });
    setPhotos([]);
    setErrors({});
    setSent(null);
    setStep(0);
  }

  const summaryLines = [
    `Reference: ${sent ?? ""}`,
    `Work: ${serviceTitle(form.service)}`,
    `Vehicle: ${form.year} ${form.make} ${form.model}`.trim(),
    `Where it sits: ${form.condition}`,
    `Scope: ${form.scope}`,
    `Budget band: ${form.budget}`,
    form.timeline ? `Timeline: ${form.timeline}` : "",
    photos.length ? `Photos to attach: ${photos.map((p) => p.name).join(", ")}` : "Photos: none yet",
    "---",
    `Name: ${form.name}`,
    form.phone ? `Phone: ${form.phone}` : "",
    form.email ? `Email: ${form.email}` : "",
    form.town ? `Town: ${form.town}` : "",
    `Best way to reach me: ${form.method}`,
    form.notes ? `Notes: ${form.notes}` : "",
  ].filter(Boolean);

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Quote request ${sent ?? ""} — ${form.year} ${form.make} ${form.model}`.trim(),
  )}&body=${encodeURIComponent(summaryLines.join("\n"))}`;

  /* ------------------------------------------------------------- success */

  if (sent) {
    return (
      <div className="plate p-6 sm:p-8" role="status">
        <p className="font-sub text-[10px] uppercase tracking-[0.3em] text-neon-bloom">
          Build sheet started
        </p>
        <p
          ref={doneRef}
          tabIndex={-1}
          className="mt-3 font-display text-4xl leading-none tracking-wide text-bone focus:outline-none sm:text-5xl"
        >
          THAT IS ENOUGH TO GO ON.
        </p>
        <p className="mt-4 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Your sheet is filed under <span className="font-mono text-tungsten">{sent}</span>. Terry
          reads every one himself. Two business days for an answer with scope, sequence, and a
          number band — not a brochure.
        </p>

        <div className="weld my-7" />

        <dl className="grid gap-x-8 gap-y-4 font-body text-sm sm:grid-cols-2">
          <div>
            <dt className={labelClass}>The work</dt>
            <dd className="mt-1 text-bone">{serviceTitle(form.service)}</dd>
          </div>
          <div>
            <dt className={labelClass}>The vehicle</dt>
            <dd className="mt-1 text-bone">
              {form.year} {form.make} {form.model} — {form.condition.toLowerCase()}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Scope</dt>
            <dd className="mt-1 text-bone">{form.scope}</dd>
          </div>
          <div>
            <dt className={labelClass}>Budget band</dt>
            <dd className="mt-1 text-bone">{form.budget}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className={labelClass}>Photos listed</dt>
            <dd className="mt-1 font-mono text-xs text-steel">
              {photos.length ? photos.map((p) => p.name).join(" · ") : "None attached yet"}
            </dd>
          </div>
        </dl>

        <div className="weld my-7" />

        <p className="font-sub text-[10px] uppercase tracking-[0.24em] text-steel">
          The guaranteed path
        </p>
        <p className="mt-2 max-w-2xl font-body text-[15px] leading-relaxed text-steel">
          Forms are convenient. A phone is faster. Send the photos straight to the shop and your
          sheet moves to the top of the pile the same day.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${site.phone}`}
            className="border border-rust px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)]"
          >
            Call {site.phoneDisplay}
          </a>
          <a
            href={mailto}
            className="border border-steel/40 px-6 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-tungsten hover:text-tungsten"
          >
            Email this sheet to the shop
          </a>
          <button
            type="button"
            onClick={reset}
            className="px-2 py-3 text-center font-sub text-xs uppercase tracking-[0.2em] text-steel underline decoration-tungsten/40 underline-offset-4 transition-colors hover:text-bone"
          >
            Start another
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- form */

  const current = STEPS[step];

  return (
    <div className="plate p-6 sm:p-8">
      <nav aria-label="Quote progress">
        <ol className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {STEPS.map((s, i) => (
            <li key={s.id} aria-current={i === step ? "step" : undefined} className="flex items-center gap-2">
              <span
                className={`font-mono text-[11px] ${
                  i === step ? "text-neon-bloom" : i < step ? "text-tungsten" : "text-steel/40"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`font-sub text-[10px] uppercase tracking-[0.22em] ${
                  i === step ? "text-bone" : "text-steel/60"
                }`}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-4 h-px w-full bg-rust/25">
        <div
          className="h-px bg-tungsten transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {STEPS.length}: {current.heading}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-3xl leading-none tracking-wide text-bone focus:outline-none sm:text-4xl"
        >
          {current.heading}
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-steel">{current.blurb}</p>

        <div className="mt-7">
          {/* ------------------------------------------------- step 1: work */}
          {current.id === "work" ? (
            <fieldset>
              <legend className="sr-only">Which service are you asking about?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s, i) => (
                  <RadioCard
                    key={s.slug}
                    name="service"
                    value={s.slug}
                    checked={form.service === s.slug}
                    title={s.title}
                    note={s.blurb}
                    onChange={(v) => set("service", v)}
                    focusTarget={i === 0 ? registerRef("service") : undefined}
                  />
                ))}
                <RadioCard
                  name="service"
                  value="not-sure"
                  checked={form.service === "not-sure"}
                  title="Not sure yet"
                  note="Describe it and let Terry put it in the right lane."
                  onChange={(v) => set("service", v)}
                />
              </div>
              {errors.service ? (
                <p className="mt-3 font-mono text-xs text-neon-bloom">{errors.service}</p>
              ) : null}
            </fieldset>
          ) : null}

          {/* ---------------------------------------------- step 2: vehicle */}
          {current.id === "vehicle" ? (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <TextField
                  id="year"
                  label="Year"
                  value={form.year}
                  onChange={(v) => set("year", v)}
                  error={errors.year}
                  placeholder="1968"
                  inputMode="numeric"
                  required
                  registerRef={registerRef}
                />
                <TextField
                  id="make"
                  label="Make"
                  value={form.make}
                  onChange={(v) => set("make", v)}
                  error={errors.make}
                  placeholder="Dodge"
                  required
                  registerRef={registerRef}
                />
                <TextField
                  id="model"
                  label="Model"
                  value={form.model}
                  onChange={(v) => set("model", v)}
                  error={errors.model}
                  placeholder="D100"
                  required
                  registerRef={registerRef}
                />
              </div>

              <fieldset>
                <legend className={labelClass}>
                  Where is it now<span className="text-neon-bloom"> *</span>
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {CONDITIONS.map((c, i) => (
                    <RadioCard
                      key={c.value}
                      name="condition"
                      value={c.value}
                      checked={form.condition === c.value}
                      title={c.value}
                      note={c.note}
                      onChange={(v) => set("condition", v)}
                      focusTarget={i === 0 ? registerRef("condition") : undefined}
                    />
                  ))}
                </div>
                {errors.condition ? (
                  <p className="mt-3 font-mono text-xs text-neon-bloom">{errors.condition}</p>
                ) : null}
              </fieldset>
            </div>
          ) : null}

          {/* ------------------------------------------------ step 3: scope */}
          {current.id === "scope" ? (
            <div className="space-y-6">
              <fieldset>
                <legend className={labelClass}>
                  How deep does it go<span className="text-neon-bloom"> *</span>
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {SCOPES.map((s, i) => (
                    <RadioCard
                      key={s.value}
                      name="scope"
                      value={s.value}
                      checked={form.scope === s.value}
                      title={s.value}
                      note={s.note}
                      onChange={(v) => set("scope", v)}
                      focusTarget={i === 0 ? registerRef("scope") : undefined}
                    />
                  ))}
                </div>
                {errors.scope ? (
                  <p className="mt-3 font-mono text-xs text-neon-bloom">{errors.scope}</p>
                ) : null}
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="budget"
                  label="Budget band"
                  value={form.budget}
                  options={BUDGETS}
                  placeholder="Pick a band"
                  onChange={(v) => set("budget", v)}
                  error={errors.budget}
                  required
                  registerRef={registerRef}
                />
                <SelectField
                  id="timeline"
                  label="Timeline"
                  value={form.timeline}
                  options={TIMELINES}
                  placeholder="No preference"
                  onChange={(v) => set("timeline", v)}
                  registerRef={registerRef}
                />
              </div>

              <p className="font-body text-xs leading-relaxed text-steel/70">
                Bands are planning ranges, not quotes. Nobody holds you to the box you tick — it
                tells us whether to spec a driver or a show car before we open anything up.
              </p>
            </div>
          ) : null}

          {/* ----------------------------------------------- step 4: photos */}
          {current.id === "photos" ? (
            <div className="space-y-6">
              <div>
                <label className={labelClass} htmlFor="photos">
                  Attach photos
                </label>
                <input
                  id="photos"
                  name="photos"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => addFiles(e.target.files)}
                  aria-describedby="photos-hint"
                  className="mt-2 w-full cursor-pointer border border-dashed border-rust/50 bg-bay-black px-3 py-4 font-body text-sm text-steel file:mr-4 file:border file:border-tungsten/60 file:bg-transparent file:px-4 file:py-2 file:font-sub file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-bone hover:border-rust"
                />
                <p id="photos-hint" className="mt-2 font-body text-xs leading-relaxed text-steel/70">
                  Optional, but it is the difference between a guess and a quote. Files stay on your
                  device — the list below travels with your request. Anything large, text straight to{" "}
                  <a className="text-tungsten hover:text-bone" href={`tel:${site.phone}`}>
                    {site.phoneDisplay}
                  </a>
                  .
                </p>
              </div>

              {photos.length > 0 ? (
                <ul className="divide-y divide-rust/20 border border-rust/25">
                  {photos.map((p) => (
                    <li key={`${p.name}-${p.size}`} className="flex items-center gap-3 px-4 py-3">
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-bone">
                        {p.name}
                      </span>
                      <span className="font-mono text-xs text-steel/70">{formatSize(p.size)}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.filter((x) => !(x.name === p.name && x.size === p.size)),
                          )
                        }
                        className="font-sub text-[10px] uppercase tracking-[0.2em] text-steel transition-colors hover:text-neon-bloom"
                      >
                        <span aria-hidden="true">Remove</span>
                        <span className="sr-only">Remove {p.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div>
                <label className={labelClass} htmlFor="notes">
                  Anything else we should know
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Numbers-matching drivetrain, a deadline, a show you want it ready for, the rust you already know about."
                  className={`mt-2 ${inputClass}`}
                />
              </div>
            </div>
          ) : null}

          {/* ---------------------------------------------- step 5: contact */}
          {current.id === "contact" ? (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="name"
                  label="Name"
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                  autoComplete="name"
                  required
                  registerRef={registerRef}
                />
                <TextField
                  id="town"
                  label="Town"
                  value={form.town}
                  onChange={(v) => set("town", v)}
                  placeholder="Sherwood Park"
                  autoComplete="address-level2"
                  registerRef={registerRef}
                />
                <TextField
                  id="phone"
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                  type="tel"
                  inputMode="tel"
                  placeholder="780-555-0142"
                  autoComplete="tel"
                  registerRef={registerRef}
                />
                <TextField
                  id="email"
                  label="Email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  registerRef={registerRef}
                />
              </div>

              <fieldset>
                <legend className={labelClass}>Best way to reach you</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {METHODS.map((m) => (
                    <label
                      key={m}
                      className="flex cursor-pointer items-center gap-3 border border-rust/35 bg-panel px-5 py-3 transition-colors hover:border-rust/70 has-[:checked]:border-tungsten has-[:checked]:bg-tungsten/5"
                    >
                      <input
                        type="radio"
                        name="method"
                        value={m}
                        checked={form.method === m}
                        onChange={() => set("method", m)}
                        className="h-4 w-4 accent-[#a02d2d]"
                      />
                      <span className="font-sub text-[11px] uppercase tracking-[0.2em] text-bone">
                        {m}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className="font-body text-xs leading-relaxed text-steel/70">
                One shop, one owner, no call centre. Your number is used to answer this request and
                nothing else.
              </p>
            </div>
          ) : null}
        </div>

        <div className="weld my-8" />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, step - 1))}
            disabled={step === 0}
            className="font-sub text-[11px] uppercase tracking-[0.24em] text-steel transition-colors hover:text-bone disabled:cursor-not-allowed disabled:opacity-30 sm:w-40 sm:text-left"
          >
            ← Back
          </button>

          <button
            type="submit"
            className="flicker border border-rust px-8 py-4 font-sub text-xs uppercase tracking-[0.24em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)]"
          >
            {step === STEPS.length - 1 ? "Send it to the shop" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
