/**
 * The Pipeline Math — engine types.
 *
 * Everything the engine consumes is one PipelineInputs object.
 * Everything it produces is one PipelineResult object.
 * `null` always means "the user doesn't know". It is never a silent default.
 */

export type Unknown = null

export interface DayRange {
  low: number
  high: number
}

export type RevenueType = "one-time" | "recurring"
export type ReportingPeriod = "month" | "quarter"
export type SpendTrend = "steady" | "up" | "down"
export type SpendChange = "up" | "down" | "hold"
export type Horizon = 90 | 180

export interface ChannelInput {
  id: string
  name: string
  /** Dollars per month spent on this channel. */
  monthlySpend: number | Unknown
  /** Leads or inquiries per month that came from this channel. */
  leadsPerMonth: number | Unknown
  /** Deals closed per month that came from this channel. */
  dealsPerMonth: number | Unknown
}

export interface PipelineInputs {
  deal: {
    /** Dollars. For subscriptions: what a customer pays in the first 12 months. */
    averageDealSize: number | Unknown
    /** Days from first contact to closed-won. Single values use low === high. */
    salesCycleDays: DayRange | Unknown
    /** Fraction 0..1 of qualified conversations that become customers. */
    closeRate: number | Unknown
    revenueType: RevenueType | Unknown
    /** Months a typical customer stays, if recurring. */
    customerLifespanMonths: number | Unknown
  }
  spend: {
    channels: ChannelInput[]
    /** Dollars per month, everything included (ads, retainers, salaries, tools). */
    totalMonthlySpend: number | Unknown
    /** Has total spend been steady over the last few months? */
    spendTrend: SpendTrend | Unknown
    /** Dollars per month roughly three months ago, if the trend is up or down. */
    spendThreeMonthsAgo: number | Unknown
  }
  results: {
    period: ReportingPeriod
    closedDeals: number | Unknown
    newRevenue: number | Unknown
    qualifiedMeetings: number | Unknown
  }
  forecast: {
    change: SpendChange
    /** Dollars per month added or removed. Ignored when change === "hold". */
    changeAmountPerMonth: number | Unknown
    horizonDays: Horizon
  }
  /**
   * Adjustable assumptions the user set from the results page.
   * These are always reported as "assumed", never as given.
   */
  assumptions?: {
    salesCycleDays?: number
    closeRate?: number
  }
}

/** Where a number came from. Drives the "what you don't track" block. */
export type Source = "given" | "derived" | "assumed" | "missing"

export interface Figure {
  value: number | null
  source: Source
  /** Plain words: how this was figured, using the user's own numbers. */
  how: string
}

export interface Assumption {
  /** Field ID this concerns (keys into help content). */
  field: string
  /** Plain-English name of the number. */
  label: string
  kind: Exclude<Source, "given">
  /** The value used, if any. */
  value: number | null
  /** One or two plain sentences: what we did about it. */
  note: string
  /** Names of results that would appear or improve if this were known. */
  unlocks: string[]
}

export interface Normalized {
  dealSize: Figure
  cycleDays: Figure
  cycleRange: DayRange | null
  closeRate: Figure
  monthlySpend: Figure
  channelSpendSum: number | null
  unbrokenOutSpend: number | null
  dealsPerMonth: Figure
  revenuePerMonth: Figure
  meetingsPerMonth: Figure
  spendTrend: SpendTrend
  spendThreeMonthsAgo: number | null
  revenueType: RevenueType | null
  lifespanMonths: number | null
  lifetimeValue: Figure
}

export interface ReturnResult {
  available: boolean
  /** Why nothing could be shown, if !available. */
  reason?: string
  /** Revenue this month ÷ spend this month. What their dashboard shows. */
  naive: number | null
  naiveHow: string
  /** Revenue this month ÷ the spend that actually caused it. */
  lagAdjusted: number | null
  lagAdjustedHow: string
  /** Dollars of past spend the cohort model says produced this month's revenue. */
  spendThatCausedRevenue: number | null
  /** Do the two numbers land within a few percent of each other? */
  converge: boolean
  /** One sentence: why they differ, or why they don't. */
  explanation: string
  /** Weeks after spend when revenue starts landing, peaks, and finishes. */
  lagWindowWeeks: { first: number; center: number; last: number } | null
  /** The honesty line about this being an estimate from their stated cycle. */
  caveat: string
}

export interface CostRow {
  channelId: string
  name: string
  spend: number | null
  leads: number | null
  deals: number | null
  costPerMeeting: number | null
  costPerMeetingNote: string | null
  costPerDeal: number | null
  costPerDealNote: string | null
}

export interface CostResult {
  blended: {
    spend: number | null
    meetings: number | null
    deals: number | null
    costPerMeeting: number | null
    costPerMeetingHow: string
    costPerDeal: number | null
    costPerDealHow: string
  }
  channels: CostRow[]
  includesUnbrokenOut: boolean
  unbrokenOutSpend: number | null
}

export interface AttributionResult {
  available: boolean
  reason?: string
  totalDeals: number | null
  tracedDeals: number
  untracedDeals: number
  untracedShare: number | null
  untracedRevenue: number | null
  /** Channels with no deal count entered at all. */
  channelsWithoutDealData: string[]
  /** Channel deals summed to more than total deals. */
  overReported: boolean
  overReportedBy: number
  reconciles: boolean
  summary: string
  how: string
}

export interface MeetingValueResult {
  available: boolean
  reason?: string
  dealSize: number | null
  closeRate: number | null
  closeRateSource: Source
  /** dealSize × closeRate, if close rate is known or assumed. */
  value: number | null
  how: string
  /** Values at the reference rates, for the "estimate" view. */
  atRates: Array<{ rate: number; value: number }>
  /** First-year value vs full customer life, when recurring. */
  lifetime: { value: number; how: string } | null
}

export type LeverKey = "leads" | "closeRate" | "dealSize"

export interface LeverResult {
  available: boolean
  reason?: string
  horizonDays: Horizon
  levers: Array<{
    key: LeverKey
    label: string
    /** Extra revenue over the horizon from a 10% improvement. */
    extraRevenue: number
    how: string
  }>
  /** Keys of the top lever(s). More than one when they tie. */
  top: LeverKey[]
  interpretation: string
}

export interface ForecastPoint {
  week: number
  /** Total money out this week. */
  spend: number
  /** Total money in this week. */
  revenue: number
  cumulativeSpend: number
  cumulativeRevenue: number
  /** For a change: the extra (or saved) spend so far. */
  cumulativeChangeSpend: number
  /** For a change: the extra (or lost) revenue so far. */
  cumulativeChangeRevenue: number
}

export interface ForecastResult {
  available: boolean
  reason?: string
  change: SpendChange
  changeAmountPerMonth: number
  horizonDays: Horizon
  horizonWeeks: number
  points: ForecastPoint[]
  /** Week where cumulative change revenue passes cumulative change spend (or lost passes saved). */
  crossoverWeek: number | null
  crossoverLabel: string
  /** Week the first meaningful revenue from new spend lands. */
  firstRevenueWeek: number | null
  /** Week half of the new spend's revenue has landed. */
  halfRevenueWeek: number | null
  totals: {
    spend: number
    revenue: number
    changeSpend: number
    changeRevenue: number
    holdRevenue: number
  }
  summary: string
  assumptions: string[]
}

export interface PipelineResult {
  headline: string
  assumptions: Assumption[]
  normalized: Normalized
  returns: ReturnResult
  costs: CostResult
  attribution: AttributionResult
  meetingValue: MeetingValueResult
  lever: LeverResult
  forecast: ForecastResult
  /** Problems with the input the engine worked around (negative numbers, etc). */
  warnings: string[]
}
