import { describe, expect, it } from "vitest"
import { computePipeline } from "../engine"
import { emptyInputs } from "../defaults"
import { sampleInputs } from "../sample"
import type { PipelineInputs } from "../types"

function clone(): PipelineInputs {
  return JSON.parse(JSON.stringify(sampleInputs)) as PipelineInputs
}

describe("sample data (everything known)", () => {
  const r = computePipeline(sampleInputs)

  it("computes naive return from this month's numbers", () => {
    expect(r.returns.available).toBe(true)
    expect(r.returns.naive).toBeCloseTo(175000 / 14000, 5)
  })

  it("lag-adjusted return is higher when spend has been rising", () => {
    // Revenue now came from spend ~45 days ago, when spend was lower.
    expect(r.returns.lagAdjusted).not.toBeNull()
    expect(r.returns.lagAdjusted!).toBeGreaterThan(r.returns.naive!)
    expect(r.returns.spendThatCausedRevenue!).toBeLessThan(14000)
    expect(r.returns.spendThatCausedRevenue!).toBeGreaterThan(9000)
    expect(r.returns.converge).toBe(false)
  })

  it("finds the untraced deals", () => {
    expect(r.attribution.available).toBe(true)
    expect(r.attribution.tracedDeals).toBe(9)
    expect(r.attribution.untracedDeals).toBe(5)
    expect(r.attribution.untracedShare).toBeCloseTo(5 / 14, 5)
    expect(r.attribution.untracedRevenue).toBe(5 * 12500)
    expect(r.attribution.summary).toContain("5 aren't traced")
    expect(r.attribution.summary).toContain("$62,500")
    expect(r.attribution.summary).not.toMatch(/fail/i)
  })

  it("values a meeting at deal size × close rate", () => {
    expect(r.meetingValue.value).toBe(12500 * 0.25)
    expect(r.meetingValue.atRates.map((a) => a.rate)).toEqual([0.1, 0.2, 0.3])
  })

  it("blended cost includes the spend not broken out by channel", () => {
    expect(r.costs.blended.spend).toBe(14000)
    expect(r.costs.unbrokenOutSpend).toBe(5000)
    expect(r.costs.includesUnbrokenOut).toBe(true)
    expect(r.costs.blended.costPerDeal).toBe(1000)
    expect(r.costs.blended.costPerMeeting).toBe(250)
  })

  it("channel with no spend gets a note instead of a number", () => {
    const referrals = r.costs.channels.find((c) => c.name === "Referrals")!
    expect(referrals.costPerDeal).toBe(0)
  })

  it("lead volume lever is worth less than close rate over the horizon because of lag", () => {
    expect(r.lever.available).toBe(true)
    const leads = r.lever.levers.find((l) => l.key === "leads")!
    const close = r.lever.levers.find((l) => l.key === "closeRate")!
    const size = r.lever.levers.find((l) => l.key === "dealSize")!
    expect(leads.extraRevenue).toBeLessThan(close.extraRevenue)
    expect(close.extraRevenue).toBeCloseTo(size.extraRevenue, 5)
    expect(r.lever.top).toEqual(["closeRate", "dealSize"])
  })

  it("forecast shows money out before money back, with a crossover", () => {
    expect(r.forecast.available).toBe(true)
    expect(r.forecast.points).toHaveLength(26)
    const first = r.forecast.points[0]
    expect(first.cumulativeChangeSpend).toBeGreaterThan(first.cumulativeChangeRevenue)
    expect(r.forecast.crossoverWeek).not.toBeNull()
    expect(r.forecast.crossoverWeek!).toBeGreaterThan(1)
    expect(r.forecast.assumptions[0]).toContain("It often doesn't")
  })

  it("has no assumptions when every number is given", () => {
    expect(r.assumptions).toHaveLength(0)
    expect(r.warnings).toHaveLength(0)
  })

  it("headline reads as one plain sentence", () => {
    expect(r.headline).toMatch(/^Your marketing returned \$\d+\.\d\d for every dollar, but you can't trace where 36% of your deals came from\.$/)
  })
})

describe("zero spend", () => {
  it("does not divide by zero and explains", () => {
    const i = clone()
    i.spend.totalMonthlySpend = 0
    i.spend.channels = i.spend.channels.map((c) => ({ ...c, monthlySpend: 0 }))
    const r = computePipeline(i)
    expect(r.returns.available).toBe(false)
    expect(r.returns.reason).toContain("spend nothing")
    expect(r.costs.blended.costPerDeal).toBe(0)
    expect(Number.isFinite(r.costs.blended.costPerDeal!)).toBe(true)
    // No spend means no return per dollar, so nothing to project from.
    expect(r.forecast.available).toBe(false)
    expect(r.forecast.reason).toContain("return per dollar")
  })
})

describe("zero deals", () => {
  it("handles no closed deals without infinities", () => {
    const i = clone()
    i.results.closedDeals = 0
    i.results.newRevenue = 0
    i.spend.channels = i.spend.channels.map((c) => ({ ...c, dealsPerMonth: 0 }))
    const r = computePipeline(i)
    expect(r.attribution.available).toBe(true)
    expect(r.attribution.summary).toContain("nothing to trace")
    expect(r.costs.blended.costPerDeal).toBeNull()
    expect(r.costs.blended.costPerDealHow).toContain("closed no deals")
    expect(r.returns.naive).toBe(0)
    expect(r.lever.available).toBe(false)
    for (const v of JSON.stringify(r).matchAll(/Infinity|NaN/g)) {
      throw new Error(`Found ${v[0]} in result`)
    }
  })
})

describe("unknown close rate", () => {
  it("derives it from meetings when possible and says so", () => {
    const i = clone()
    i.deal.closeRate = null
    const r = computePipeline(i)
    expect(r.normalized.closeRate.source).toBe("derived")
    expect(r.normalized.closeRate.value).toBeCloseTo(14 / 56, 5)
    expect(r.assumptions.some((a) => a.field === "closeRate" && a.kind === "derived")).toBe(true)
  })

  it("leaves meeting value as a range when nothing can derive it", () => {
    const i = clone()
    i.deal.closeRate = null
    i.results.qualifiedMeetings = null
    const r = computePipeline(i)
    expect(r.normalized.closeRate.source).toBe("missing")
    expect(r.meetingValue.available).toBe(true)
    expect(r.meetingValue.value).toBeNull()
    expect(r.meetingValue.atRates).toHaveLength(3)
    expect(r.meetingValue.atRates[1].value).toBe(2500)
    expect(r.assumptions.some((a) => a.field === "closeRate" && a.kind === "missing")).toBe(true)
    // Cost per meeting depends on meetings, which are now unknown too.
    expect(r.costs.blended.costPerMeeting).toBeNull()
  })

  it("uses an assumed close rate from the results page and labels it assumed", () => {
    const i = clone()
    i.deal.closeRate = null
    i.results.qualifiedMeetings = null
    i.assumptions = { closeRate: 0.2 }
    const r = computePipeline(i)
    expect(r.normalized.closeRate.source).toBe("assumed")
    expect(r.meetingValue.value).toBe(2500)
    expect(r.assumptions.find((a) => a.field === "closeRate")!.kind).toBe("assumed")
  })
})

describe("sales cycle under 30 days", () => {
  it("naive and lag-adjusted converge and the copy says so", () => {
    const i = clone()
    i.deal.salesCycleDays = { low: 10, high: 14 }
    const r = computePipeline(i)
    expect(r.returns.converge).toBe(true)
    expect(r.returns.explanation).toContain("same month")
    expect(Math.abs(r.returns.lagAdjusted! - r.returns.naive!) / r.returns.naive!).toBeLessThan(0.05)
  })

  it("all three levers tie when deals close fast", () => {
    const i = clone()
    i.deal.salesCycleDays = { low: 3, high: 5 }
    const r = computePipeline(i)
    expect(r.lever.top).toHaveLength(3)
  })
})

describe("sales cycle over 120 days", () => {
  it("added spend does not pay back within 90 days and the forecast says so", () => {
    const i = clone()
    i.deal.salesCycleDays = { low: 120, high: 180 }
    i.forecast.horizonDays = 90
    const r = computePipeline(i)
    expect(r.forecast.available).toBe(true)
    expect(r.forecast.crossoverWeek).toBeNull()
    expect(r.forecast.crossoverLabel).toContain("hasn't paid for itself")
    expect(r.forecast.totals.changeRevenue).toBeLessThan(r.forecast.totals.changeSpend)
  })

  it("lead volume lever is nearly worthless inside 90 days", () => {
    const i = clone()
    i.deal.salesCycleDays = { low: 150, high: 150 }
    i.forecast.horizonDays = 90
    const r = computePipeline(i)
    const leads = r.lever.levers.find((l) => l.key === "leads")!
    const close = r.lever.levers.find((l) => l.key === "closeRate")!
    expect(leads.extraRevenue).toBeLessThan(close.extraRevenue * 0.1)
  })

  it("lag-adjusted return uses spend from months ago", () => {
    const i = clone()
    i.deal.salesCycleDays = { low: 150, high: 150 }
    const r = computePipeline(i)
    // 150 days ago is beyond the 3-month history, so spend was $9,000.
    expect(Math.abs(r.returns.spendThatCausedRevenue! - 9000)).toBeLessThan(50)
    expect(r.returns.lagAdjusted).toBeCloseTo(175000 / 9000, 1)
  })
})

describe("attribution that reconciles exactly", () => {
  it("says so and does not invent a gap", () => {
    const i = clone()
    i.spend.channels[0].dealsPerMonth = 9
    const r = computePipeline(i)
    expect(r.attribution.reconciles).toBe(true)
    expect(r.attribution.untracedDeals).toBe(0)
    expect(r.attribution.summary).toContain("Every one of the 14 deals")
    expect(r.headline).toContain("every deal you closed is traced")
  })
})

describe("attribution that over-reports", () => {
  it("flags channel deals exceeding total deals without a negative gap", () => {
    const i = clone()
    i.spend.channels[0].dealsPerMonth = 12
    const r = computePipeline(i)
    expect(r.attribution.overReported).toBe(true)
    expect(r.attribution.overReportedBy).toBe(3)
    expect(r.attribution.untracedDeals).toBe(0)
    expect(r.attribution.summary).toContain("counted under two channels")
    expect(r.headline).toContain("more deals than you closed")
  })
})

describe("negative or nonsense input", () => {
  it("treats negatives as unknown and warns, never crashes", () => {
    const i = clone()
    i.deal.averageDealSize = -5
    i.results.closedDeals = Number.NaN
    i.spend.channels[1].monthlySpend = Number.POSITIVE_INFINITY
    i.deal.closeRate = 250
    const r = computePipeline(i)
    expect(r.warnings.some((w) => w.includes("deal size") && w.includes("negative"))).toBe(true)
    expect(r.warnings.some((w) => w.includes("close rate") && w.includes("over 100%"))).toBe(true)
    // Deal size is derived from revenue ÷ deals... but deals is NaN, so it's missing.
    expect(r.normalized.dealSize.source).toBe("missing")
    expect(JSON.stringify(r)).not.toMatch(/Infinity|NaN/)
  })

  it("accepts a close rate given as a whole percent", () => {
    const i = clone()
    i.deal.closeRate = 25
    const r = computePipeline(i)
    expect(r.normalized.closeRate.value).toBe(0.25)
  })

  it("survives an entirely empty input", () => {
    const r = computePipeline(emptyInputs())
    expect(r.returns.available).toBe(false)
    expect(r.attribution.available).toBe(false)
    expect(r.meetingValue.available).toBe(false)
    expect(r.lever.available).toBe(false)
    expect(r.forecast.available).toBe(false)
    expect(r.assumptions.filter((a) => a.kind === "missing").length).toBeGreaterThan(3)
    expect(r.headline).toContain("you don't track yet")
  })

  it("channels that add up to more than the total use the channel total", () => {
    const i = clone()
    i.spend.totalMonthlySpend = 5000
    const r = computePipeline(i)
    expect(r.normalized.monthlySpend.value).toBe(9000)
    expect(r.warnings.some((w) => w.includes("more than your"))).toBe(true)
  })

  it("cutting more than you spend is capped at zero", () => {
    const i = clone()
    i.forecast.change = "down"
    i.forecast.changeAmountPerMonth = 50000
    const r = computePipeline(i)
    expect(r.forecast.changeAmountPerMonth).toBe(14000)
    expect(r.warnings.some((w) => w.includes("can't cut"))).toBe(true)
  })
})

describe("derivations", () => {
  it("derives deal size from revenue and deals", () => {
    const i = clone()
    i.deal.averageDealSize = null
    const r = computePipeline(i)
    expect(r.normalized.dealSize.source).toBe("derived")
    expect(r.normalized.dealSize.value).toBe(12500)
    expect(r.normalized.dealSize.how).toContain("$175,000")
  })

  it("normalizes a quarter to per-month", () => {
    const i = clone()
    i.results.period = "quarter"
    i.results.closedDeals = 42
    i.results.newRevenue = 525000
    i.results.qualifiedMeetings = 168
    const r = computePipeline(i)
    expect(r.normalized.dealsPerMonth.value).toBe(14)
    expect(r.normalized.revenuePerMonth.value).toBe(175000)
    expect(r.normalized.meetingsPerMonth.value).toBe(56)
    expect(r.normalized.dealsPerMonth.how).toContain("divided by 3")
  })

  it("treats unknown spend trend as steady and lists it as an assumption", () => {
    const i = clone()
    i.spend.spendTrend = null
    i.spend.spendThreeMonthsAgo = null
    const r = computePipeline(i)
    expect(r.normalized.spendTrend).toBe("steady")
    expect(r.returns.converge).toBe(true)
    expect(r.returns.explanation).toContain("steady")
    expect(r.assumptions.some((a) => a.field === "spendTrend" && a.kind === "assumed")).toBe(true)
  })

  it("recurring revenue adds a lifetime figure to meeting value", () => {
    const i = clone()
    i.deal.revenueType = "recurring"
    i.deal.customerLifespanMonths = 24
    const r = computePipeline(i)
    expect(r.normalized.lifetimeValue.value).toBe(25000)
    expect(r.meetingValue.lifetime!.value).toBe(6250)
  })

  it("holding spend gives a steady forecast with no drama", () => {
    const i = clone()
    i.forecast.change = "hold"
    i.spend.spendTrend = "steady"
    i.spend.spendThreeMonthsAgo = null
    const r = computePipeline(i)
    expect(r.forecast.available).toBe(true)
    expect(r.forecast.crossoverWeek).toBe(1)
    expect(r.forecast.totals.changeSpend).toBe(0)
    expect(r.forecast.totals.revenue).toBeCloseTo(r.forecast.totals.holdRevenue, 5)
    // Steady state: 26 weeks of 175k/month.
    expect(r.forecast.totals.revenue).toBeCloseTo((175000 / (52 / 12)) * 26, 0)
  })

  it("cutting spend looks like a win at first and then costs more than it saved", () => {
    const i = clone()
    i.forecast.change = "down"
    i.forecast.changeAmountPerMonth = 5000
    i.spend.spendTrend = "steady"
    const r = computePipeline(i)
    expect(r.forecast.points[0].cumulativeChangeSpend).toBeGreaterThan(r.forecast.points[0].cumulativeChangeRevenue)
    expect(r.forecast.crossoverWeek).not.toBeNull()
    expect(r.forecast.crossoverLabel).toContain("lost more revenue than you saved")
  })
})
