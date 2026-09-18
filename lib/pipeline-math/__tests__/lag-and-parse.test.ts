import { describe, expect, it } from "vitest"
import { cumulativeLag, lagWeights, lagWindow, weekWhenShareLanded } from "../lag"
import { parseDayRange, parseMoney, parseMonths, parseRate } from "../parse"
import { duration, money, oneIn, percent, perDollar, moneyShort } from "../format"

describe("lag weights", () => {
  it("always sum to one", () => {
    for (const days of [0, 1, 7, 14, 30, 45, 60, 90, 120, 180, 365]) {
      const w = lagWeights(days)
      expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9)
      expect(w.every((x) => x >= 0)).toBe(true)
    }
  })

  it("peaks at the cycle length", () => {
    const w = lagWeights(60)
    const peak = w.indexOf(Math.max(...w))
    expect(Math.abs(peak - 60 / 7)).toBeLessThanOrEqual(1)
  })

  it("spreads across cycle ± 50%", () => {
    const win = lagWindow(60)
    expect(win.first).toBeGreaterThanOrEqual(4)
    expect(win.last).toBeLessThanOrEqual(13)
    expect(win.center).toBe(9)
  })

  it("puts everything in week zero when there is no cycle", () => {
    expect(lagWeights(0)).toEqual([1])
  })

  it("a short cycle lands almost entirely within the first two weeks", () => {
    const cum = cumulativeLag(lagWeights(7))
    expect(cum[1]).toBeGreaterThan(0.95)
  })

  it("reports when half the revenue has landed", () => {
    const w = lagWeights(60)
    const half = weekWhenShareLanded(w, 0.5)!
    expect(half).toBeGreaterThanOrEqual(8)
    expect(half).toBeLessThanOrEqual(9)
  })
})

describe("forgiving parsing", () => {
  it("reads money in the ways people type it", () => {
    expect(parseMoney("$12,500")).toBe(12500)
    expect(parseMoney("12500")).toBe(12500)
    expect(parseMoney("12.5k")).toBe(12500)
    expect(parseMoney("1.2m")).toBe(1_200_000)
    expect(parseMoney(" 3,000 ")).toBe(3000)
    expect(parseMoney("0")).toBe(0)
  })

  it("refuses nonsense and negatives", () => {
    expect(parseMoney("abc")).toBeNull()
    expect(parseMoney("-5")).toBeNull()
    expect(parseMoney("")).toBeNull()
    expect(parseMoney(null)).toBeNull()
  })

  it("reads rates as percent or fraction", () => {
    expect(parseRate("25%")).toBe(0.25)
    expect(parseRate("25")).toBe(0.25)
    expect(parseRate("0.25")).toBe(0.25)
    expect(parseRate("1")).toBe(1)
    expect(parseRate("100")).toBe(1)
    expect(parseRate("250")).toBeNull()
  })

  it("reads day ranges", () => {
    expect(parseDayRange("45")).toEqual({ low: 45, high: 45 })
    expect(parseDayRange("30-60")).toEqual({ low: 30, high: 60 })
    expect(parseDayRange("30 to 60")).toEqual({ low: 30, high: 60 })
    expect(parseDayRange("6 weeks")).toEqual({ low: 42, high: 42 })
    expect(parseDayRange("1-3 months")).toEqual({ low: 30, high: 90 })
    expect(parseDayRange("2 months - 3 months")).toEqual({ low: 60, high: 90 })
    expect(parseDayRange("60-30")).toEqual({ low: 30, high: 60 })
    expect(parseDayRange("soon")).toBeNull()
  })

  it("reads months", () => {
    expect(parseMonths("18")).toBe(18)
    expect(parseMonths("2 years")).toBeCloseTo(24.33, 1)
    expect(parseMonths("6 months")).toBe(6)
  })
})

describe("human formatting", () => {
  it("never shows more than one meaningful decimal", () => {
    expect(money(4166.666)).toBe("$4,167")
    expect(percent(0.357)).toBe("36%")
    expect(percent(0.0357)).toBe("3.6%")
    expect(perDollar(4.1666)).toBe("$4.17")
    expect(moneyShort(12500)).toBe("$13k")
    expect(moneyShort(1500)).toBe("$1.5k")
    expect(moneyShort(1_250_000)).toBe("$1.3m")
  })

  it("turns days into something a person would say", () => {
    expect(duration(43.5)).toBe("about 6 weeks")
    expect(duration(10)).toBe("about 10 days")
    expect(duration(150)).toBe("about 5 months")
  })

  it("writes odds as 1 in N", () => {
    expect(oneIn(0.25)).toBe("1 in 4")
    expect(oneIn(0.05)).toBe("1 in 20")
    expect(oneIn(0.9)).toBeNull()
  })
})
