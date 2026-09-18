/**
 * Human number formatting. Rules from the build spec:
 * never more than one decimal place, never a raw decimal like 0.24,
 * "About 6 weeks" not "43.5 days", "1 in 4" alongside percentages.
 */

const money0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

/** $12,500. Rounds to whole dollars. */
export function money(n: number): string {
  if (!Number.isFinite(n)) return "—"
  return money0.format(Math.round(n))
}

/** $12.5k / $1.2m for chart axes and tight spaces. */
export function moneyShort(n: number): string {
  if (!Number.isFinite(n)) return "—"
  const abs = Math.abs(n)
  const sign = n < 0 ? "-" : ""
  if (abs >= 1_000_000) return `${sign}$${trim1(abs / 1_000_000)}m`
  if (abs >= 10_000) return `${sign}$${Math.round(abs / 1000)}k`
  if (abs >= 1_000) return `${sign}$${trim1(abs / 1000)}k`
  return `${sign}$${Math.round(abs)}`
}

/** "$4.17 back for every dollar" style: one or two decimals, no percent. */
export function perDollar(n: number): string {
  if (!Number.isFinite(n)) return "—"
  return `$${n.toFixed(2)}`
}

/** 25% (one decimal only when under 10%). */
export function percent(fraction: number): string {
  if (!Number.isFinite(fraction)) return "—"
  const p = fraction * 100
  if (p > 0 && p < 10) return `${trim1(p)}%`
  return `${Math.round(p)}%`
}

/** "1 in 4" for a fraction. Returns null when it wouldn't read well. */
export function oneIn(fraction: number): string | null {
  if (!Number.isFinite(fraction) || fraction <= 0 || fraction > 1) return null
  const n = 1 / fraction
  if (n < 1.5) return null
  const rounded = n < 10 ? Math.round(n) : Math.round(n / 5) * 5
  return `1 in ${rounded}`
}

/** "about 6 weeks", "about 45 days", "about 5 months". */
export function duration(days: number): string {
  if (!Number.isFinite(days) || days < 0) return "—"
  if (days < 14) return `about ${Math.round(days)} day${Math.round(days) === 1 ? "" : "s"}`
  if (days < 84) {
    const w = Math.round(days / 7)
    return `about ${w} week${w === 1 ? "" : "s"}`
  }
  const m = trim1(days / 30)
  return `about ${m} month${m === "1" ? "" : "s"}`
}

/** "week 7" or "about 2 months in". */
export function weekLabel(week: number): string {
  if (week <= 0) return "right away"
  if (week < 9) return `week ${week}`
  return `about ${trim1(week / 4.33)} months in`
}

/** Whole number with commas. */
export function count(n: number): string {
  if (!Number.isFinite(n)) return "—"
  const r = Math.abs(n) < 10 ? Number(n.toFixed(1)) : Math.round(n)
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(r)
}

/** Number words for small counts, used in headings. */
export function numberWord(n: number): string {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
  return n >= 0 && n <= 10 ? words[n] : String(n)
}

/** Drop a trailing .0 after rounding to one decimal. */
export function trim1(n: number): string {
  const s = n.toFixed(1)
  return s.endsWith(".0") ? s.slice(0, -2) : s
}

export function plural(n: number, one: string, many: string = `${one}s`): string {
  return Math.round(n) === 1 ? one : many
}
