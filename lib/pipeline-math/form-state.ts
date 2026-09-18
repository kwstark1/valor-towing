/**
 * Form state for the input flow. Keeps exactly what the user typed (raw
 * strings) so nothing is lost on a validation error, and turns that into a
 * PipelineInputs object for the engine on demand.
 */

import type { Horizon, PipelineInputs, ReportingPeriod, RevenueType, SpendChange, SpendTrend } from "./types"
import { parseCount, parseDayRange, parseMoney, parseMonths, parseRate } from "./parse"
import { newChannelId } from "./defaults"
import { manualAdapter } from "./adapters/manual"

export interface FieldValue {
  raw: string
  /** "I don't know" was chosen. Raw is kept so they can change their mind. */
  unknown: boolean
}

export interface ChannelForm {
  id: string
  name: string
  spend: FieldValue
  leads: FieldValue
  deals: FieldValue
}

export interface FormState {
  deal: {
    averageDealSize: FieldValue
    salesCycleDays: FieldValue
    closeRate: FieldValue
    revenueType: RevenueType | null
    customerLifespanMonths: FieldValue
  }
  spend: {
    channels: ChannelForm[]
    totalMonthlySpend: FieldValue
    spendTrend: SpendTrend | "unknown" | null
    spendThreeMonthsAgo: FieldValue
  }
  results: {
    period: ReportingPeriod
    closedDeals: FieldValue
    newRevenue: FieldValue
    qualifiedMeetings: FieldValue
  }
  forecast: {
    change: SpendChange
    changeAmountPerMonth: FieldValue
    horizonDays: Horizon
  }
  assumptions: {
    salesCycleDays: number | null
    closeRate: number | null
  }
}

export function field(raw = ""): FieldValue {
  return { raw, unknown: false }
}

export function emptyChannelForm(name = ""): ChannelForm {
  return { id: newChannelId(), name, spend: field(), leads: field(), deals: field() }
}

export function emptyForm(): FormState {
  return {
    deal: {
      averageDealSize: field(),
      salesCycleDays: field(),
      closeRate: field(),
      revenueType: null,
      customerLifespanMonths: field(),
    },
    spend: {
      channels: [emptyChannelForm()],
      totalMonthlySpend: field(),
      spendTrend: null,
      spendThreeMonthsAgo: field(),
    },
    results: {
      period: "month",
      closedDeals: field(),
      newRevenue: field(),
      qualifiedMeetings: field(),
    },
    forecast: {
      change: "hold",
      changeAmountPerMonth: field(),
      horizonDays: 90,
    },
    assumptions: { salesCycleDays: null, closeRate: null },
  }
}

/** A field is answered if it's marked unknown or has readable text. */
export function isAnswered(f: FieldValue, parse: (s: string) => unknown): boolean {
  return f.unknown || (f.raw.trim() !== "" && parse(f.raw) !== null)
}

/** Text was typed but can't be read. */
export function isUnreadable(f: FieldValue, parse: (s: string) => unknown): boolean {
  return !f.unknown && f.raw.trim() !== "" && parse(f.raw) === null
}

function val<T>(f: FieldValue, parse: (s: string) => T | null): T | null {
  if (f.unknown) return null
  return parse(f.raw)
}

export function toInputs(form: FormState): PipelineInputs {
  const channels = form.spend.channels
    .filter((c) => c.name.trim() !== "" || c.spend.raw.trim() !== "" || c.leads.raw.trim() !== "" || c.deals.raw.trim() !== "")
    .map((c) => ({
      id: c.id,
      name: c.name.trim(),
      monthlySpend: val(c.spend, parseMoney),
      leadsPerMonth: val(c.leads, parseCount),
      dealsPerMonth: val(c.deals, parseCount),
    }))

  const trend = form.spend.spendTrend === "unknown" ? null : form.spend.spendTrend

  return manualAdapter.toInputs({
    deal: {
      averageDealSize: val(form.deal.averageDealSize, parseMoney),
      salesCycleDays: val(form.deal.salesCycleDays, parseDayRange),
      closeRate: val(form.deal.closeRate, parseRate),
      revenueType: form.deal.revenueType,
      customerLifespanMonths: form.deal.revenueType === "recurring" ? val(form.deal.customerLifespanMonths, parseMonths) : null,
    },
    spend: {
      channels,
      totalMonthlySpend: val(form.spend.totalMonthlySpend, parseMoney),
      spendTrend: trend,
      spendThreeMonthsAgo: trend === "up" || trend === "down" ? val(form.spend.spendThreeMonthsAgo, parseMoney) : null,
    },
    results: {
      period: form.results.period,
      closedDeals: val(form.results.closedDeals, parseCount),
      newRevenue: val(form.results.newRevenue, parseMoney),
      qualifiedMeetings: val(form.results.qualifiedMeetings, parseCount),
    },
    forecast: {
      change: form.forecast.change,
      changeAmountPerMonth: form.forecast.change === "hold" ? null : val(form.forecast.changeAmountPerMonth, parseMoney),
      horizonDays: form.forecast.horizonDays,
    },
    assumptions: {
      salesCycleDays: form.assumptions.salesCycleDays ?? undefined,
      closeRate: form.assumptions.closeRate ?? undefined,
    },
  })
}

/** The sample company, as typed text, for the "try an example" path. */
export function sampleForm(): FormState {
  const f = emptyForm()
  f.deal.averageDealSize = field("$12,500")
  f.deal.salesCycleDays = field("30 to 60 days")
  f.deal.closeRate = field("25%")
  f.deal.revenueType = "one-time"
  f.spend.channels = [
    { id: newChannelId(), name: "Google Ads", spend: field("6,000"), leads: field("20"), deals: field("4") },
    { id: newChannelId(), name: "LinkedIn Ads", spend: field("3,000"), leads: field("8"), deals: field("1") },
    { id: newChannelId(), name: "Referrals", spend: field("0"), leads: field("6"), deals: field("4") },
  ]
  f.spend.totalMonthlySpend = field("14,000")
  f.spend.spendTrend = "up"
  f.spend.spendThreeMonthsAgo = field("9,000")
  f.results.closedDeals = field("14")
  f.results.newRevenue = field("175,000")
  f.results.qualifiedMeetings = field("56")
  f.forecast.change = "up"
  f.forecast.changeAmountPerMonth = field("5,000")
  f.forecast.horizonDays = 180
  return f
}

export interface Scenario {
  id: string
  name: string
  savedAt: string
  form: FormState
}
