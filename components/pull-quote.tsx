import { FitButton } from "@/components/button"

export function PullQuote() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-8 py-16 sm:py-20">
      <figure className="border-t border-border pt-14 sm:pt-16 text-center">
        <blockquote className="space-y-3">
          {/* One sentence per line. The phone size scales with the screen so "Most agencies sell hours." fits on one line from 320px up. */}
          <p className="font-display text-[clamp(1.5rem,7.4vw,1.875rem)] sm:text-5xl font-semibold leading-tight tracking-tight text-foreground">
            <span className="block">Most agencies sell hours.</span> <span className="block">We sell systems.</span>
          </p>
          <p className="font-display text-xl sm:text-3xl italic text-muted-foreground">
            That&rsquo;s the deal.
          </p>
        </blockquote>
        <div className="mt-10 sm:mt-12">
          <FitButton />
        </div>
      </figure>
    </section>
  )
}
