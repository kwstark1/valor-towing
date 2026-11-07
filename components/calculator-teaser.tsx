import Link from "next/link"
import { RuleLabel } from "@/components/rule-label"

export function CalculatorTeaser() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24">
      <RuleLabel>Your Numbers</RuleLabel>

      <h2 className="mt-14 sm:mt-20 font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
        You pay for meetings that happen.{" "}
        <span className="text-muted-foreground">See what that&rsquo;s worth to you.</span>
      </h2>

      <p className="mt-6 max-w-2xl text-base sm:text-lg leading-[1.7] text-foreground/85">
        Put in your deal size and close rate. You&rsquo;ll see your estimated pipeline, the full cost, and what each
        meeting would cost you.
      </p>

      <div className="mt-10">
        <Link
          href="/calculator"
          className="group inline-flex items-baseline gap-3 font-sans text-base sm:text-lg text-foreground"
        >
          <span aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-0.5">
            →
          </span>
          <span className="border-b border-border group-hover:border-foreground transition-colors">
            See if you&rsquo;re a fit
          </span>
        </Link>
      </div>
    </section>
  )
}
