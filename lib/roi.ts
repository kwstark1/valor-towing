export type RoiInputs = {
  bundles: number
  dealSize: number
  engagementRate: number
  qualifiedRate: number
  meetingRate: number
  showRate: number
  closeRate: number
  managementFee: number
}

export type Period = "monthly" | "quarterly"

export const BUNDLE_PRICE = 600
export const CONTACTS_PER_BUNDLE = 10_000
export const EMAILS_PER_CONTACT = 3
export const MEETING_FEE = 300
export const DEAL_SIZE_QUALIFIER = 10_000

export const DEFAULTS: RoiInputs = {
  bundles: 1,
  dealSize: 10_000,
  engagementRate: 2,
  qualifiedRate: 20,
  meetingRate: 50,
  showRate: 75,
  closeRate: 15,
  managementFee: 0,
}

export const RANGES = {
  bundles: { min: 1, max: 15, step: 1 },
  dealSize: { min: 5_000, max: 100_000, step: 1_000 },
  dealSizeEntry: { min: 1_000, max: 1_000_000 },
  engagementRate: { min: 0.5, max: 10, step: 0.5 },
  qualifiedRate: { min: 5, max: 50, step: 1 },
  meetingRate: { min: 10, max: 100, step: 1 },
  showRate: { min: 40, max: 100, step: 1 },
  closeRate: { min: 10, max: 60, step: 1 },
  managementFee: { min: 0, max: 100_000 },
} as const

// Rates are whole percentages; multiplying before dividing keeps the default funnel exact.
function share(count: number, percent: number) {
  return (count * percent) / 100
}

// The epsilon stops values like 14.999999 from flooring to 14.
function wholeDown(n: number) {
  return Math.floor(n + 1e-9)
}

export function calculate(inputs: RoiInputs, period: Period = "monthly") {
  const contacts = inputs.bundles * CONTACTS_PER_BUNDLE
  const engaged = share(contacts, inputs.engagementRate)
  const qualified = share(engaged, inputs.qualifiedRate)
  const booked = share(qualified, inputs.meetingRate)
  const attended = share(booked, inputs.showRate)
  const deals = share(attended, inputs.closeRate)

  // Billing and revenue use the same whole numbers the page shows, so the visible math adds up.
  const monthly = {
    contacts,
    emails: contacts * EMAILS_PER_CONTACT,
    engaged: wholeDown(engaged),
    qualified: wholeDown(qualified),
    booked: wholeDown(booked),
    attended: wholeDown(attended),
    deals: wholeDown(deals),
  }

  const infrastructureCost = inputs.bundles * BUNDLE_PRICE
  const managementCost = inputs.managementFee
  const meetingCost = monthly.attended * MEETING_FEE
  const totalCost = infrastructureCost + managementCost + meetingCost
  const revenue = monthly.deals * inputs.dealSize

  const factor = period === "quarterly" ? 3 : 1

  return {
    contacts: monthly.contacts * factor,
    emails: monthly.emails * factor,
    engaged: monthly.engaged * factor,
    qualified: monthly.qualified * factor,
    booked: monthly.booked * factor,
    attended: monthly.attended * factor,
    deals: monthly.deals * factor,
    infrastructureCost: infrastructureCost * factor,
    managementCost: managementCost * factor,
    meetingCost: meetingCost * factor,
    totalCost: totalCost * factor,
    revenue: revenue * factor,
    netGain: (revenue - totalCost) * factor,
    roiMultiple: revenue / totalCost,
    costPerMeeting: monthly.attended > 0 ? totalCost / monthly.attended : null,
    costPerDeal: monthly.deals > 0 ? totalCost / monthly.deals : null,
  }
}

export type RoiResults = ReturnType<typeof calculate>

const HASH_KEYS: Record<keyof RoiInputs, string> = {
  bundles: "b",
  dealSize: "deal",
  engagementRate: "eng",
  qualifiedRate: "qual",
  meetingRate: "meet",
  showRate: "show",
  closeRate: "close",
  managementFee: "fee",
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function clampInputs(inputs: RoiInputs): RoiInputs {
  return {
    bundles: Math.round(clamp(inputs.bundles, RANGES.bundles.min, RANGES.bundles.max)),
    dealSize: Math.round(clamp(inputs.dealSize, RANGES.dealSizeEntry.min, RANGES.dealSizeEntry.max)),
    engagementRate: clamp(inputs.engagementRate, RANGES.engagementRate.min, RANGES.engagementRate.max),
    qualifiedRate: clamp(inputs.qualifiedRate, RANGES.qualifiedRate.min, RANGES.qualifiedRate.max),
    meetingRate: clamp(inputs.meetingRate, RANGES.meetingRate.min, RANGES.meetingRate.max),
    showRate: clamp(inputs.showRate, RANGES.showRate.min, RANGES.showRate.max),
    closeRate: clamp(inputs.closeRate, RANGES.closeRate.min, RANGES.closeRate.max),
    managementFee: Math.round(clamp(inputs.managementFee, RANGES.managementFee.min, RANGES.managementFee.max)),
  }
}

// State lives in the URL hash rather than the query string so shared numbers never reach the server or analytics.
export function encodeHash(inputs: RoiInputs, period: Period) {
  const params = new URLSearchParams()
  for (const key of Object.keys(HASH_KEYS) as (keyof RoiInputs)[]) {
    if (inputs[key] !== DEFAULTS[key]) params.set(HASH_KEYS[key], String(inputs[key]))
  }
  if (period === "quarterly") params.set("p", "q")
  return params.toString()
}

export function decodeHash(hash: string): { inputs: RoiInputs; period: Period } {
  const params = new URLSearchParams(hash.replace(/^#/, ""))
  const inputs = { ...DEFAULTS }
  for (const key of Object.keys(HASH_KEYS) as (keyof RoiInputs)[]) {
    const raw = params.get(HASH_KEYS[key])
    if (raw === null) continue
    const n = Number(raw)
    if (Number.isFinite(n)) inputs[key] = n
  }
  return { inputs: clampInputs(inputs), period: params.get("p") === "q" ? "quarterly" : "monthly" }
}
