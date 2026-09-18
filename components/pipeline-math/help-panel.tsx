"use client"

import { useEffect, useRef } from "react"
import type { PipelineResult } from "@/lib/pipeline-math/types"
import { CALENDAR_URL, fieldHelp, helpSections, resultHelp } from "@/lib/pipeline-math/help-content"

const FIELD_ORDER = [
  "averageDealSize",
  "salesCycleDays",
  "closeRate",
  "revenueType",
  "customerLifespanMonths",
  "channelName",
  "channelSpend",
  "channelLeads",
  "channelDeals",
  "totalMonthlySpend",
  "spendTrend",
  "spendThreeMonthsAgo",
  "period",
  "closedDeals",
  "newRevenue",
  "qualifiedMeetings",
  "forecastChange",
  "changeAmountPerMonth",
  "horizonDays",
]

/**
 * Slide-over help. Opens over whatever the user was doing and leaves it all
 * in place. Escape closes it. Focus goes in on open and back out on close.
 */
export function HelpPanel({ open, onClose, result }: { open: boolean; onClose: () => void; result: PipelineResult | null }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      returnFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const h = helpSections

  return (
    <div className="pm-no-print fixed inset-0 z-50" role="presentation">
      <button type="button" aria-label="Close help" onClick={onClose} className="absolute inset-0 bg-[#0a1626]/70" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-[#0f2036] shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="help-title" className="font-display text-xl tracking-tight text-foreground">
            Help
          </h2>
          <button type="button" onClick={onClose} className="min-h-11 rounded-md px-3 text-sm text-muted-foreground hover:text-foreground">
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6 text-[15px] leading-relaxed text-foreground/90">
          <nav aria-label="Help sections" className="mb-8 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {[
              ["what", "What this does"],
              ["need", "What you'll need"],
              ["how", "How to use it"],
              ["questions", "Each question"],
              ["results", "Your results"],
              ["timing", "Why timing matters"],
              ["faq", "Common questions"],
              ["who", "Who built this"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#help-${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`help-${id}`)?.scrollIntoView({ block: "start" })
                }}
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <Section id="what" title={h.whatThisDoes.title}>
            {h.whatThisDoes.paragraphs.map((p) => (
              <p key={p} className="mt-3">
                {p}
              </p>
            ))}
          </Section>

          <Section id="need" title={h.whatYouNeed.title}>
            <p className="mt-3">{h.whatYouNeed.intro}</p>
            <ul className="mt-4 space-y-3">
              {h.whatYouNeed.items.map((it) => (
                <li key={it.thing} className="border-l-2 border-border pl-3">
                  <p className="text-foreground">{it.thing}</p>
                  <p className="text-sm text-muted-foreground">{it.where}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="how" title={h.howToUse.title}>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              {h.howToUse.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Section>

          <Section id="questions" title="What each question means">
            <dl className="mt-3 space-y-5">
              {FIELD_ORDER.map((id) => {
                const f = fieldHelp[id]
                if (!f) return null
                return (
                  <div key={id}>
                    <dt className="text-foreground">{f.label}</dt>
                    <dd className="mt-1 text-sm">
                      <p>{f.meaning}</p>
                      <p className="mt-1 text-muted-foreground">Why it matters: {f.why}</p>
                      <p className="mt-1 text-muted-foreground">For example: {f.example}</p>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </Section>

          <Section id="results" title="How to read your results">
            <dl className="mt-3 space-y-5">
              {resultHelp.map((rh) => {
                const forYou = result ? rh.forYou(result) : null
                return (
                  <div key={rh.id}>
                    <dt className="text-foreground">{rh.title}</dt>
                    <dd className="mt-1 text-sm">
                      <p>{rh.meaning}</p>
                      {forYou && <p className="mt-1 text-accent">{forYou}</p>}
                      <p className="mt-1 text-muted-foreground">What it doesn&rsquo;t mean: {rh.notMeaning}</p>
                    </dd>
                  </div>
                )
              })}
            </dl>
            {!result && <p className="mt-3 text-sm text-muted-foreground">Once you have results, this section adds a line about your own numbers under each one.</p>}
          </Section>

          <Section id="timing" title={h.whyTiming.title}>
            {h.whyTiming.paragraphs.map((p) => (
              <p key={p} className="mt-3">
                {p}
              </p>
            ))}
          </Section>

          <Section id="faq" title={h.faq.title}>
            <dl className="mt-3 space-y-4">
              {h.faq.items.map((it) => (
                <div key={it.q}>
                  <dt className="text-foreground">{it.q}</dt>
                  <dd className="mt-1 text-sm">{it.a}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="who" title={h.whoBuiltThis.title}>
            {h.whoBuiltThis.paragraphs.map((p) => (
              <p key={p} className="mt-3">
                {p}
              </p>
            ))}
            <a href={CALENDAR_URL} className="mt-3 inline-block text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
              The free Marketing Scan
            </a>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`help-${id}`} className="mb-10">
      <h3 className="font-display text-lg tracking-tight text-foreground">{title}</h3>
      {children}
    </section>
  )
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pm-no-print fixed bottom-4 right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-[#0f2036]/95 px-4 text-sm text-foreground shadow-lg backdrop-blur hover:border-accent sm:bottom-6 sm:right-6"
      aria-haspopup="dialog"
    >
      <span aria-hidden="true" className="text-accent">
        ?
      </span>
      Help
    </button>
  )
}
