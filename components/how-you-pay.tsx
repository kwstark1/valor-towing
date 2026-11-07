import { RuleLabel } from "@/components/rule-label"
import { Button } from "@/components/button"
import { calculatorHref } from "@/site.config"

// The model only. Dollar amounts live inside the calculator, and the at-cost sending setup is always
// stated next to the per-call fee so nothing implies the client pays only for meetings.
export function HowYouPay() {
  return (
    <section id="how-you-pay" className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32">
      <RuleLabel>How You Pay</RuleLabel>

      <h2 className="mt-14 sm:mt-20 text-balance font-display text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-foreground">
        We book you qualified sales calls.
        <br />
        <span className="text-muted-foreground">You only pay for the ones that show up.</span>
      </h2>

      <p className="mt-8 sm:mt-10 max-w-2xl text-base sm:text-lg leading-[1.7] text-foreground/85">
        You cover the sending setup at cost, with no markup and no management fee. On top of that, you pay only for
        qualified calls that actually happen.
      </p>

      <div className="mt-12 border-l-2 border-accent pl-6 sm:pl-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">The Guarantee</p>
        <div className="mt-4 space-y-4 text-base sm:text-lg leading-[1.7]">
          <p className="text-foreground">
            If a booked call no-shows, or lands outside the criteria we agreed on, it doesn&rsquo;t count. You
            don&rsquo;t pay for it.
          </p>
          <p className="text-foreground/85">
            Together, we&rsquo;ll define what qualifies before we send a single email: title, company, fit. The bar is
            set in writing, not argued about later.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Button href={calculatorHref()}>See your numbers</Button>
        <p className="mt-3 text-sm text-muted-foreground">
          It takes about two minutes and shows the pricing plus your estimated return.
        </p>
      </div>
    </section>
  )
}
