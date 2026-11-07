import { RuleLabel } from "@/components/rule-label"
import { FitButton } from "@/components/button"

// The model only. Dollar amounts live inside the calculator, never on this page.
const POINTS = [
  "No management fee.",
  "Sending costs are passed through at cost.",
  "A per-meeting fee only when a qualified prospect actually shows up.",
]

export function HowYouPay() {
  return (
    <section id="how-you-pay" className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32">
      <RuleLabel>How You Pay</RuleLabel>

      <h2 className="mt-14 sm:mt-20 text-balance font-display text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-foreground">
        You pay for meetings that happen.
      </h2>

      <ul className="mt-8 sm:mt-10 space-y-3">
        {POINTS.map((point) => (
          <li key={point} className="flex gap-4 text-base sm:text-lg leading-[1.6] text-foreground/85">
            <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-14 sm:mt-16 border-t border-border pt-10 sm:pt-12">
        <h3 className="font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
          See what a meeting is worth to you.
        </h3>
        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-[1.7] text-foreground/85">
          See the exact numbers for your business in the calculator. It takes about two minutes and shows the pricing
          plus your estimated return.
        </p>
        <div className="mt-8">
          <FitButton />
        </div>
      </div>
    </section>
  )
}
