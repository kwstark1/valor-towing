import { RuleLabel } from "@/components/rule-label"

// TODO(Ken): confirm items 2, 7, 8, and 9 are part of every engagement (they aren't described elsewhere on the site).
const ITEMS = [
  "Define your ideal customer",
  "Reposition your offer for cold outreach",
  "Build the sending setup (domains, inboxes, warm-up)",
  "Build verified prospect lists",
  "Write the outbound copy",
  "Launch and manage campaigns",
  "Handle replies",
  "Prequalify interested prospects",
  "Book qualified calls onto your calendar",
]

export function WhatsIncluded() {
  return (
    <section id="whats-included" className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32">
      <RuleLabel>What&rsquo;s Included</RuleLabel>

      <h2 className="mt-14 sm:mt-20 text-balance font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
        We handle the entire engine. <span className="text-muted-foreground">You take the calls.</span>
      </h2>

      <ol className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
        {ITEMS.map((item, i) => (
          <li key={item} className="flex gap-3 text-base leading-snug text-foreground/90">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              <span className="sr-only">{i + 1}. </span>
              {item}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
