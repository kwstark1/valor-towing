import type { PipelineInputs } from "./types"

/** A realistic B2B company for building the results page against. */
export const sampleInputs: PipelineInputs = {
  deal: {
    averageDealSize: 12500,
    salesCycleDays: { low: 30, high: 60 },
    closeRate: 0.25,
    revenueType: "one-time",
    customerLifespanMonths: null,
  },
  spend: {
    channels: [
      { id: "c1", name: "Google Ads", monthlySpend: 6000, leadsPerMonth: 20, dealsPerMonth: 4 },
      { id: "c2", name: "LinkedIn Ads", monthlySpend: 3000, leadsPerMonth: 8, dealsPerMonth: 1 },
      { id: "c3", name: "Referrals", monthlySpend: 0, leadsPerMonth: 6, dealsPerMonth: 4 },
    ],
    totalMonthlySpend: 14000,
    spendTrend: "up",
    spendThreeMonthsAgo: 9000,
  },
  results: {
    period: "month",
    closedDeals: 14,
    newRevenue: 175000,
    qualifiedMeetings: 56,
  },
  forecast: {
    change: "up",
    changeAmountPerMonth: 5000,
    horizonDays: 180,
  },
  assumptions: {},
}
