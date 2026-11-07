"use client"

import { useDeferredValue, useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react"
import { sendGAEvent } from "@next/third-parties/google"
import {
  BUNDLE_PRICE,
  CONTACTS_PER_BUNDLE,
  DEAL_SIZE_QUALIFIER,
  DEFAULTS,
  EMAILS_PER_CONTACT,
  MEETING_FEE,
  RANGES,
  calculate,
  calendlyUrl,
  clampInputs,
  decodeHash,
  encodeHash,
  type Period,
  type RoiInputs,
} from "@/lib/roi"

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const whole = new Intl.NumberFormat("en-US")
const pct = (n: number) => `${n}%`
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

const DEAL_CHIPS = [10_000, 25_000, 50_000, 100_000]
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL
const PRIVACY_URL = "https://www.privacypolicies.com/live/5f9bc43b-bef0-4dd1-8eaa-eaedd4a9b9a6"

type Lead = { name: string; email: string }

export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULTS)
  const [period, setPeriod] = useState<Period>("monthly")
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lead, setLead] = useState<Lead | null>(null)

  useEffect(() => {
    function applyHash() {
      const state = decodeHash(window.location.hash)
      setInputs(state.inputs)
      setPeriod(state.period)
    }
    applyHash()
    setReady(true)
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => {
      const hash = encodeHash(inputs, period)
      const url = window.location.pathname + window.location.search + (hash ? `#${hash}` : "")
      window.history.replaceState(window.history.state, "", url)
    }, 200)
    return () => window.clearTimeout(timer)
  }, [inputs, period, ready])

  const d = useDeferredValue(inputs)

  function set<K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) {
    setInputs((prev) => clampInputs({ ...prev, [key]: value }))
  }

  function reset() {
    setInputs(DEFAULTS)
    setPeriod("monthly")
  }

  async function copyLink() {
    const hash = encodeHash(inputs, period)
    const url = `${window.location.origin}${window.location.pathname}${hash ? `#${hash}` : ""}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard can be blocked; the address bar still holds the same link.
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
      <section aria-labelledby="roi-heading" className="space-y-3">
        <div className="pb-1">
          <h1 id="roi-heading" className="font-display text-2xl leading-tight tracking-tight text-foreground">
            What could cold email return for you?
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Move the sliders to match your business. The estimate updates as you go.
          </p>
        </div>

        <Slider
          id="roi-bundles"
          label="Sending volume"
          value={inputs.bundles}
          {...RANGES.bundles}
          display={`${inputs.bundles} ${plural(inputs.bundles, "bundle", "bundles")}`}
          onChange={(v) => set("bundles", v)}
          help={`${whole.format(inputs.bundles * CONTACTS_PER_BUNDLE)} contacts · ${whole.format(
            inputs.bundles * CONTACTS_PER_BUNDLE * EMAILS_PER_CONTACT,
          )} emails a month · ${money.format(BUNDLE_PRICE)} × ${inputs.bundles} = ${money.format(
            inputs.bundles * BUNDLE_PRICE,
          )} a month`}
        />

        <DealSize value={inputs.dealSize} onChange={(v) => set("dealSize", v)} />

        <Slider
          id="roi-engagement"
          label="Engagement rate"
          value={inputs.engagementRate}
          {...RANGES.engagementRate}
          display={pct(inputs.engagementRate)}
          onChange={(v) => set("engagementRate", v)}
          help="Of everyone contacted, the share who reply or show real interest."
        />
        <Slider
          id="roi-qualified"
          label="Qualified rate"
          value={inputs.qualifiedRate}
          {...RANGES.qualifiedRate}
          display={pct(inputs.qualifiedRate)}
          onChange={(v) => set("qualifiedRate", v)}
          help={`Of those engaged, the share who are a genuine fit (${whole.format(calculate(d).qualified)} a month).`}
        />
        <Slider
          id="roi-meeting"
          label="Meeting rate"
          value={inputs.meetingRate}
          {...RANGES.meetingRate}
          display={pct(inputs.meetingRate)}
          onChange={(v) => set("meetingRate", v)}
          help="Of qualified leads, the share who book a call."
        />
        <Slider
          id="roi-show"
          label="Show rate"
          value={inputs.showRate}
          {...RANGES.showRate}
          display={pct(inputs.showRate)}
          onChange={(v) => set("showRate", v)}
          help="Of booked calls, the share who attend. You’re only billed for these."
        />
        <Slider
          id="roi-close"
          label="Your close rate"
          value={inputs.closeRate}
          {...RANGES.closeRate}
          display={pct(inputs.closeRate)}
          onChange={(v) => set("closeRate", v)}
          help="Of the calls you take, the share that become customers."
        />

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-2.5 text-xs">
          <button type="button" onClick={reset} className={linkButton}>
            Reset to defaults
          </button>
          <button type="button" onClick={copyLink} className={linkButton} aria-live="polite">
            {copied ? "Link copied" : "Copy link to these numbers"}
          </button>
        </div>
      </section>

      <section aria-label="Your estimate" className="lg:rounded lg:border lg:border-border lg:bg-card lg:px-6 lg:py-4">
        {lead ? (
          <Results inputs={d} period={period} onPeriod={setPeriod} lead={lead} />
        ) : (
          <Gate inputs={inputs} onUnlock={setLead} />
        )}
      </section>
    </div>
  )
}

function Gate({ inputs, onUnlock }: { inputs: RoiInputs; onUnlock: (lead: Lead) => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, inputs }),
      })
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || "Please check your name and email.")
        setSubmitting(false)
        return
      }
    } catch {
      // A network or server failure still shows the estimate; the lead isn't worth losing the visitor over.
    }
    try {
      sendGAEvent("event", "generate_lead", { method: "calculator" })
    } catch {
      // Analytics failures never block the estimate.
    }
    onUnlock({ name: name.trim(), email: email.trim() })
  }

  return (
    <div className="space-y-5 py-1">
      <div>
        <p className={eyebrow}>Your estimate is ready</p>
        <h2 className="mt-2 font-display text-2xl leading-snug tracking-tight text-foreground">
          Enter your name and email to see your numbers.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You’ll see your pipeline, estimated revenue, the full cost, and what each meeting and each deal would cost you.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="roi-name" className={fieldLabel}>
              Name
            </label>
            <input
              id="roi-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="roi-email" className={fieldLabel}>
              Email
            </label>
            <input
              id="roi-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-accent px-5 py-2.5 text-sm text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "One moment…" : "Show my estimate"}
          </button>
          {error ? (
            <p role="alert" className="text-sm text-accent">
              {error}
            </p>
          ) : null}
        </div>
        <p className="text-[0.7rem] leading-snug text-muted-foreground">
          You’ll also get The Stark &amp; Barker Memo by email. Every issue has a one-click unsubscribe.{" "}
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className={linkButton}>
            Privacy policy
          </a>
        </p>
      </form>

      <div className="border-t border-border pt-4">
        <p className={eyebrow}>How pricing works</p>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
          {money.format(BUNDLE_PRICE)} a month per bundle for the sending infrastructure, passed through at cost. Then{" "}
          {money.format(MEETING_FEE)} for each qualified meeting that actually happens. No management fee.
        </p>
      </div>
    </div>
  )
}

function Results({
  inputs: d,
  period,
  onPeriod,
  lead,
}: {
  inputs: RoiInputs
  period: Period
  onPeriod: (p: Period) => void
  lead: Lead
}) {
  const r = calculate(d, period)
  const perLabel = period === "monthly" ? "per month" : "per quarter"

  const funnel = [
    { label: "Contacted", value: r.contacts, note: `${EMAILS_PER_CONTACT} emails each`, of: "" },
    { label: "Engaged", value: r.engaged, note: pct(d.engagementRate), of: "of contacted" },
    { label: "Qualified", value: r.qualified, note: pct(d.qualifiedRate), of: "of engaged" },
    { label: "Meetings booked", value: r.booked, note: pct(d.meetingRate), of: "of qualified" },
    { label: "Meetings attended", value: r.attended, note: pct(d.showRate), of: "of booked, the billing line", billing: true },
    { label: "Deals closed", value: r.deals, note: pct(d.closeRate), of: "of attended" },
  ]
  const scale = Math.log10(r.contacts + 1)

  const revenueText = money.format(r.revenue)
  // From $1,000,000 up the headline needs the full width, so the figures drop below it.
  const wideHeadline = revenueText.length > 9
  const revenueSize = revenueText.length <= 11 ? "text-5xl" : revenueText.length <= 14 ? "text-4xl" : "text-3xl"

  function book() {
    if (!CALENDLY_URL) {
      // TODO(Ken): set NEXT_PUBLIC_CALENDLY_URL on Vercel; until then booking falls back to the contact form.
      window.location.href = "/#contact"
      return
    }
    // A button rather than a link, so analytics outbound-click tracking never records the prefilled name and email.
    window.open(calendlyUrl(CALENDLY_URL, lead, d.dealSize), "_blank", "noopener")
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-4">
        <h2 className={eyebrow}>Your pipeline, estimated</h2>
        <div className="inline-flex rounded border border-border p-0.5 text-[0.7rem] uppercase tracking-[0.14em]">
          {(["monthly", "quarterly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => onPeriod(p)}
              className={
                "rounded-sm px-2.5 py-1 transition-colors " +
                (period === p ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-1">
        {funnel.map((row) => (
          <li key={row.label} className="grid grid-cols-[11rem_minmax(0,1fr)_5rem] items-center gap-x-3">
            <p className={"truncate text-sm " + (row.billing ? "text-accent" : "text-foreground")}>
              {row.label} <span className="text-xs text-muted-foreground">{row.note}</span>
              {row.of ? <span className="sr-only"> {row.of}</span> : null}
            </p>
            <div className="h-1.5 rounded-full bg-border/60" aria-hidden="true">
              <div
                className={"h-1.5 rounded-full " + (row.billing ? "bg-accent" : "bg-muted-foreground/45")}
                style={{ width: row.value > 0 ? `${Math.max(2, (Math.log10(row.value + 1) / scale) * 100)}%` : "0%" }}
              />
            </div>
            <p className={"text-right font-display text-base tabular-nums " + (row.billing ? "text-accent" : "text-foreground")}>
              {whole.format(row.value)}
            </p>
          </li>
        ))}
      </ol>

      <div
        className={
          "grid items-end gap-x-6 gap-y-4 border-t border-border pt-4 " +
          (wideHeadline ? "" : "sm:grid-cols-[minmax(0,1fr)_auto]")
        }
      >
        <div className="min-w-0">
          <p className={eyebrow}>Estimated revenue</p>
          <p
            className={`mt-1.5 whitespace-nowrap font-display ${revenueSize} leading-none tracking-tight tabular-nums text-foreground`}
          >
            {revenueText}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {whole.format(r.deals)} {plural(r.deals, "deal", "deals")} × {money.format(d.dealSize)} deal size, {perLabel}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-2.5">
          <Figure label="Meetings attended" value={whole.format(r.attended)} />
          <Figure label="Deals closed" value={whole.format(r.deals)} />
          <Figure label="Return on spend" value={`${r.roiMultiple.toFixed(1)}×`} />
          <Figure label="Net gain" value={money.format(r.netGain)} tone={r.netGain > 0 ? "text-accent" : "text-muted-foreground"} />
          <Figure label="Cost per meeting" value={r.costPerMeeting === null ? "—" : money.format(r.costPerMeeting)} />
          <Figure label="Cost per deal" value={r.costPerDeal === null ? "—" : money.format(r.costPerDeal)} />
        </dl>
      </div>

      <div className="border-t border-border pt-3.5">
        <h2 className={eyebrow}>Your investment {perLabel}</h2>
        <table className="mt-1.5 w-full text-sm tabular-nums">
          <tbody>
            <Row
              label="Infrastructure (domains, inboxes, sending)"
              detail={`${money.format(BUNDLE_PRICE)} × ${d.bundles} ${plural(d.bundles, "bundle", "bundles")}${
                period === "quarterly" ? " × 3 months" : ""
              }`}
              value={money.format(r.infrastructureCost)}
            />
            <Row
              label="Qualified meetings attended"
              detail={`${money.format(MEETING_FEE)} × ${whole.format(r.attended)}`}
              value={money.format(r.meetingCost)}
            />
            <tr className="border-t border-border">
              <th scope="row" className="pt-1 text-left font-normal text-foreground">
                Total
              </th>
              <td />
              <td className="pt-1 text-right font-display text-base text-foreground">{money.format(r.totalCost)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-1.5 text-[0.7rem] leading-snug text-muted-foreground">
          Infrastructure is passed through at cost. Meeting fees are invoiced weekly, only for calls the prospect
          attends. No-shows aren’t billed.
        </p>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-border pt-3.5">
        <p className="min-w-0 flex-1 text-[0.7rem] leading-snug text-muted-foreground">
          These are estimates, not projections from past campaigns. Every rate is adjustable because every business
          converts differently. Month one usually runs lower while new domains warm up.
        </p>
        <div className="shrink-0 text-right">
          <button
            type="button"
            onClick={book}
            className="rounded bg-accent px-5 py-2 text-sm text-accent-foreground transition-opacity hover:opacity-90"
          >
            Book a call
          </button>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            Prefer to write?{" "}
            <a href="/#contact" className={linkButton}>
              Send a note
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

const eyebrow = "text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground"

const linkButton =
  "text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"

const rangeClass = "mt-1 h-4 w-full cursor-pointer [accent-color:var(--accent)]"

const fieldLabel = "block text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground"
const fieldClass =
  "mt-1.5 w-full border-0 border-b border-border bg-transparent px-0 py-1.5 text-base text-foreground focus:border-accent focus:outline-none"

function Slider({
  id,
  label,
  help,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string
  label: string
  help?: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-foreground">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-lg leading-none tabular-nums text-foreground">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        className={rangeClass}
      />
      {help ? <p className="text-[0.7rem] leading-snug text-muted-foreground">{help}</p> : null}
    </div>
  )
}

function useDraftNumber(value: number, onCommit: (n: number) => void) {
  const [draft, setDraft] = useState<string | null>(null)
  function commit() {
    if (draft !== null) {
      const n = Number(draft.replace(/[^\d.]/g, ""))
      if (Number.isFinite(n) && draft.trim() !== "") onCommit(Math.round(n))
    }
    setDraft(null)
  }
  return {
    value: draft ?? money.format(value),
    onFocus: () => setDraft(String(value)),
    onChange: (e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") (e.target as HTMLInputElement).blur()
    },
  }
}

function DealSize({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const draft = useDraftNumber(value, onChange)
  const { min, max, step } = RANGES.dealSize
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="roi-deal-range" className="text-sm text-foreground">
          Your typical deal size
        </label>
        <input
          type="text"
          inputMode="numeric"
          aria-label="Typical deal size in dollars"
          className="w-28 rounded border border-border bg-transparent px-2 py-0.5 text-right font-display text-lg tabular-nums text-foreground focus:border-accent focus:outline-none"
          {...draft}
        />
      </div>
      <input
        id="roi-deal-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        aria-valuetext={money.format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className={rangeClass}
      />
      <div className="mt-0.5 flex flex-wrap gap-1.5">
        {DEAL_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            aria-pressed={value === chip}
            onClick={() => onChange(chip)}
            className={
              "rounded border px-2 py-px text-[0.7rem] tabular-nums transition-colors " +
              (value === chip
                ? "border-accent text-accent"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground")
            }
          >
            ${chip / 1000}k
          </button>
        ))}
      </div>
      {value < DEAL_SIZE_QUALIFIER ? (
        <p className="mt-1.5 text-[0.7rem] leading-snug text-muted-foreground">
          We work with companies where a closed deal is worth {money.format(DEAL_SIZE_QUALIFIER)} or more. Below that,
          cold outreach at this volume usually doesn’t pay for itself.
        </p>
      ) : null}
    </div>
  )
}

function Figure({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.7rem] text-muted-foreground">{label}</dt>
      <dd
        className={
          "whitespace-nowrap font-display leading-tight tabular-nums " +
          (value.length > 11 ? "text-base " : "text-xl ") +
          (tone ?? "text-foreground")
        }
      >
        {value}
      </dd>
    </div>
  )
}

function Row({ label, detail, value }: { label: string; detail?: string; value: string }) {
  return (
    <tr>
      <th scope="row" className="py-0.5 pr-3 text-left font-normal text-foreground">
        {label}
      </th>
      <td className="py-0.5 pr-3 text-right text-xs text-muted-foreground">{detail}</td>
      <td className="py-0.5 text-right text-foreground">{value}</td>
    </tr>
  )
}
