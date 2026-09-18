/**
 * Forgiving input parsing. Accepts "$12,500", "12500", "12.5k", "1.2m",
 * "25%", "30-60", "6 weeks", "2 months". Returns null for anything it
 * can't read, never a guess.
 */

import type { DayRange } from "./types"

function cleanNumber(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/[$,\s]/g, "").replace(/usd$/, "")
  if (!s) return null
  const m = s.match(/^(-?\d*\.?\d+)(k|m|mm|b)?$/)
  if (!m) return null
  let n = parseFloat(m[1])
  if (!Number.isFinite(n)) return null
  const suffix = m[2]
  if (suffix === "k") n *= 1_000
  else if (suffix === "m" || suffix === "mm") n *= 1_000_000
  else if (suffix === "b") n *= 1_000_000_000
  return n
}

/** Dollars. Negative or unreadable → null. */
export function parseMoney(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === "number") return Number.isFinite(raw) && raw >= 0 ? raw : null
  const n = cleanNumber(raw)
  if (n === null || n < 0) return null
  return n
}

/** A plain count (deals, meetings). Negative or unreadable → null. */
export function parseCount(raw: string | number | null | undefined): number | null {
  return parseMoney(raw)
}

/**
 * A rate as a fraction 0..1. "25%" → 0.25, "25" → 0.25, "0.25" → 0.25.
 * Values above 100 or below 0 are unreadable.
 */
export function parseRate(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  let n: number | null
  if (typeof raw === "number") {
    n = Number.isFinite(raw) ? raw : null
  } else {
    const s = raw.trim().replace(/%/g, "")
    n = cleanNumber(s)
  }
  if (n === null || n < 0) return null
  if (n > 1 && n <= 100) n = n / 100
  if (n > 1) return null
  return n
}

const UNIT_DAYS: Record<string, number> = {
  d: 1,
  day: 1,
  days: 1,
  w: 7,
  wk: 7,
  wks: 7,
  week: 7,
  weeks: 7,
  mo: 30,
  mos: 30,
  month: 30,
  months: 30,
  y: 365,
  yr: 365,
  year: 365,
  years: 365,
}

function parseOneDuration(raw: string): number | null {
  const s = raw.trim().toLowerCase()
  const m = s.match(/^(\d*\.?\d+)\s*([a-z]*)$/)
  if (!m) return null
  const n = parseFloat(m[1])
  if (!Number.isFinite(n) || n < 0) return null
  const unit = m[2] || "days"
  const mult = UNIT_DAYS[unit]
  if (mult === undefined) return null
  return n * mult
}

/**
 * Days, accepting a range. "45" → {45,45}. "30-60" → {30,60}.
 * "6 weeks" → {42,42}. "1 to 3 months" → {30,90}. "2-3 months" → {60,90}.
 */
export function parseDayRange(raw: string | null | undefined): DayRange | null {
  if (!raw) return null
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\s+to\s+/g, "-")
    .replace(/–|—/g, "-")
  const parts = s.split("-").map((p) => p.trim()).filter(Boolean)
  if (parts.length === 1) {
    const d = parseOneDuration(parts[0])
    return d === null ? null : { low: d, high: d }
  }
  if (parts.length === 2) {
    // "2-3 months": the unit trails the second number and applies to both.
    const unitMatch = parts[1].match(/[a-z]+$/)
    const unit = unitMatch ? unitMatch[0] : ""
    const lowRaw = /[a-z]+$/.test(parts[0]) ? parts[0] : `${parts[0]}${unit}`
    const low = parseOneDuration(lowRaw)
    const high = parseOneDuration(parts[1])
    if (low === null || high === null) return null
    return low <= high ? { low, high } : { low: high, high: low }
  }
  return null
}

/** Months, for customer lifespan. "18" → 18, "2 years" → 24. */
export function parseMonths(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === "number") return Number.isFinite(raw) && raw >= 0 ? raw : null
  const d = parseOneDuration(raw.replace(/months?$/i, "mo"))
  if (d === null) return null
  // parseOneDuration returns days; a bare number was days, so treat as months.
  const s = raw.trim().toLowerCase()
  if (/^\d*\.?\d+$/.test(s)) return parseFloat(s)
  return d / 30
}
