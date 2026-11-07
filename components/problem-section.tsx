import { RuleLabel } from "@/components/rule-label"

export function ProblemSection() {
  return (
    <section id="the-problem" className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32">
      <RuleLabel>The Problem</RuleLabel>

      <p className="mt-14 sm:mt-20 text-balance font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
        Most B2B companies fill their calendar two ways: repeat clients and word-of-mouth.
      </p>

      <div className="mt-8 space-y-6 text-base sm:text-lg leading-[1.7]">
        <p className="text-foreground/85">
          Both depend on strangers choosing to find you. When they slow down, the pipeline stops, because there&rsquo;s
          no system for starting conversations with people who&rsquo;ve never heard of you.
        </p>
        <p className="text-foreground">
          We build and run that system, so you stop relying on luck to fill your calendar.
        </p>
      </div>
    </section>
  )
}
