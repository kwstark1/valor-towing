import type { ChannelInput, PipelineInputs } from "./types"

let seq = 0
export function newChannelId(): string {
  seq += 1
  return `ch-${Date.now().toString(36)}-${seq}`
}

export function emptyChannel(name = ""): ChannelInput {
  return { id: newChannelId(), name, monthlySpend: null, leadsPerMonth: null, dealsPerMonth: null }
}

/** Every field unknown. The engine must cope with this exactly. */
export function emptyInputs(): PipelineInputs {
  return {
    deal: {
      averageDealSize: null,
      salesCycleDays: null,
      closeRate: null,
      revenueType: null,
      customerLifespanMonths: null,
    },
    spend: {
      channels: [],
      totalMonthlySpend: null,
      spendTrend: null,
      spendThreeMonthsAgo: null,
    },
    results: {
      period: "month",
      closedDeals: null,
      newRevenue: null,
      qualifiedMeetings: null,
    },
    forecast: {
      change: "hold",
      changeAmountPerMonth: null,
      horizonDays: 90,
    },
    assumptions: {},
  }
}

export const CHANNEL_SUGGESTIONS = [
  "Google Ads",
  "LinkedIn Ads",
  "Meta Ads",
  "SEO / organic search",
  "Referrals",
  "Outbound email",
  "Cold calling",
  "Events / trade shows",
  "Webinars",
  "Content / blog",
  "Partners",
  "Word of mouth",
]
