/**
 * The Pipeline Math — calculation engine.
 *
 * Pure functions. No React, no I/O. One input object in, one result object out.
 * Every number in the result is derived from what the user entered. When the
 * user doesn't know something, the engine either derives it (and says so),
 * uses a clearly labeled assumption, or leaves the dependent output out with a
 * note about which input would bring it back.
 */

import type {
  Assumption,
  AttributionResult,
  CostResult,
  CostRow,
  Figure,
  ForecastPoint,
  ForecastResult,
  LeverKey,
  LeverResult,
  MeetingValueResult,
  Normalized,
  PipelineInputs,
  PipelineResult,
  ReturnResult,
  SpendTrend,
} from "./types"
import {
  WEEKS_PER_MONTH,
  cumulativeLag,
  lagWeights,
  lagWindow,
  revenueAtWeek,
  weekWhenShareLanded,
} from "./lag"
import { count, duration, money, numberWord, percent, perDollar, plural, weekLabel } from "./format"

const REFERENCE_RATES = [0.1, 0.2, 0.3]
const CONVERGE_TOLERANCE = 0.05
const HISTORY_WEEKS = 13

// ---------------------------------------------------------------------------
// Sanitizing
// ---------------------------------------------------------------------------

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null
}

/** Non-negative finite number or null. Records a warning when it had to drop something. */
function nonNegative(v: unknown, label: string, warnings: string[]): number | null {
  const n = num(v)
  if (n === null) {
    if (v !== null && v !== undefined) warnings.push(`We couldn't read the ${label}, so we treated it as unknown.`)
    return null
  }
  if (n < 0) {
    warnings.push(`The ${label} was negative, so we treated it as unknown.`)
    return null
  }
  return n
}

function rate(v: unknown, label: string, warnings: string[]): number | null {
  const n = nonNegative(v, label, warnings)
  if (n === null) return null
  if (n > 1 && n <= 100) return n / 100
  if (n > 1) {
    warnings.push(`The ${label} was over 100%, so we treated it as unknown.`)
    return null
  }
  return n
}

// ---------------------------------------------------------------------------
// Normalizing: everything to per-month, with provenance
// ---------------------------------------------------------------------------

function given(value: number, how: string): Figure {
  return { value, source: "given", how }
}
function derived(value: number, how: string): Figure {
  return { value, source: "derived", how }
}
function assumed(value: number, how: string): Figure {
  return { value, source: "assumed", how }
}
function missing(how: string): Figure {
  return { value: null, source: "missing", how }
}

function normalize(input: PipelineInputs, warnings: string[], assumptions: Assumption[]): Normalized {
  const periodDivisor = input.results.period === "quarter" ? 3 : 1
  const periodWord = input.results.period === "quarter" ? "a quarter" : "a month"

  const dealSizeIn = nonNegative(input.deal.averageDealSize, "average deal size", warnings)
  const closedDealsIn = nonNegative(input.results.closedDeals, "closed deals", warnings)
  const revenueIn = nonNegative(input.results.newRevenue, "new revenue", warnings)
  const meetingsIn = nonNegative(input.results.qualifiedMeetings, "qualified conversations", warnings)
  const closeRateIn = rate(input.deal.closeRate, "close rate", warnings)

  const dealsPerMonthIn = closedDealsIn === null ? null : closedDealsIn / periodDivisor
  const revenuePerMonthIn = revenueIn === null ? null : revenueIn / periodDivisor
  const meetingsPerMonthIn = meetingsIn === null ? null : meetingsIn / periodDivisor

  // Deal size
  let dealSize: Figure
  if (dealSizeIn !== null && dealSizeIn > 0) {
    dealSize = given(dealSizeIn, `You told us your average deal is ${money(dealSizeIn)}.`)
  } else if (revenuePerMonthIn !== null && dealsPerMonthIn !== null && dealsPerMonthIn > 0) {
    const v = revenuePerMonthIn / dealsPerMonthIn
    dealSize = derived(
      v,
      `${money(revenuePerMonthIn)} of new revenue a month divided by ${count(dealsPerMonthIn)} deals a month equals ${money(v)} per deal.`
    )
    assumptions.push({
      field: "averageDealSize",
      label: "Average deal size",
      kind: "derived",
      value: v,
      note: `You didn't give one, so we figured it from your revenue and deal count: ${money(v)} per deal.`,
      unlocks: [],
    })
  } else {
    dealSize = missing("Needs the average deal size, or both revenue and deal count.")
    assumptions.push({
      field: "averageDealSize",
      label: "Average deal size",
      kind: "missing",
      value: null,
      note: "We couldn't figure it from anything else you entered.",
      unlocks: ["what a meeting is worth", "the revenue you can't trace, in dollars"],
    })
  }

  // Deals per month
  let dealsPerMonth: Figure
  if (dealsPerMonthIn !== null) {
    dealsPerMonth = given(
      dealsPerMonthIn,
      periodDivisor === 3
        ? `${count(closedDealsIn!)} deals a quarter divided by 3 equals ${count(dealsPerMonthIn)} a month.`
        : `You told us you close ${count(dealsPerMonthIn)} deals a month.`
    )
  } else if (revenuePerMonthIn !== null && dealSize.value !== null && dealSize.value > 0) {
    const v = revenuePerMonthIn / dealSize.value
    dealsPerMonth = derived(
      v,
      `${money(revenuePerMonthIn)} of new revenue a month divided by ${money(dealSize.value)} per deal equals ${count(v)} deals a month.`
    )
    assumptions.push({
      field: "closedDeals",
      label: "Deals closed per month",
      kind: "derived",
      value: v,
      note: `You didn't give one, so we figured it from your revenue and deal size: about ${count(v)} a month.`,
      unlocks: [],
    })
  } else {
    dealsPerMonth = missing("Needs the number of deals you close, or both revenue and deal size.")
    assumptions.push({
      field: "closedDeals",
      label: "Deals closed per month",
      kind: "missing",
      value: null,
      note: "Without it we can't tell how many of your deals are traced to a source.",
      unlocks: ["where your sales came from", "what it costs you to get one customer"],
    })
  }

  // Revenue per month
  let revenuePerMonth: Figure
  if (revenuePerMonthIn !== null) {
    revenuePerMonth = given(
      revenuePerMonthIn,
      periodDivisor === 3
        ? `${money(revenueIn!)} a quarter divided by 3 equals ${money(revenuePerMonthIn)} a month.`
        : `You told us you bring in ${money(revenuePerMonthIn)} of new revenue a month.`
    )
  } else if (dealsPerMonth.value !== null && dealSize.value !== null) {
    const v = dealsPerMonth.value * dealSize.value
    revenuePerMonth = derived(
      v,
      `${count(dealsPerMonth.value)} deals a month times ${money(dealSize.value)} per deal equals ${money(v)} a month.`
    )
    assumptions.push({
      field: "newRevenue",
      label: "New revenue per month",
      kind: "derived",
      value: v,
      note: `You didn't give one, so we multiplied your deals by your deal size: ${money(v)} a month.`,
      unlocks: [],
    })
  } else {
    revenuePerMonth = missing(`Needs new revenue per ${periodWord}, or both deals and deal size.`)
    assumptions.push({
      field: "newRevenue",
      label: "New revenue per month",
      kind: "missing",
      value: null,
      note: "Most of the results need this one. Even a rough figure from your last few invoices would do.",
      unlocks: ["your return per dollar", "your biggest lever", "the forecast"],
    })
  }

  // Close rate
  let closeRate: Figure
  const closeRateOverride = rate(input.assumptions?.closeRate, "assumed close rate", warnings)
  if (closeRateIn !== null) {
    closeRate = given(closeRateIn, `You told us ${percent(closeRateIn)} of qualified conversations become customers.`)
  } else if (meetingsPerMonthIn !== null && meetingsPerMonthIn > 0 && dealsPerMonth.value !== null) {
    const raw = dealsPerMonth.value / meetingsPerMonthIn
    const v = Math.min(1, raw)
    closeRate = derived(
      v,
      `${count(dealsPerMonth.value)} deals a month divided by ${count(meetingsPerMonthIn)} qualified conversations a month equals ${percent(v)}.`
    )
    assumptions.push({
      field: "closeRate",
      label: "Close rate",
      kind: "derived",
      value: v,
      note:
        raw > 1
          ? `Your deals outnumber your conversations, which can't be right, so we capped it at 100%.`
          : `You didn't give one, so we divided your deals by your conversations: ${percent(v)}.`,
      unlocks: [],
    })
  } else if (closeRateOverride !== null) {
    closeRate = assumed(closeRateOverride, `You set ${percent(closeRateOverride)} as an estimate on the results page.`)
    assumptions.push({
      field: "closeRate",
      label: "Close rate",
      kind: "assumed",
      value: closeRateOverride,
      note: `You don't track this yet. We're using your estimate of ${percent(closeRateOverride)}. Move the slider to try others.`,
      unlocks: [],
    })
  } else {
    closeRate = missing("Needs your close rate, or the number of qualified conversations you have.")
    assumptions.push({
      field: "closeRate",
      label: "Close rate",
      kind: "missing",
      value: null,
      note: "You don't track this yet. It's the number that turns a meeting into a dollar figure, so we show a range instead of one answer.",
      unlocks: ["what a meeting is worth, as one number"],
    })
  }

  // Meetings per month
  let meetingsPerMonth: Figure
  if (meetingsPerMonthIn !== null) {
    meetingsPerMonth = given(
      meetingsPerMonthIn,
      periodDivisor === 3
        ? `${count(meetingsIn!)} a quarter divided by 3 equals ${count(meetingsPerMonthIn)} a month.`
        : `You told us you have ${count(meetingsPerMonthIn)} qualified conversations a month.`
    )
  } else if (dealsPerMonth.value !== null && closeRate.value !== null && closeRate.value > 0 && closeRate.source !== "assumed") {
    const v = dealsPerMonth.value / closeRate.value
    meetingsPerMonth = derived(
      v,
      `${count(dealsPerMonth.value)} deals a month divided by a ${percent(closeRate.value)} close rate equals about ${count(v)} conversations a month.`
    )
    assumptions.push({
      field: "qualifiedMeetings",
      label: "Qualified conversations per month",
      kind: "derived",
      value: v,
      note: `You didn't give one, so we worked backward from your deals and close rate: about ${count(v)} a month.`,
      unlocks: [],
    })
  } else {
    meetingsPerMonth = missing("Needs your qualified conversations per month, or your close rate.")
    assumptions.push({
      field: "qualifiedMeetings",
      label: "Qualified conversations per month",
      kind: "missing",
      value: null,
      note: "You don't track this yet, so we can't say what each conversation costs you.",
      unlocks: ["cost per conversation"],
    })
  }

  // Sales cycle
  let cycleDays: Figure
  let cycleRange: Normalized["cycleRange"] = null
  const rangeIn = input.deal.salesCycleDays
  const low = rangeIn ? nonNegative(rangeIn.low, "sales cycle", warnings) : null
  const high = rangeIn ? nonNegative(rangeIn.high, "sales cycle", warnings) : null
  const cycleOverride = nonNegative(input.assumptions?.salesCycleDays, "assumed sales cycle", warnings)
  if (low !== null && high !== null) {
    cycleRange = low <= high ? { low, high } : { low: high, high: low }
    const mid = (cycleRange.low + cycleRange.high) / 2
    cycleDays = given(
      mid,
      cycleRange.low === cycleRange.high
        ? `You told us it takes ${duration(mid)} to close a deal.`
        : `You said ${count(cycleRange.low)} to ${count(cycleRange.high)} days. We used the middle, ${count(mid)} days.`
    )
  } else if (cycleOverride !== null) {
    cycleDays = assumed(cycleOverride, `You set ${duration(cycleOverride)} as an estimate on the results page.`)
    assumptions.push({
      field: "salesCycleDays",
      label: "Sales cycle length",
      kind: "assumed",
      value: cycleOverride,
      note: `You don't track this yet. We're using your estimate of ${duration(cycleOverride)}. The timing results lean on it, so try a few values.`,
      unlocks: [],
    })
  } else {
    cycleDays = missing("Needs how long a deal takes from first contact to signed.")
    assumptions.push({
      field: "salesCycleDays",
      label: "Sales cycle length",
      kind: "missing",
      value: null,
      note: "This is the one that lines up spend with the revenue it caused. Without it, the timing results stay off. A guess is fine; we'll label it.",
      unlocks: ["your return once timing is accounted for", "the forecast", "your biggest lever"],
    })
  }

  // Spend
  const channelSpends = input.spend.channels.map((c) => nonNegative(c.monthlySpend, `spend on ${c.name || "a channel"}`, warnings))
  const knownChannelSpends = channelSpends.filter((s): s is number => s !== null)
  const channelSpendSum = knownChannelSpends.length ? knownChannelSpends.reduce((a, b) => a + b, 0) : null
  const totalIn = nonNegative(input.spend.totalMonthlySpend, "total monthly spend", warnings)

  let monthlySpend: Figure
  let unbrokenOutSpend: number | null = null
  if (totalIn !== null) {
    if (channelSpendSum !== null && channelSpendSum > totalIn) {
      monthlySpend = derived(
        channelSpendSum,
        `Your channels add up to ${money(channelSpendSum)} a month, more than the ${money(totalIn)} total you gave, so we used the channel total.`
      )
      warnings.push(
        `Your channels add up to ${money(channelSpendSum)} a month, which is more than your ${money(totalIn)} total. We used the larger number.`
      )
      unbrokenOutSpend = 0
    } else {
      monthlySpend = given(totalIn, `You told us you spend ${money(totalIn)} a month on marketing, all in.`)
      unbrokenOutSpend = channelSpendSum === null ? totalIn : totalIn - channelSpendSum
    }
  } else if (channelSpendSum !== null) {
    monthlySpend = derived(channelSpendSum, `We added up your channels: ${money(channelSpendSum)} a month.`)
    unbrokenOutSpend = 0
    assumptions.push({
      field: "totalMonthlySpend",
      label: "Total monthly marketing spend",
      kind: "derived",
      value: channelSpendSum,
      note: `You didn't give an all-in total, so we added up your channels: ${money(channelSpendSum)}. If you pay an agency, a person, or any tools outside those channels, the real number is higher and your return is lower than shown.`,
      unlocks: [],
    })
  } else {
    monthlySpend = missing("Needs your total monthly marketing spend, or spend by channel.")
    assumptions.push({
      field: "totalMonthlySpend",
      label: "Total monthly marketing spend",
      kind: "missing",
      value: null,
      note: "Nothing about return or cost works without it. Count ads, retainers, anyone's salary who does marketing, and tools.",
      unlocks: ["your return per dollar", "what a customer costs you", "the forecast"],
    })
  }

  // Spend trend
  let spendTrend: SpendTrend
  let spendThreeMonthsAgo: number | null = null
  const trendIn = input.spend.spendTrend
  const threeAgoIn = nonNegative(input.spend.spendThreeMonthsAgo, "spend three months ago", warnings)
  if (trendIn === "steady") {
    spendTrend = "steady"
    spendThreeMonthsAgo = monthlySpend.value
  } else if ((trendIn === "up" || trendIn === "down") && threeAgoIn !== null && monthlySpend.value !== null) {
    spendTrend = trendIn
    spendThreeMonthsAgo = threeAgoIn
    if ((trendIn === "up" && threeAgoIn > monthlySpend.value) || (trendIn === "down" && threeAgoIn < monthlySpend.value)) {
      warnings.push(
        `You said spend has gone ${trendIn}, but ${money(threeAgoIn)} three months ago versus ${money(monthlySpend.value)} now points the other way. We used the numbers.`
      )
      spendTrend = threeAgoIn > monthlySpend.value ? "down" : "up"
    }
  } else {
    spendTrend = "steady"
    spendThreeMonthsAgo = monthlySpend.value
    if (monthlySpend.value !== null) {
      assumptions.push({
        field: "spendTrend",
        label: "Whether your spend has been steady",
        kind: "assumed",
        value: null,
        note:
          trendIn === "up" || trendIn === "down"
            ? `You said spend has gone ${trendIn} but didn't say from what, so we treated it as steady at ${money(monthlySpend.value)}.`
            : `You didn't say, so we treated your spend as steady at ${money(monthlySpend.value)} a month. If it has moved, the timing result changes.`,
        unlocks: ["a more exact return once timing is accounted for"],
      })
    }
  }

  // Recurring revenue
  const revenueType = input.deal.revenueType ?? null
  const lifespanMonths = revenueType === "recurring" ? nonNegative(input.deal.customerLifespanMonths, "customer lifespan", warnings) : null
  let lifetimeValue: Figure
  if (revenueType === "recurring" && lifespanMonths !== null && dealSize.value !== null) {
    const years = Math.max(1, lifespanMonths / 12)
    const v = dealSize.value * years
    lifetimeValue = derived(
      v,
      lifespanMonths <= 12
        ? `A customer stays ${count(lifespanMonths)} months, which is within the first year, so the first-year figure is the whole story.`
        : `${money(dealSize.value)} in the first year times ${count(lifespanMonths)} months divided by 12 equals ${money(v)} over a typical customer's life.`
    )
  } else if (revenueType === "recurring" && dealSize.value !== null) {
    lifetimeValue = missing("Needs how many months a typical customer stays.")
    assumptions.push({
      field: "customerLifespanMonths",
      label: "How long a customer stays",
      kind: "missing",
      value: null,
      note: "You said customers keep paying but didn't say for how long, so we only show the first-year value of a deal.",
      unlocks: ["what a meeting is worth over a customer's whole life"],
    })
  } else {
    lifetimeValue = missing("Only applies when customers keep paying.")
  }

  return {
    dealSize,
    cycleDays,
    cycleRange,
    closeRate,
    monthlySpend,
    channelSpendSum,
    unbrokenOutSpend,
    dealsPerMonth,
    revenuePerMonth,
    meetingsPerMonth,
    spendTrend,
    spendThreeMonthsAgo,
    revenueType,
    lifespanMonths,
    lifetimeValue,
  }
}

// ---------------------------------------------------------------------------
// Spend history (weekly), for the lag model
// ---------------------------------------------------------------------------

/** Monthly run-rate of spend `weeksAgo` weeks before now (weeksAgo >= 0). */
function historicalMonthlySpend(n: Normalized, weeksAgo: number): number {
  const now = n.monthlySpend.value ?? 0
  const then = n.spendThreeMonthsAgo ?? now
  if (n.spendTrend === "steady" || weeksAgo <= 0) return now
  if (weeksAgo >= HISTORY_WEEKS) return then
  // Straight line from three months ago to now.
  return then + (now - then) * (1 - weeksAgo / HISTORY_WEEKS)
}

// ---------------------------------------------------------------------------
// 1. Return: naive vs lag-adjusted
// ---------------------------------------------------------------------------

function computeReturns(n: Normalized): ReturnResult {
  const spend = n.monthlySpend.value
  const revenue = n.revenuePerMonth.value
  const caveat =
    "This timing is an estimate built from the sales cycle you gave us, not from tracked deals. It's the right shape, not a measurement."

  const empty: ReturnResult = {
    available: false,
    naive: null,
    naiveHow: "",
    lagAdjusted: null,
    lagAdjustedHow: "",
    spendThatCausedRevenue: null,
    converge: false,
    explanation: "",
    lagWindowWeeks: null,
    caveat,
  }

  if (spend === null || revenue === null) {
    return {
      ...empty,
      reason:
        spend === null
          ? "Need your total monthly spend before this one works."
          : "Need your new revenue per month before this one works.",
    }
  }
  if (spend === 0) {
    return {
      ...empty,
      reason:
        revenue > 0
          ? `You spend nothing on marketing and bring in ${money(revenue)} a month, so there's no return to figure. Every dollar of that came from somewhere other than paid effort.`
          : "You spend nothing and bring in nothing new, so there's no return to figure yet.",
    }
  }

  const naive = revenue / spend
  const naiveHow = `${money(revenue)} of new revenue this month divided by ${money(spend)} spent this month equals ${perDollar(naive)} back for every dollar.`

  const cycle = n.cycleDays.value
  if (cycle === null) {
    return {
      ...empty,
      available: true,
      naive,
      naiveHow,
      reason: "Need your sales cycle length to line revenue up with the spend that caused it.",
      explanation: "Without a sales cycle length, we can only show the dashboard version.",
    }
  }

  const weights = lagWeights(cycle)
  let effectiveSpend = 0
  for (let k = 0; k < weights.length; k++) {
    effectiveSpend += weights[k] * historicalMonthlySpend(n, k)
  }
  const lagAdjusted = effectiveSpend > 0 ? revenue / effectiveSpend : null
  const window = lagWindow(cycle)

  const converge = lagAdjusted === null || Math.abs(lagAdjusted - naive) / naive < CONVERGE_TOLERANCE

  let explanation: string
  if (cycle < 30) {
    explanation = `Your deals close in ${duration(cycle)}, inside the same month, so the two numbers land in the same place. Timing isn't hiding anything from you.`
  } else if (n.spendTrend === "steady") {
    explanation = `They match because your spend has been steady. This month's revenue came from spend ${duration(cycle)} ago, and that spend was the same ${money(spend)}. The moment you change spend, these two split apart for ${duration(cycle)}.`
  } else if (lagAdjusted !== null) {
    explanation = `This month's revenue came from spend ${duration(cycle)} ago, when you were spending about ${money(effectiveSpend)} a month, not ${money(spend)}. So the real return on that money is ${perDollar(lagAdjusted)}, not ${perDollar(naive)}.`
  } else {
    explanation = "We couldn't line up the timing with the numbers given."
  }

  const lagAdjustedHow =
    lagAdjusted === null
      ? ""
      : `Spend ${duration(cycle)} ago turns into revenue now. Across the window where this month's deals started (${window.first} to ${window.last} weeks ago), your spend averaged ${money(effectiveSpend)} a month. ${money(revenue)} divided by ${money(effectiveSpend)} equals ${perDollar(lagAdjusted)} back for every dollar.`

  return {
    available: true,
    naive,
    naiveHow,
    lagAdjusted,
    lagAdjustedHow,
    spendThatCausedRevenue: effectiveSpend,
    converge,
    explanation,
    lagWindowWeeks: window,
    caveat,
  }
}

// ---------------------------------------------------------------------------
// 2. Cost per meeting, cost per deal
// ---------------------------------------------------------------------------

function computeCosts(input: PipelineInputs, n: Normalized, warnings: string[]): CostResult {
  const spend = n.monthlySpend.value
  const meetings = n.meetingsPerMonth.value
  const deals = n.dealsPerMonth.value

  const costPerMeeting = spend !== null && meetings !== null && meetings > 0 ? spend / meetings : null
  const costPerDeal = spend !== null && deals !== null && deals > 0 ? spend / deals : null

  const costPerMeetingHow =
    costPerMeeting !== null
      ? `${money(spend!)} a month, everything included, divided by ${count(meetings!)} qualified conversations a month equals ${money(costPerMeeting)} per conversation.`
      : spend === null
        ? "Need your total monthly spend."
        : meetings === null
          ? "Need your qualified conversations per month."
          : "You have spend but no conversations, so there's nothing to divide by."

  const costPerDealHow =
    costPerDeal !== null
      ? `${money(spend!)} a month, everything included, divided by ${count(deals!)} deals a month equals ${money(costPerDeal)} per customer.`
      : spend === null
        ? "Need your total monthly spend."
        : deals === null
          ? "Need your deals per month."
          : `You spend ${money(spend)} a month and closed no deals, so there's no cost per deal to show yet.`

  const channels: CostRow[] = input.spend.channels.map((c) => {
    const cs = nonNegative(c.monthlySpend, `spend on ${c.name || "a channel"}`, [])
    const cl = nonNegative(c.leadsPerMonth, "leads", [])
    const cd = nonNegative(c.dealsPerMonth, "deals", [])
    let cpm: number | null = null
    let cpmNote: string | null = null
    let cpd: number | null = null
    let cpdNote: string | null = null
    if (cs === null) {
      cpmNote = "no spend entered"
      cpdNote = "no spend entered"
    } else {
      if (cl === null) cpmNote = "leads not entered"
      else if (cl === 0) cpmNote = "unknown, no leads traced to this channel"
      else cpm = cs / cl
      if (cd === null) cpdNote = "deals not entered"
      else if (cd === 0) cpdNote = "unknown, no deals traced to this channel"
      else cpd = cs / cd
    }
    return {
      channelId: c.id,
      name: c.name || "Unnamed channel",
      spend: cs,
      leads: cl,
      deals: cd,
      costPerMeeting: cpm,
      costPerMeetingNote: cpmNote,
      costPerDeal: cpd,
      costPerDealNote: cpdNote,
    }
  })

  void warnings
  return {
    blended: {
      spend,
      meetings,
      deals,
      costPerMeeting,
      costPerMeetingHow,
      costPerDeal,
      costPerDealHow,
    },
    channels,
    includesUnbrokenOut: (n.unbrokenOutSpend ?? 0) > 0,
    unbrokenOutSpend: n.unbrokenOutSpend,
  }
}

// ---------------------------------------------------------------------------
// 3. Where your sales came from (attribution)
// ---------------------------------------------------------------------------

function computeAttribution(input: PipelineInputs, n: Normalized): AttributionResult {
  const totalDeals = n.dealsPerMonth.value
  const withData = input.spend.channels.filter((c) => num(c.dealsPerMonth) !== null && (c.dealsPerMonth as number) >= 0)
  const without = input.spend.channels.filter((c) => num(c.dealsPerMonth) === null).map((c) => c.name || "Unnamed channel")
  const traced = withData.reduce((s, c) => s + (c.dealsPerMonth as number), 0)

  const base: AttributionResult = {
    available: false,
    totalDeals,
    tracedDeals: traced,
    untracedDeals: 0,
    untracedShare: null,
    untracedRevenue: null,
    channelsWithoutDealData: without,
    overReported: false,
    overReportedBy: 0,
    reconciles: false,
    summary: "",
    how: "",
  }

  if (totalDeals === null) {
    return { ...base, reason: "Need the number of deals you close before this one works." }
  }
  if (totalDeals === 0) {
    return {
      ...base,
      available: true,
      reconciles: traced === 0,
      overReported: traced > 0,
      overReportedBy: traced,
      summary:
        traced > 0
          ? `You said you closed no deals, but your channels list ${count(traced)}. One of those two numbers is off.`
          : "You closed no deals in this period, so there's nothing to trace yet.",
      how: "Nothing to divide.",
    }
  }

  const dealSize = n.dealSize.value
  const periodWord = input.results.period === "quarter" ? "an average month this quarter" : "last month"

  if (traced > totalDeals + 1e-9) {
    const over = traced - totalDeals
    return {
      ...base,
      available: true,
      overReported: true,
      overReportedBy: over,
      untracedDeals: 0,
      untracedShare: 0,
      untracedRevenue: 0,
      summary: `Your channels add up to ${count(traced)} deals, but you closed ${count(totalDeals)}. That's ${count(over)} more than you closed, which usually means a deal got counted under two channels. Worth a look before trusting any per-channel number.`,
      how: `${count(traced)} deals across your channels minus ${count(totalDeals)} deals closed equals ${count(over)} extra.`,
    }
  }

  const untraced = totalDeals - traced
  const share = untraced / totalDeals
  const untracedRevenue = dealSize !== null ? untraced * dealSize : null

  if (untraced < 0.5 && without.length === 0) {
    return {
      ...base,
      available: true,
      reconciles: true,
      untracedDeals: 0,
      untracedShare: 0,
      untracedRevenue: 0,
      summary: `Every one of the ${count(totalDeals)} deals you closed ${periodWord} is traced to a channel you listed. That's rare, and it means you can repeat what's working on purpose.`,
      how: `${count(traced)} deals across your channels equals ${count(totalDeals)} deals closed. Nothing left over.`,
    }
  }

  let summary: string
  if (withData.length === 0) {
    summary = `You closed ${count(totalDeals)} deals ${periodWord}, and none of them are traced to a channel, because no channel has a deal count.${
      untracedRevenue !== null ? ` At your average deal size that's ${money(untracedRevenue)} a month you can't repeat on purpose.` : ""
    }`
  } else {
    summary = `Of the ${count(totalDeals)} deals you closed ${periodWord}, ${count(untraced)} ${plural(untraced, "isn't", "aren't")} traced to any channel you listed.${
      untracedRevenue !== null ? ` At your average deal size that's ${money(untracedRevenue)} in revenue you can't repeat on purpose.` : ""
    }`
  }

  const how = `${count(totalDeals)} deals closed minus ${count(traced)} deals traced to a channel equals ${count(untraced)} untraced. ${count(untraced)} divided by ${count(totalDeals)} is ${percent(share)}.${
    untracedRevenue !== null ? ` ${count(untraced)} times ${money(dealSize!)} per deal equals ${money(untracedRevenue)}.` : ""
  }`

  return {
    ...base,
    available: true,
    untracedDeals: untraced,
    untracedShare: share,
    untracedRevenue,
    reconciles: false,
    summary,
    how,
  }
}

// ---------------------------------------------------------------------------
// 4. What one qualified meeting is worth
// ---------------------------------------------------------------------------

export function meetingValueAt(dealSize: number, closeRate: number): number {
  return dealSize * closeRate
}

function computeMeetingValue(n: Normalized): MeetingValueResult {
  const dealSize = n.dealSize.value
  const base: MeetingValueResult = {
    available: false,
    dealSize,
    closeRate: n.closeRate.value,
    closeRateSource: n.closeRate.source,
    value: null,
    how: "",
    atRates: [],
    lifetime: null,
  }
  if (dealSize === null) {
    return { ...base, reason: "Need the deal size before this one works." }
  }
  const atRates = REFERENCE_RATES.map((r) => ({ rate: r, value: meetingValueAt(dealSize, r) }))
  const lifetime =
    n.lifetimeValue.value !== null && n.closeRate.value !== null
      ? {
          value: n.lifetimeValue.value * n.closeRate.value,
          how: `${money(n.lifetimeValue.value)} over a customer's life times a ${percent(n.closeRate.value)} close rate equals ${money(n.lifetimeValue.value * n.closeRate.value)}.`,
        }
      : null

  if (n.closeRate.value === null) {
    return {
      ...base,
      available: true,
      atRates,
      how: `${money(dealSize)} per deal times your close rate. You don't track your close rate yet, so pick one to see the number.`,
    }
  }
  const value = meetingValueAt(dealSize, n.closeRate.value)
  return {
    ...base,
    available: true,
    value,
    atRates,
    lifetime,
    how: `${money(dealSize)} per deal times a ${percent(n.closeRate.value)} close rate equals ${money(value)}. That's what one qualified conversation is worth to you before it's had, on average.`,
  }
}

// ---------------------------------------------------------------------------
// 5. The one lever
// ---------------------------------------------------------------------------

function computeLever(input: PipelineInputs, n: Normalized): LeverResult {
  const horizonDays = input.forecast.horizonDays
  const revenue = n.revenuePerMonth.value
  const cycle = n.cycleDays.value
  const base: LeverResult = { available: false, horizonDays, levers: [], top: [], interpretation: "" }

  if (revenue === null) return { ...base, reason: "Need your new revenue per month before this one works." }
  if (revenue === 0) return { ...base, reason: "You have no new revenue yet, so a 10% change is still nothing. Come back once deals are closing." }
  if (cycle === null) return { ...base, reason: "Need your sales cycle length before this one works." }

  const weeks = Math.round(horizonDays / 7)
  const weeklyRevenue = revenue / WEEKS_PER_MONTH
  const cum = cumulativeLag(lagWeights(cycle))
  // Extra leads starting now only pay off once their deals close.
  let leadFactor = 0
  for (let t = 1; t <= weeks; t++) {
    const idx = t - 1
    leadFactor += idx < cum.length ? cum[idx] : 1
  }
  const leadsExtra = 0.1 * weeklyRevenue * leadFactor
  // Better closing or bigger deals apply to everything that closes in the window.
  let closeExtra = 0.1 * weeklyRevenue * weeks
  const dealSizeExtra = 0.1 * weeklyRevenue * weeks
  let closeNote = ""
  if (n.closeRate.value !== null && n.closeRate.value * 1.1 > 1) {
    const capped = (1 / n.closeRate.value - 1)
    closeExtra = capped * weeklyRevenue * weeks
    closeNote = ` Your close rate is already ${percent(n.closeRate.value)}, so it can only rise to 100%.`
  }

  const levers: LeverResult["levers"] = [
    {
      key: "leads",
      label: "10% more qualified conversations",
      extraRevenue: leadsExtra,
      how: `10% more conversations means 10% more deals, but only once they close, ${duration(cycle)} later. Over ${horizonDays} days, that's ${money(leadsExtra)} extra, because the new deals only start landing ${weekLabel(Math.max(1, cum.findIndex((c) => c > 0.05) + 1))}.`,
    },
    {
      key: "closeRate",
      label: "10% higher close rate",
      extraRevenue: closeExtra,
      how: `Closing 10% more of the conversations you already have adds 10% to every week's revenue, starting now. ${money(revenue)} a month times 10% over ${horizonDays} days equals ${money(closeExtra)}.${closeNote}`,
    },
    {
      key: "dealSize",
      label: "10% bigger average deal",
      extraRevenue: dealSizeExtra,
      how: `Deals 10% bigger add 10% to every week's revenue, starting now. ${money(revenue)} a month times 10% over ${horizonDays} days equals ${money(dealSizeExtra)}.`,
    },
  ]

  const max = Math.max(...levers.map((l) => l.extraRevenue))
  const top = levers.filter((l) => Math.abs(l.extraRevenue - max) / Math.max(1, max) < 0.05).map((l) => l.key)

  let interpretation: string
  const labels: Record<LeverKey, string> = {
    leads: "more conversations",
    closeRate: "a higher close rate",
    dealSize: "bigger deals",
  }
  if (top.length === 3) {
    interpretation = `Over ${horizonDays} days, all three changes are worth about the same to you, ${money(max)}, because your deals close fast enough that new conversations turn into money within the window.`
  } else if (top.length === 2) {
    const [a, b] = top
    const other = levers.find((l) => !top.includes(l.key))!
    interpretation = `Over ${horizonDays} days, ${labels[a]} and ${labels[b]} are worth the same to you, ${money(max)} each. ${
      other.key === "leads"
        ? `More conversations are worth less in that window, ${money(other.extraRevenue)}, because new deals take ${duration(cycle)} to close.`
        : `${capitalize(labels[other.key])} is worth less, ${money(other.extraRevenue)}.`
    }`
  } else {
    const t = levers.find((l) => l.key === top[0])!
    interpretation = `Over ${horizonDays} days, ${labels[t.key]} moves your revenue the most: ${money(t.extraRevenue)}.`
  }

  return { available: true, horizonDays, levers, top, interpretation }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ---------------------------------------------------------------------------
// 6. The forecast
// ---------------------------------------------------------------------------

function computeForecast(input: PipelineInputs, n: Normalized, returns: ReturnResult, warnings: string[]): ForecastResult {
  const horizonDays = input.forecast.horizonDays
  const horizonWeeks = Math.round(horizonDays / 7)
  const change = input.forecast.change
  const amountIn = change === "hold" ? 0 : nonNegative(input.forecast.changeAmountPerMonth, "spend change", warnings)
  const assumptionsText = [
    "This assumes new money performs like your current money. It often doesn't, in either direction.",
    "It also assumes your close rate and deal size hold for the whole window.",
  ]
  const base: ForecastResult = {
    available: false,
    change,
    changeAmountPerMonth: amountIn ?? 0,
    horizonDays,
    horizonWeeks,
    points: [],
    crossoverWeek: null,
    crossoverLabel: "",
    firstRevenueWeek: null,
    halfRevenueWeek: null,
    totals: { spend: 0, revenue: 0, changeSpend: 0, changeRevenue: 0, holdRevenue: 0 },
    summary: "",
    assumptions: assumptionsText,
  }

  const spend = n.monthlySpend.value
  const cycle = n.cycleDays.value
  const R = returns.lagAdjusted ?? returns.naive
  if (spend === null) return { ...base, reason: "Need your total monthly spend before this one works." }
  if (n.revenuePerMonth.value === null) return { ...base, reason: "Need your new revenue per month before this one works." }
  if (cycle === null) return { ...base, reason: "Need your sales cycle length before this one works. It's what puts the lag on the chart." }
  if (R === null) return { ...base, reason: "Need a return per dollar to project from, which needs spend and revenue." }
  if (change !== "hold" && amountIn === null) return { ...base, reason: "Need how much per month you'd change spend by." }
  if (change === "down" && amountIn !== null && amountIn > spend) {
    warnings.push(`You can't cut ${money(amountIn)} from ${money(spend)} of spend, so we cut it to zero instead.`)
  }

  const amount = change === "hold" ? 0 : Math.min(amountIn ?? 0, change === "down" ? spend : Infinity)
  const sign = change === "up" ? 1 : change === "down" ? -1 : 0
  const weeklyDelta = (sign * amount) / WEEKS_PER_MONTH
  const weights = lagWeights(cycle)
  const cum = cumulativeLag(weights)

  const weeklySpendAt = (t: number, withChange: boolean) => {
    if (t <= 0) return historicalMonthlySpend(n, -t) / WEEKS_PER_MONTH
    return spend / WEEKS_PER_MONTH + (withChange ? weeklyDelta : 0)
  }

  const points: ForecastPoint[] = []
  let cumSpend = 0
  let cumRevenue = 0
  let cumHoldSpend = 0
  let cumHoldRevenue = 0
  for (let t = 1; t <= horizonWeeks; t++) {
    const s = weeklySpendAt(t, true)
    const r = revenueAtWeek(t, R, weights, (w) => weeklySpendAt(w, true))
    const hs = weeklySpendAt(t, false)
    const hr = revenueAtWeek(t, R, weights, (w) => weeklySpendAt(w, false))
    cumSpend += s
    cumRevenue += r
    cumHoldSpend += hs
    cumHoldRevenue += hr
    points.push({
      week: t,
      spend: s,
      revenue: r,
      cumulativeSpend: cumSpend,
      cumulativeRevenue: cumRevenue,
      cumulativeChangeSpend: Math.abs(cumSpend - cumHoldSpend),
      cumulativeChangeRevenue: Math.abs(cumRevenue - cumHoldRevenue),
    })
  }

  const totals = {
    spend: cumSpend,
    revenue: cumRevenue,
    changeSpend: Math.abs(cumSpend - cumHoldSpend),
    changeRevenue: Math.abs(cumRevenue - cumHoldRevenue),
    holdRevenue: cumHoldRevenue,
  }

  const firstIdx = cum.findIndex((c) => c > 0.05)
  const halfIdx = weekWhenShareLanded(weights, 0.5)
  const firstRevenueWeek = firstIdx < 0 ? null : firstIdx + 1
  const halfRevenueWeek = halfIdx === null ? null : halfIdx + 1

  let crossoverWeek: number | null = null
  let crossoverLabel = ""
  let summary = ""

  if (change === "hold") {
    crossoverWeek = points.find((p) => p.cumulativeRevenue >= p.cumulativeSpend)?.week ?? null
    crossoverLabel =
      crossoverWeek === null
        ? `Over ${horizonDays} days you'd spend more than you bring in.`
        : crossoverWeek === 1
          ? "You're ahead from the first week, because past spend is still paying out."
          : `Revenue passes spend at ${weekLabel(crossoverWeek)}.`
    summary = `Holding at ${money(spend)} a month for ${horizonDays} days: about ${money(cumSpend)} out and ${money(cumRevenue)} in, if your rates hold.${
      n.spendTrend !== "steady"
        ? ` Because your spend has been ${n.spendTrend === "up" ? "rising" : "falling"}, revenue keeps ${n.spendTrend === "up" ? "climbing" : "sliding"} for ${duration(cycle)} before it settles.`
        : ""
    }`
  } else if (change === "up") {
    crossoverWeek = points.find((p) => p.cumulativeChangeRevenue >= p.cumulativeChangeSpend && p.cumulativeChangeSpend > 0)?.week ?? null
    if (amount === 0) {
      crossoverLabel = "No change entered, so nothing to cross."
      summary = `You entered a change of $0, so this is the same as holding.`
    } else if (crossoverWeek === null) {
      crossoverLabel =
        R < 1
          ? `At ${perDollar(R)} back per dollar, added money never pays back.`
          : `The added money hasn't paid for itself by day ${horizonDays}.${firstRevenueWeek !== null && firstRevenueWeek <= horizonWeeks ? ` Its first revenue lands around ${weekLabel(firstRevenueWeek)}.` : " Its first revenue lands after this window ends."}`
      summary = `Adding ${money(amount)} a month for ${horizonDays} days puts ${money(totals.changeSpend)} extra out and brings ${money(totals.changeRevenue)} extra in within the window. That's underwater by ${money(totals.changeSpend - totals.changeRevenue)} at day ${horizonDays}, mostly because of timing: the rest of the return lands after the window ends.`
    } else {
      crossoverLabel = `The added money pays for itself at ${weekLabel(crossoverWeek)}.`
      summary = `Adding ${money(amount)} a month for ${horizonDays} days puts ${money(totals.changeSpend)} extra out and brings ${money(totals.changeRevenue)} extra in, if the new money performs like the old. It goes out first and comes back at ${weekLabel(crossoverWeek)}.`
    }
  } else {
    // down: savings first, lost revenue later
    crossoverWeek = points.find((p) => p.cumulativeChangeRevenue >= p.cumulativeChangeSpend && p.cumulativeChangeSpend > 0)?.week ?? null
    if (amount === 0) {
      crossoverLabel = "No change entered, so nothing to cross."
      summary = `You entered a change of $0, so this is the same as holding.`
    } else if (crossoverWeek === null) {
      crossoverLabel =
        R < 1
          ? `At ${perDollar(R)} back per dollar, the cut saves more than it costs.`
          : `Within ${horizonDays} days, you save more than you lose. The lost revenue mostly lands after the window ends.`
      summary = `Cutting ${money(amount)} a month for ${horizonDays} days saves ${money(totals.changeSpend)} and costs ${money(totals.changeRevenue)} in revenue within the window. It looks like a win at day ${horizonDays}${R >= 1 ? ", because the revenue you'd lose hasn't stopped arriving yet" : ""}.`
    } else {
      crossoverLabel = `By ${weekLabel(crossoverWeek)}, you've lost more revenue than you saved.`
      summary = `Cutting ${money(amount)} a month for ${horizonDays} days saves ${money(totals.changeSpend)} and costs ${money(totals.changeRevenue)} in revenue. The savings show up first. The lost revenue catches up at ${weekLabel(crossoverWeek)}, which is why a cut looks smart on a dashboard for ${duration(cycle)}.`
    }
  }

  return {
    available: true,
    change,
    changeAmountPerMonth: amount,
    horizonDays,
    horizonWeeks,
    points,
    crossoverWeek,
    crossoverLabel,
    firstRevenueWeek,
    halfRevenueWeek,
    totals,
    summary,
    assumptions: assumptionsText,
  }
}

// ---------------------------------------------------------------------------
// Headline
// ---------------------------------------------------------------------------

function buildHeadline(n: Normalized, returns: ReturnResult, attribution: AttributionResult, assumptions: Assumption[]): string {
  const r = returns.lagAdjusted ?? returns.naive
  const parts: string[] = []
  if (returns.available && r !== null) {
    parts.push(`Your marketing returned ${perDollar(r)} for every dollar`)
  }
  if (attribution.available && attribution.untracedShare !== null && attribution.untracedShare > 0 && !attribution.overReported) {
    const share = percent(attribution.untracedShare)
    parts.push(parts.length ? `but you can't trace where ${share} of your deals came from` : `You can't trace where ${share} of your deals came from`)
  } else if (attribution.available && attribution.reconciles && parts.length) {
    parts.push("and every deal you closed is traced to a source")
  } else if (attribution.available && attribution.overReported && parts.length) {
    parts.push("but your channels claim more deals than you closed")
  }
  if (parts.length) return `${parts.join(", ")}.`

  const missingCount = assumptions.filter((a) => a.kind === "missing").length
  if (missingCount > 0) {
    return `There are ${numberWord(missingCount)} ${plural(missingCount, "number")} you don't track yet, and ${missingCount === 1 ? "it's" : "they're"} the ${plural(missingCount, "one")} that would tell you what your marketing returns.`
  }
  return "Here's what your numbers say."
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function computePipeline(input: PipelineInputs): PipelineResult {
  const warnings: string[] = []
  const assumptions: Assumption[] = []
  const normalized = normalize(input, warnings, assumptions)
  const returns = computeReturns(normalized)
  const costs = computeCosts(input, normalized, warnings)
  const attribution = computeAttribution(input, normalized)
  const meetingValue = computeMeetingValue(normalized)
  const lever = computeLever(input, normalized)
  const forecast = computeForecast(input, normalized, returns, warnings)
  const headline = buildHeadline(normalized, returns, attribution, assumptions)

  return {
    headline,
    assumptions,
    normalized,
    returns,
    costs,
    attribution,
    meetingValue,
    lever,
    forecast,
    warnings: Array.from(new Set(warnings)),
  }
}
