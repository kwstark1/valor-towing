"use client"

import { useState } from "react"
import type { FormState, FieldValue, ChannelForm } from "@/lib/pipeline-math/form-state"
import { emptyChannelForm, isAnswered, isUnreadable } from "@/lib/pipeline-math/form-state"
import { parseCount, parseDayRange, parseMoney, parseMonths, parseRate } from "@/lib/pipeline-math/parse"
import { fieldHelp, stepIntros } from "@/lib/pipeline-math/help-content"
import { CHANNEL_SUGGESTIONS } from "@/lib/pipeline-math/defaults"
import { MiniField, NumberField, RANGE_ERROR, READ_ERROR } from "./fields"
import { Button, Choice, Eyebrow, Hint } from "./ui"

export interface FlowProps {
  form: FormState
  onChange: (next: FormState) => void
  onDone: () => void
  onHelp: () => void
  /** Start on a given step, e.g. when coming back from results. */
  initialStep?: number
}

const STEP_COUNT = 4

export function Flow({ form, onChange, onDone, onHelp, initialStep = 0 }: FlowProps) {
  const [step, setStep] = useState(Math.min(Math.max(0, initialStep), STEP_COUNT - 1))
  const [tried, setTried] = useState(false)

  const set = <K extends keyof FormState>(key: K, patch: Partial<FormState[K]>) => onChange({ ...form, [key]: { ...form[key], ...patch } })

  const problems = validate(form, step)
  const canContinue = problems.blocking.length === 0

  function next() {
    setTried(true)
    if (!canContinue) return
    setTried(false)
    if (step === STEP_COUNT - 1) onDone()
    else {
      setStep(step + 1)
      window.scrollTo({ top: 0 })
    }
  }
  function back() {
    setTried(false)
    setStep(Math.max(0, step - 1))
    window.scrollTo({ top: 0 })
  }

  const intro = stepIntros[step]
  const err = (id: string) => (tried ? problems.messages[id] ?? null : problems.unreadable[id] ?? null)

  return (
    <form
      className="mx-auto max-w-xl px-5 pb-28 pt-8 sm:px-8 sm:pt-12"
      onSubmit={(e) => {
        e.preventDefault()
        next()
      }}
      noValidate
    >
      <Progress step={step} />
      <h1 className="mt-4 font-display text-3xl tracking-tight text-foreground sm:text-4xl">{intro.title}</h1>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">{intro.intro}</p>

      <div className="mt-8 space-y-8">
        {step === 0 && <DealStep form={form} set={set} err={err} />}
        {step === 1 && <SpendStep form={form} set={set} err={err} />}
        {step === 2 && <ResultsStep form={form} set={set} err={err} />}
        {step === 3 && <ForecastStep form={form} set={set} err={err} />}
      </div>

      {tried && !canContinue && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {problems.blocking[0]}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 mt-10 border-t border-border bg-background/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={back}>
                Back
              </Button>
            )}
            <button type="button" onClick={onHelp} aria-haspopup="dialog" className="inline-flex min-h-12 items-center gap-1.5 px-2 text-sm text-muted-foreground hover:text-foreground">
              <span aria-hidden="true" className="text-accent">
                ?
              </span>
              Help
            </button>
          </div>
          <Button type="submit">{step === STEP_COUNT - 1 ? "See my results" : "Continue"}</Button>
        </div>
      </div>
    </form>
  )
}

function Progress({ step }: { step: number }) {
  return (
    <div aria-label={`Step ${step + 1} of ${STEP_COUNT}`}>
      <Eyebrow>
        Step {step + 1} of {STEP_COUNT}
      </Eyebrow>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-border"}`} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Validation: forgiving. Only blocks when a required question has no answer
// at all, or when something typed can't be read.
// ---------------------------------------------------------------------------

interface Problems {
  blocking: string[]
  /** Per-field messages shown once the user has tried to continue. */
  messages: Record<string, string>
  /** Per-field messages shown immediately (typed text we can't read). */
  unreadable: Record<string, string>
}

function validate(form: FormState, step: number): Problems {
  const p: Problems = { blocking: [], messages: {}, unreadable: {} }
  const need = (id: string, f: FieldValue, parse: (s: string) => unknown, msg: string, readErr = READ_ERROR) => {
    if (isUnreadable(f, parse)) {
      p.unreadable[id] = readErr
      p.messages[id] = readErr
      p.blocking.push(readErr)
    } else if (!isAnswered(f, parse)) {
      p.messages[id] = msg
      p.blocking.push(msg)
    }
  }
  const optional = (id: string, f: FieldValue, parse: (s: string) => unknown, readErr = READ_ERROR) => {
    if (isUnreadable(f, parse)) {
      p.unreadable[id] = readErr
      p.messages[id] = readErr
      p.blocking.push(readErr)
    }
  }

  if (step === 0) {
    need("averageDealSize", form.deal.averageDealSize, parseMoney, "Need the deal size, or tap \"I don't know\".")
    need("salesCycleDays", form.deal.salesCycleDays, parseDayRange, "Need how long a deal takes, or tap \"I don't know\".", RANGE_ERROR)
    need("closeRate", form.deal.closeRate, parseRate, "Need your close rate, or tap \"I don't know\".")
    if (form.deal.revenueType === "recurring") optional("customerLifespanMonths", form.deal.customerLifespanMonths, parseMonths)
  }
  if (step === 1) {
    form.spend.channels.forEach((c, i) => {
      optional(`ch-${i}-spend`, c.spend, parseMoney)
      optional(`ch-${i}-leads`, c.leads, parseCount)
      optional(`ch-${i}-deals`, c.deals, parseCount)
    })
    need("totalMonthlySpend", form.spend.totalMonthlySpend, parseMoney, "Need your all-in monthly spend, or tap \"I don't know\".")
    if (form.spend.spendTrend === null) {
      p.messages.spendTrend = "Pick one, even if it's \"I don't know\"."
      p.blocking.push(p.messages.spendTrend)
    }
    if (form.spend.spendTrend === "up" || form.spend.spendTrend === "down") {
      need("spendThreeMonthsAgo", form.spend.spendThreeMonthsAgo, parseMoney, "Need a rough figure for three months ago, or tap \"I don't know\".")
    }
  }
  if (step === 2) {
    need("closedDeals", form.results.closedDeals, parseCount, "Need how many deals you closed, or tap \"I don't know\".")
    need("newRevenue", form.results.newRevenue, parseMoney, "Need the new revenue, or tap \"I don't know\".")
    need("qualifiedMeetings", form.results.qualifiedMeetings, parseCount, "Need the number of real conversations, or tap \"I don't know\".")
  }
  if (step === 3) {
    if (form.forecast.change !== "hold") {
      need("changeAmountPerMonth", form.forecast.changeAmountPerMonth, parseMoney, "Need the monthly amount, or tap \"I don't know\".")
    }
  }
  return p
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

type StepProps = {
  form: FormState
  set: <K extends keyof FormState>(key: K, patch: Partial<FormState[K]>) => void
  err: (id: string) => string | null
}

function DealStep({ form, set, err }: StepProps) {
  const d = form.deal
  return (
    <>
      <NumberField fieldId="averageDealSize" value={d.averageDealSize} onChange={(v) => set("deal", { averageDealSize: v })} prefix="$" placeholder="12,500" error={err("averageDealSize")} />
      <NumberField
        fieldId="salesCycleDays"
        value={d.salesCycleDays}
        onChange={(v) => set("deal", { salesCycleDays: v })}
        placeholder="30 to 60 days"
        inputMode="text"
        error={err("salesCycleDays")}
        labelOverride="How long does it usually take to go from first conversation to signed deal? (sales cycle)"
      />
      <NumberField fieldId="closeRate" value={d.closeRate} onChange={(v) => set("deal", { closeRate: v })} suffix="%" placeholder="25" error={err("closeRate")} labelOverride="Of the real sales conversations you have, what share become customers? (close rate)" />
      <div>
        <Choice
          name="revenueType"
          label={fieldHelp.revenueType.label}
          value={d.revenueType}
          onChange={(v) => set("deal", { revenueType: v })}
          options={[
            { value: "one-time", label: "One payment", description: "A project, a product, a one-off engagement." },
            { value: "recurring", label: "They keep paying", description: "A subscription, retainer, or contract that renews." },
          ]}
        />
        <Hint text={fieldHelp.revenueType.hint} />
      </div>
      {d.revenueType === "recurring" && (
        <NumberField fieldId="customerLifespanMonths" value={d.customerLifespanMonths} onChange={(v) => set("deal", { customerLifespanMonths: v })} suffix="months" placeholder="18" error={err("customerLifespanMonths")} />
      )}
    </>
  )
}

function SpendStep({ form, set, err }: StepProps) {
  const s = form.spend
  const updateChannel = (i: number, patch: Partial<ChannelForm>) =>
    set("spend", { channels: s.channels.map((c, j) => (j === i ? { ...c, ...patch } : c)) })
  const removeChannel = (i: number) => set("spend", { channels: s.channels.filter((_, j) => j !== i) })

  return (
    <>
      <div>
        <p className="text-base leading-snug text-foreground sm:text-lg">Where does the money go? One row per channel.</p>
        <p className="mt-1 text-sm text-muted-foreground">Leave a box blank if you don&rsquo;t know. That&rsquo;s a real answer here.</p>
        <datalist id="channel-suggestions">
          {CHANNEL_SUGGESTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <div className="mt-4 space-y-4">
          {s.channels.map((c, i) => (
            <div key={c.id} className="rounded-md border border-border p-3">
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <label htmlFor={`ch-name-${c.id}`} className="block text-xs text-muted-foreground">
                    Channel
                  </label>
                  <input
                    id={`ch-name-${c.id}`}
                    list="channel-suggestions"
                    type="text"
                    value={c.name}
                    placeholder="Google Ads, referrals, events…"
                    onChange={(e) => updateChannel(i, { name: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-base text-foreground placeholder-muted-foreground/50 focus:border-accent focus:outline-none"
                  />
                </div>
                {s.channels.length > 1 && (
                  <button type="button" onClick={() => removeChannel(i)} className="min-h-11 px-2 text-sm text-muted-foreground hover:text-foreground" aria-label={`Remove ${c.name || "this channel"}`}>
                    Remove
                  </button>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <MiniField label="Spend / month" prefix="$" value={c.spend.raw} onChange={(raw) => updateChannel(i, { spend: { raw, unknown: false } })} error={!!err(`ch-${i}-spend`)} />
                <MiniField label="Leads / month" value={c.leads.raw} onChange={(raw) => updateChannel(i, { leads: { raw, unknown: false } })} error={!!err(`ch-${i}-leads`)} />
                <MiniField label="Deals / month" value={c.deals.raw} onChange={(raw) => updateChannel(i, { deals: { raw, unknown: false } })} error={!!err(`ch-${i}-deals`)} />
              </div>
              {(err(`ch-${i}-spend`) || err(`ch-${i}-leads`) || err(`ch-${i}-deals`)) && (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {READ_ERROR}
                </p>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="quiet" className="mt-2 px-0" onClick={() => set("spend", { channels: [...s.channels, emptyChannelForm()] })}>
          + Add another channel
        </Button>
        <Hint text={fieldHelp.channelDeals.hint} />
      </div>

      <NumberField fieldId="totalMonthlySpend" value={s.totalMonthlySpend} onChange={(v) => set("spend", { totalMonthlySpend: v })} prefix="$" placeholder="14,000" error={err("totalMonthlySpend")} />

      <div>
        <Choice
          name="spendTrend"
          label={fieldHelp.spendTrend.label}
          value={s.spendTrend}
          onChange={(v) => set("spend", { spendTrend: v })}
          options={[
            { value: "steady", label: "About the same" },
            { value: "up", label: "It's gone up" },
            { value: "down", label: "It's gone down" },
            { value: "unknown", label: "I don't know" },
          ]}
        />
        {err("spendTrend") && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {err("spendTrend")}
          </p>
        )}
        <Hint text={fieldHelp.spendTrend.hint} />
      </div>

      {(s.spendTrend === "up" || s.spendTrend === "down") && (
        <NumberField fieldId="spendThreeMonthsAgo" value={s.spendThreeMonthsAgo} onChange={(v) => set("spend", { spendThreeMonthsAgo: v })} prefix="$" placeholder="9,000" error={err("spendThreeMonthsAgo")} />
      )}
    </>
  )
}

function ResultsStep({ form, set, err }: StepProps) {
  const r = form.results
  const per = r.period === "quarter" ? "last quarter" : "last month"
  return (
    <>
      <div>
        <Choice
          name="period"
          label={fieldHelp.period.label}
          value={r.period}
          onChange={(v) => set("results", { period: v })}
          options={[
            { value: "month", label: "A month", description: "A typical recent month." },
            { value: "quarter", label: "A quarter", description: "The last three months together." },
          ]}
        />
      </div>
      <NumberField fieldId="closedDeals" value={r.closedDeals} onChange={(v) => set("results", { closedDeals: v })} placeholder="14" inputMode="numeric" error={err("closedDeals")} labelOverride={`How many new deals did you close ${per}?`} />
      <NumberField fieldId="newRevenue" value={r.newRevenue} onChange={(v) => set("results", { newRevenue: v })} prefix="$" placeholder="175,000" error={err("newRevenue")} labelOverride={`How much new revenue did those deals bring in ${per}?`} />
      <NumberField fieldId="qualifiedMeetings" value={r.qualifiedMeetings} onChange={(v) => set("results", { qualifiedMeetings: v })} placeholder="56" inputMode="numeric" error={err("qualifiedMeetings")} labelOverride={`How many real sales conversations did you have ${per}? (qualified meetings)`} />
    </>
  )
}

function ForecastStep({ form, set, err }: StepProps) {
  const f = form.forecast
  return (
    <>
      <div>
        <Choice
          name="change"
          label={fieldHelp.forecastChange.label}
          value={f.change}
          onChange={(v) => set("forecast", { change: v })}
          options={[
            { value: "up", label: "Spend more" },
            { value: "down", label: "Spend less" },
            { value: "hold", label: "Keep it where it is" },
          ]}
        />
        <Hint text={fieldHelp.forecastChange.hint} />
      </div>
      {f.change !== "hold" && (
        <NumberField fieldId="changeAmountPerMonth" value={f.changeAmountPerMonth} onChange={(v) => set("forecast", { changeAmountPerMonth: v })} prefix="$" placeholder="5,000" error={err("changeAmountPerMonth")} labelOverride={f.change === "up" ? "By how much more per month?" : "By how much less per month?"} />
      )}
      <div>
        <Choice
          name="horizon"
          label={fieldHelp.horizonDays.label}
          value={String(f.horizonDays) as "90" | "180"}
          onChange={(v) => set("forecast", { horizonDays: v === "180" ? 180 : 90 })}
          options={[
            { value: "90", label: "90 days" },
            { value: "180", label: "180 days" },
          ]}
        />
        <Hint text={fieldHelp.horizonDays.hint} />
      </div>
    </>
  )
}
