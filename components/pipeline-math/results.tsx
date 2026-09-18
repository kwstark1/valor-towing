"use client"

import { useState, type ReactNode } from "react"
import type { PipelineResult } from "@/lib/pipeline-math/types"
import { count, duration, money, numberWord, oneIn, percent, perDollar, plural } from "@/lib/pipeline-math/format"
import { meetingValueAt } from "@/lib/pipeline-math/engine"
import { CALENDAR_URL } from "@/lib/pipeline-math/help-content"
import { Button, Callout, Card, Disclosure, Eyebrow, Figure, HowFigured, Lede } from "./ui"
import { ForecastChart } from "./forecast-chart"

export interface ResultsProps {
  result: PipelineResult
  onChangeAnswers: () => void
  onSetAssumption: (key: "salesCycleDays" | "closeRate", value: number | null) => void
  /** Rendered above the headline: scenario save / compare controls. */
  toolbar?: ReactNode
}

export function Results({ result: r, onChangeAnswers, onSetAssumption, toolbar }: ResultsProps) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
      {toolbar}

      {/* 1. Headline */}
      <header className="mt-6">
        <Eyebrow>Your results</Eyebrow>
        <h1 className="mt-3 font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">{r.headline}</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Everything below is figured only from the numbers you typed. Nothing else is in here.
        </p>
        <div className="pm-no-print mt-5 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={onChangeAnswers}>
            Change my answers
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            Print or save as PDF
          </Button>
        </div>
      </header>

      {r.warnings.length > 0 && (
        <Callout className="mt-8">
          <p className="font-medium">A few things we had to work around:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Callout>
      )}

      <div className="mt-10 space-y-6">
        <AssumptionsCard r={r} onSetAssumption={onSetAssumption} />
        <ReturnsCard r={r} />
        <AttributionCard r={r} />
        <CostsCard r={r} />
        <MeetingValueCard r={r} onSetAssumption={onSetAssumption} />
        <LeverCard r={r} />
        <ForecastCard r={r} />
        <NextStepCard />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function Unavailable({ reason }: { reason?: string }) {
  return <p className="mt-4 text-base leading-relaxed text-muted-foreground">{reason ?? "Not enough to go on for this one yet."}</p>
}

function AssumptionsCard({ r, onSetAssumption }: { r: PipelineResult; onSetAssumption: ResultsProps["onSetAssumption"] }) {
  const list = r.assumptions
  const missing = list.filter((a) => a.kind === "missing")
  const n = missing.length
  const title =
    n === 0
      ? list.length === 0
        ? "You track everything we asked about"
        : "Nothing missing, a few things worked out"
      : `${capitalize(numberWord(n))} ${plural(n, "number")} you don't currently track`

  const cycleEntry = list.find((a) => a.field === "salesCycleDays" && (a.kind === "missing" || a.kind === "assumed"))
  const cycleMissing = cycleEntry !== undefined
  const cycleAssumed = cycleEntry?.kind === "assumed"
  const [cycleDraft, setCycleDraft] = useState(cycleEntry?.value !== null && cycleEntry?.value !== undefined ? String(Math.round(cycleEntry.value)) : "60")

  return (
    <Card id="assumptions">
      <Eyebrow>What you don't track</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">{title}</h2>
      <Lede>
        {list.length === 0
          ? "Every number below is built on figures you gave us. Nothing was guessed."
          : "Every number we had to work out, estimate, or leave blank. Seeing this list is often the most useful part."}
      </Lede>
      {list.length > 0 && (
        <ul className="mt-5 divide-y divide-border">
          {list.map((a) => (
            <li key={a.field + a.kind} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-base font-medium text-foreground">{a.label}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {a.kind === "missing" ? "not tracked" : a.kind === "derived" ? "worked out" : "your estimate"}
                </p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">{a.note}</p>
              {a.unlocks.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Knowing it would give you: {a.unlocks.join(", ")}.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {cycleMissing && (
        <div className="pm-no-print mt-4 rounded-md border border-dashed border-accent/60 p-4">
          <p className="text-sm text-foreground">
            {cycleAssumed
              ? "The timing results below use your estimate. Try another, or clear it."
              : "Want to see the timing results anyway? Give us your best guess for how long a deal takes to close, and we’ll label everything that leans on it as your estimate."}
          </p>
          <form
            className="mt-3 flex flex-wrap items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const v = parseFloat(cycleDraft)
              if (Number.isFinite(v) && v >= 0) onSetAssumption("salesCycleDays", v)
            }}
          >
            <label className="text-sm text-muted-foreground" htmlFor="assume-cycle">
              About
            </label>
            <input
              id="assume-cycle"
              inputMode="numeric"
              value={cycleDraft}
              onChange={(e) => setCycleDraft(e.target.value)}
              className="w-20 rounded-md border border-border bg-transparent px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none"
            />
            <span className="text-sm text-muted-foreground">days</span>
            <Button type="submit" variant="ghost" className="min-h-10">
              Use this estimate
            </Button>
            {cycleAssumed && (
              <Button type="button" variant="quiet" onClick={() => onSetAssumption("salesCycleDays", null)}>
                Clear it
              </Button>
            )}
          </form>
        </div>
      )}
    </Card>
  )
}

function ReturnsCard({ r }: { r: PipelineResult }) {
  const x = r.returns
  return (
    <Card id="returns">
      <Eyebrow>What came back</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">What your marketing returned</h2>
      <Lede>How many dollars of new revenue came back for each dollar you spent. Two versions: your dashboard&rsquo;s, and one with the timing lined up.</Lede>
      {!x.available || x.naive === null ? (
        <Unavailable reason={x.reason} />
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">The dashboard way</p>
              <Figure>{perDollar(x.naive)}</Figure>
              <p className="mt-2 text-sm text-muted-foreground">back for every dollar, this month against this month</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">With timing lined up</p>
              {x.lagAdjusted !== null ? (
                <>
                  <Figure accent>{perDollar(x.lagAdjusted)}</Figure>
                  <p className="mt-2 text-sm text-muted-foreground">
                    back for every dollar, revenue against the spend that caused it
                  </p>
                </>
              ) : (
                <p className="mt-4 text-base text-muted-foreground">{x.reason}</p>
              )}
            </div>
          </div>
          <p className="mt-6 text-base leading-relaxed text-foreground/90">{x.explanation}</p>
          {x.lagAdjusted !== null && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{x.caveat}</p>}
          <HowFigured>
            <p>{x.naiveHow}</p>
            {x.lagAdjustedHow && <p className="mt-2">{x.lagAdjustedHow}</p>}
            {x.lagWindowWeeks && (
              <p className="mt-2 text-muted-foreground">
                Deals don&rsquo;t all close on the same day, so we spread each week&rsquo;s spend across a window from {x.lagWindowWeeks.first} to{" "}
                {x.lagWindowWeeks.last} weeks later, heaviest around week {x.lagWindowWeeks.center}.
              </p>
            )}
          </HowFigured>
        </>
      )}
    </Card>
  )
}

function AttributionCard({ r }: { r: PipelineResult }) {
  const a = r.attribution
  return (
    <Card id="attribution">
      <Eyebrow>Where your sales came from</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
        {a.available && a.totalDeals !== null && a.totalDeals > 0 && !a.overReported && !a.reconciles
          ? `${count(a.untracedDeals)} of ${count(a.totalDeals)} deals can't be traced`
          : a.reconciles
            ? "Every deal is traced"
            : "Deals you can and can’t trace"}
      </h2>
      <Lede>How many of the deals you closed can be traced back to a channel you listed. The rest are revenue you can&rsquo;t repeat on purpose.</Lede>
      {!a.available ? (
        <Unavailable reason={a.reason} />
      ) : (
        <>
          {a.untracedShare !== null && a.untracedShare > 0 && !a.overReported && (
            <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <Figure accent className="mt-0">
                {percent(a.untracedShare)}
              </Figure>
              <p className="text-base text-muted-foreground">
                of your deals{oneIn(a.untracedShare) ? `, about ${oneIn(a.untracedShare)},` : ""} untraced
                {a.untracedRevenue !== null ? `: ${money(a.untracedRevenue)} a month` : ""}
              </p>
            </div>
          )}
          <p className="mt-5 text-base leading-relaxed text-foreground/90">{a.summary}</p>
          {a.channelsWithoutDealData.length > 0 && !a.reconciles && (
            <p className="mt-3 text-sm text-muted-foreground">
              No deal count was given for {a.channelsWithoutDealData.join(", ")}, so any deals from there count as untraced here.
            </p>
          )}
          <HowFigured>
            <p>{a.how}</p>
          </HowFigured>
        </>
      )}
    </Card>
  )
}

function CostsCard({ r }: { r: PipelineResult }) {
  const c = r.costs
  const b = c.blended
  const hasChannels = c.channels.length > 0
  return (
    <Card id="costs">
      <Eyebrow>What you pay</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">What a conversation and a customer cost you</h2>
      <Lede>Your all-in spend divided by conversations, then by customers. The all-in figure includes money not broken out by channel.</Lede>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">One real conversation</p>
          {b.costPerMeeting !== null ? <Figure>{money(b.costPerMeeting)}</Figure> : <p className="mt-4 text-base text-muted-foreground">{b.costPerMeetingHow}</p>}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">One new customer</p>
          {b.costPerDeal !== null ? <Figure accent>{money(b.costPerDeal)}</Figure> : <p className="mt-4 text-base text-muted-foreground">{b.costPerDealHow}</p>}
        </div>
      </div>
      {c.includesUnbrokenOut && c.unbrokenOutSpend !== null && b.spend !== null && (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {money(c.unbrokenOutSpend)} of your {money(b.spend)}{" "}a month isn&rsquo;t tied to any one channel. It&rsquo;s in these numbers, because it&rsquo;s real money.
        </p>
      )}
      {(b.costPerMeeting !== null || b.costPerDeal !== null) && (
        <HowFigured>
          {b.costPerMeeting !== null && <p>{b.costPerMeetingHow}</p>}
          {b.costPerDeal !== null && <p className="mt-2">{b.costPerDealHow}</p>}
        </HowFigured>
      )}
      {hasChannels && (
        <Disclosure label="By channel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="py-2 pr-3 font-normal">Channel</th>
                  <th className="py-2 pr-3 font-normal">Spend</th>
                  <th className="py-2 pr-3 font-normal">Per conversation</th>
                  <th className="py-2 font-normal">Per customer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {c.channels.map((ch) => (
                  <tr key={ch.channelId}>
                    <td className="py-2 pr-3 text-foreground">{ch.name}</td>
                    <td className="py-2 pr-3 tabular-nums">{ch.spend !== null ? money(ch.spend) : <span className="text-muted-foreground">not entered</span>}</td>
                    <td className="py-2 pr-3 tabular-nums">
                      {ch.costPerMeeting !== null ? money(ch.costPerMeeting) : <span className="text-muted-foreground">{ch.costPerMeetingNote}</span>}
                    </td>
                    <td className="py-2 tabular-nums">
                      {ch.costPerDeal !== null ? money(ch.costPerDeal) : <span className="text-muted-foreground">{ch.costPerDealNote}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-muted-foreground">
            A channel with spend and no traced deals isn&rsquo;t free and isn&rsquo;t worthless. It&rsquo;s a channel you can&rsquo;t measure yet.
          </p>
        </Disclosure>
      )}
    </Card>
  )
}

function MeetingValueCard({ r, onSetAssumption }: { r: PipelineResult; onSetAssumption: ResultsProps["onSetAssumption"] }) {
  const m = r.meetingValue
  const [slider, setSlider] = useState(20)
  const unknownRate = m.available && m.value === null && m.dealSize !== null
  const assumed = m.closeRateSource === "assumed"

  return (
    <Card id="meeting-value">
      <Eyebrow>One conversation</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">What one real sales conversation is worth to you</h2>
      <Lede>Your average deal times your close rate. The value of one good conversation before you&rsquo;ve had it, because some share of them become deals.</Lede>
      {!m.available || m.dealSize === null ? (
        <Unavailable reason={m.reason} />
      ) : unknownRate ? (
        <>
          <div className="mt-6">
            <Figure accent>
              <span className="pm-assumed">{money(meetingValueAt(m.dealSize, slider / 100))}</span>
            </Figure>
            <p className="mt-2 text-sm text-muted-foreground">
              if {slider}% of conversations become customers. That&rsquo;s your estimate, not a number you track.
            </p>
          </div>
          <div className="pm-no-print mt-5">
            <label htmlFor="close-rate-slider" className="text-sm text-foreground">
              Try a close rate
            </label>
            <input
              id="close-rate-slider"
              type="range"
              min={5}
              max={60}
              step={1}
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="mt-2 w-full accent-[#d28b4a]"
            />
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {m.atRates.map((a) => (
                <span key={a.rate}>
                  at {percent(a.rate)}: <span className="text-foreground">{money(a.value)}</span>
                </span>
              ))}
            </div>
            <Button variant="quiet" className="mt-2 px-0" onClick={() => onSetAssumption("closeRate", slider / 100)}>
              Use {slider}% everywhere as my estimate →
            </Button>
          </div>
        </>
      ) : (
        <>
          <Figure accent>{assumed ? <span className="pm-assumed">{money(m.value!)}</span> : money(m.value!)}</Figure>
          <p className="mt-2 text-sm text-muted-foreground">
            {money(m.dealSize)} per deal, {percent(m.closeRate!)} close rate{oneIn(m.closeRate!) ? ` (about ${oneIn(m.closeRate!)})` : ""}
            {assumed ? ". The close rate is your estimate." : m.closeRateSource === "derived" ? ". The close rate was worked out from your deals and conversations." : "."}
          </p>
          {assumed && (
            <Button variant="quiet" className="pm-no-print mt-1 px-0" onClick={() => onSetAssumption("closeRate", null)}>
              Clear the estimate
            </Button>
          )}
          {m.lifetime && (
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              Because customers keep paying, over a typical customer&rsquo;s whole time with you that one conversation is worth about{" "}
              <span className="text-foreground">{money(m.lifetime.value)}</span>.
            </p>
          )}
          <HowFigured>
            <p>{m.how}</p>
            {m.lifetime && <p className="mt-2">{m.lifetime.how}</p>}
          </HowFigured>
        </>
      )}
    </Card>
  )
}

function LeverCard({ r }: { r: PipelineResult }) {
  const l = r.lever
  const labels = { leads: "More conversations", closeRate: "Higher close rate", dealSize: "Bigger deals" } as const
  return (
    <Card id="lever">
      <Eyebrow>Your biggest lever</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">Which single change would make you the most money</h2>
      <Lede>We tried a 10% improvement to three things, one at a time, over your {l.horizonDays}-day window, and kept score.</Lede>
      {!l.available ? (
        <Unavailable reason={l.reason} />
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {l.levers.map((lv) => {
              const top = l.top.includes(lv.key)
              return (
                <li key={lv.key} className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <span className={top ? "text-foreground" : "text-muted-foreground"}>{labels[lv.key]}</span>
                  <span className={`pm-figure text-2xl sm:text-3xl ${top ? "text-accent" : "text-foreground/80"}`}>+{money(lv.extraRevenue)}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-base leading-relaxed text-foreground/90">{l.interpretation}</p>
          <HowFigured>
            {l.levers.map((lv) => (
              <p key={lv.key} className="mt-2 first:mt-0">
                <span className="text-foreground">{labels[lv.key]}:</span> {lv.how}
              </p>
            ))}
          </HowFigured>
        </>
      )}
    </Card>
  )
}

function ForecastCard({ r }: { r: PipelineResult }) {
  const f = r.forecast
  const cycle = r.normalized.cycleDays.value
  const title =
    f.change === "hold"
      ? `The next ${f.horizonDays} days if you hold`
      : f.change === "up"
        ? `The next ${f.horizonDays} days if you add ${money(f.changeAmountPerMonth)} a month`
        : `The next ${f.horizonDays} days if you cut ${money(f.changeAmountPerMonth)} a month`
  return (
    <Card id="forecast">
      <Eyebrow>Looking ahead</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">{title}</h2>
      <Lede>
        {f.change === "hold"
          ? "Money out and money back, week by week, adding up as they go."
          : f.change === "up"
            ? "The extra money out and the extra money back, week by week, adding up as they go. The money goes out first."
            : "The money saved and the revenue lost, week by week, adding up as they go. The savings show up first."}
      </Lede>
      {!f.available ? (
        <Unavailable reason={f.reason} />
      ) : (
        <>
          <ForecastChart forecast={f} />
          <p className="mt-2 text-base font-medium text-accent">{f.crossoverLabel}</p>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">{f.summary}</p>
          {f.change === "up" && f.firstRevenueWeek !== null && cycle !== null && (
            <p className="mt-2 text-sm text-muted-foreground">
              Money spent in any given week starts coming back about {f.firstRevenueWeek} {f.firstRevenueWeek === 1 ? "week" : "weeks"} later, and half of it is back by
              about week {f.halfRevenueWeek ?? "—"}, because a deal takes {duration(cycle)} to close.
            </p>
          )}
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            {f.assumptions.map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
          <Disclosure label="Week by week">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[24rem] text-left text-sm tabular-nums">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    <th className="py-2 pr-3 font-normal">Week</th>
                    <th className="py-2 pr-3 font-normal">Out</th>
                    <th className="py-2 pr-3 font-normal">Back</th>
                    <th className="py-2 pr-3 font-normal">Out so far</th>
                    <th className="py-2 font-normal">Back so far</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {f.points.map((p) => (
                    <tr key={p.week} className={p.week === f.crossoverWeek ? "text-accent" : ""}>
                      <td className="py-1.5 pr-3">{p.week}</td>
                      <td className="py-1.5 pr-3">{money(p.spend)}</td>
                      <td className="py-1.5 pr-3">{money(p.revenue)}</td>
                      <td className="py-1.5 pr-3">{money(p.cumulativeSpend)}</td>
                      <td className="py-1.5">{money(p.cumulativeRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-muted-foreground">
              These are totals, including the spend and revenue you already have. The chart above shows only the change, so the timing is easier to see.
            </p>
          </Disclosure>
        </>
      )}
    </Card>
  )
}

function NextStepCard() {
  return (
    <Card id="next-step" className="pm-no-print border-accent/40">
      <Eyebrow>If you want a second pair of eyes</Eyebrow>
      <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">The free Marketing Scan</h2>
      <p className="mt-3 text-base leading-relaxed text-foreground/90">
        A short call where we look at your real numbers together, starting with the ones this page says you don&rsquo;t track yet, and tell you plainly what
        we&rsquo;d fix first. No pitch on the call. If we&rsquo;re not the right fit, we&rsquo;ll say so.
      </p>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        Send a note through the contact form, mention the Pipeline Math, and we&rsquo;ll set a time that suits you.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={CALENDAR_URL}
          className="inline-flex min-h-12 items-center rounded-md bg-accent px-5 text-base font-medium text-accent-foreground hover:bg-[#dd9a5c]"
        >
          Ask about the free scan
        </a>
      </div>
    </Card>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
