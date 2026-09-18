"use client"

import { useId } from "react"
import type { ForecastResult } from "@/lib/pipeline-math/types"
import { moneyShort, weekLabel } from "@/lib/pipeline-math/format"

const W = 640
const H = 320
const PAD = { top: 20, right: 20, bottom: 44, left: 56 }

/**
 * Two lines on one timeline: money out and money back, cumulative by week,
 * with the crossover marked. Inline SVG, no chart junk.
 */
export function ForecastChart({ forecast }: { forecast: ForecastResult }) {
  const id = useId()
  const isChange = forecast.change !== "hold"
  const pts = forecast.points
  if (pts.length === 0) return null

  const series = pts.map((p) => ({
    week: p.week,
    out: isChange ? p.cumulativeChangeSpend : p.cumulativeSpend,
    back: isChange ? p.cumulativeChangeRevenue : p.cumulativeRevenue,
  }))

  const outLabel = forecast.change === "down" ? "Money saved" : "Money out"
  const backLabel = forecast.change === "down" ? "Revenue lost" : "Money back"

  const maxY = Math.max(1, ...series.map((s) => Math.max(s.out, s.back)))
  const maxX = forecast.horizonWeeks
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (week: number) => PAD.left + ((week - 1) / Math.max(1, maxX - 1)) * innerW
  const y = (v: number) => PAD.top + innerH - (v / maxY) * innerH

  const path = (key: "out" | "back") => series.map((s, i) => `${i === 0 ? "M" : "L"}${x(s.week).toFixed(1)},${y(s[key]).toFixed(1)}`).join(" ")

  const yTicks = niceTicks(maxY, 4)
  const xTicks = maxX <= 13 ? [1, 4, 7, 10, 13] : [1, 5, 9, 13, 17, 21, 26]

  const cross = forecast.crossoverWeek
  const crossPt = cross !== null ? series.find((s) => s.week === cross) : undefined

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        className="h-auto w-full"
      >
        <title id={`${id}-title`}>
          {outLabel} and {backLabel} over {forecast.horizonDays} days
        </title>
        <desc id={`${id}-desc`}>
          {forecast.crossoverLabel} By day {forecast.horizonDays}: {moneyShort(series[series.length - 1].out)} {outLabel.toLowerCase()},{" "}
          {moneyShort(series[series.length - 1].back)} {backLabel.toLowerCase()}.
        </desc>

        {/* Grid + y axis */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity={0.12} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--pm-slate)">
              {moneyShort(t)}
            </text>
          </g>
        ))}

        {/* x axis */}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="currentColor" strokeOpacity={0.3} />
        {xTicks
          .filter((t) => t <= maxX)
          .map((t) => (
            <text key={t} x={x(t)} y={H - PAD.bottom + 18} textAnchor="middle" fontSize={11} fill="var(--pm-slate)">
              {t === 1 ? "week 1" : `wk ${t}`}
            </text>
          ))}

        {/* Lines */}
        <path d={path("out")} fill="none" stroke="var(--pm-slate)" strokeWidth={2} strokeDasharray="5 4" />
        <path d={path("back")} fill="none" stroke="currentColor" strokeWidth={2.5} />

        {/* Crossover */}
        {crossPt && cross !== null && cross > 1 && (
          <g>
            <line x1={x(cross)} x2={x(cross)} y1={PAD.top} y2={y(0)} stroke="var(--pm-gold)" strokeOpacity={0.5} strokeDasharray="2 3" />
            <circle cx={x(cross)} cy={y(crossPt.back)} r={5} fill="var(--pm-gold)" />
            <text
              x={cross > maxX * 0.7 ? x(cross) - 10 : x(cross) + 10}
              y={Math.max(PAD.top + 12, y(crossPt.back) - 12)}
              textAnchor={cross > maxX * 0.7 ? "end" : "start"}
              fontSize={12}
              fill="var(--pm-gold)"
            >
              {forecast.change === "down" ? "lost passes saved" : "paid back"}, {weekLabel(cross)}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-0 w-6 border-t-2 border-dashed border-muted-foreground" /> {outLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-0 w-6 border-t-2 border-foreground" /> {backLabel}
        </span>
        {cross !== null && cross > 1 && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-accent" /> where they cross
          </span>
        )}
      </figcaption>
    </figure>
  )
}

function niceTicks(max: number, count: number): number[] {
  const rough = max / count
  const pow = Math.pow(10, Math.floor(Math.log10(rough)))
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * pow)
  const step = candidates.find((c) => c >= rough) ?? candidates[candidates.length - 1]
  const ticks: number[] = []
  for (let v = step; v <= max + step * 0.01; v += step) ticks.push(v)
  return ticks
}
