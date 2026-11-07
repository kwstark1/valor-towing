import { FitButton } from "@/components/button"

export function ClosingBand() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-balance font-display text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-foreground">
          We book you qualified sales calls.
          <br />
          <span className="text-muted-foreground">You only pay for the ones that show up.</span>
        </h2>
        {/* Keeps the at-cost sending setup next to the per-call promise wherever it appears. */}
        <p className="mt-5 text-base text-muted-foreground">Plus the sending setup, passed through at cost.</p>
        <div className="mt-8">
          <FitButton />
        </div>
      </div>
    </section>
  )
}
