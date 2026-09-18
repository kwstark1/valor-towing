/**
 * The lag model.
 *
 * Money spent in a given week produces revenue that lands later, spread across a
 * window centered on the sales cycle. Deals don't close in lockstep, so we use a
 * triangular distribution over [cycle × 0.5, cycle × 1.5] peaking at the cycle
 * length, then bucket it by week.
 *
 * `lagWeights(cycleDays)[k]` is the share of a week's spend-driven revenue that
 * lands k weeks after the spend. The weights sum to 1.
 */

export const DAYS_PER_WEEK = 7
export const WEEKS_PER_MONTH = 52 / 12

/** Cumulative distribution of a triangular distribution on [a, b] with mode m. */
function triangularCdf(x: number, a: number, b: number, m: number): number {
  if (x <= a) return 0
  if (x >= b) return 1
  if (x <= m) return ((x - a) * (x - a)) / ((b - a) * (m - a))
  return 1 - ((b - x) * (b - x)) / ((b - a) * (b - m))
}

export function lagWeights(cycleDays: number): number[] {
  const c = Math.max(0, cycleDays) / DAYS_PER_WEEK
  const a = c * 0.5
  const b = c * 1.5
  // Degenerate window (cycle of zero or a day or two): everything lands in one bucket.
  if (b - a < 1e-6) {
    const k = Math.round(c)
    const w = new Array<number>(k + 1).fill(0)
    w[k] = 1
    return w
  }
  const last = Math.ceil(b + 0.5)
  const weights: number[] = []
  for (let k = 0; k <= last; k++) {
    // Bucket k collects everything landing in [k - 0.5, k + 0.5).
    const mass = triangularCdf(k + 0.5, a, b, c) - triangularCdf(k - 0.5, a, b, c)
    weights.push(mass)
  }
  // Normalize away any floating error so the shares sum to exactly 1.
  const total = weights.reduce((s, w) => s + w, 0)
  return weights.map((w) => (total > 0 ? w / total : 0))
}

/** Share of a cohort's revenue that has landed by the end of week k (inclusive). */
export function cumulativeLag(weights: number[]): number[] {
  const out: number[] = []
  let running = 0
  for (const w of weights) {
    running += w
    out.push(Math.min(1, running))
  }
  return out
}

/** First week where at least `share` of the revenue has landed, or null. */
export function weekWhenShareLanded(weights: number[], share: number): number | null {
  const cum = cumulativeLag(weights)
  for (let k = 0; k < cum.length; k++) {
    if (cum[k] >= share - 1e-9) return k
  }
  return null
}

/** Window in weeks: first bucket with meaningful mass, the center, and the last. */
export function lagWindow(cycleDays: number): { first: number; center: number; last: number } {
  const weights = lagWeights(cycleDays)
  let first = 0
  let last = weights.length - 1
  while (first < weights.length && weights[first] < 0.01) first++
  while (last > 0 && weights[last] < 0.01) last--
  return { first, center: Math.round(cycleDays / DAYS_PER_WEEK), last }
}

/**
 * Revenue landing in week t, given a return per dollar and a function that
 * returns weekly spend for any week (negative weeks are history).
 */
export function revenueAtWeek(
  t: number,
  returnPerDollar: number,
  weights: number[],
  spendAtWeek: (week: number) => number
): number {
  let total = 0
  for (let k = 0; k < weights.length; k++) {
    total += weights[k] * spendAtWeek(t - k)
  }
  return returnPerDollar * total
}
