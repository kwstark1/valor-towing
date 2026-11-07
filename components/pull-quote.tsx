import { FitButton } from "@/components/button"

export function PullQuote() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-8 py-16 sm:py-20">
      <figure className="border-t border-border pt-14 sm:pt-16 text-center">
        <blockquote className="space-y-3">
          <p className="text-balance font-display text-3xl sm:text-5xl font-semibold leading-tight tracking-tight text-foreground">
            Most agencies sell hours. We sell systems.
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
