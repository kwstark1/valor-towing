import { RuleLabel } from "@/components/rule-label"

// TODO(Ken): review every answer below before this goes live. One list feeds both the accordion and the FAQPage schema.
const FAQS = [
  {
    // TODO(Ken): review. "Five figures" stands in for $10,000 because dollar amounts stay inside the calculator.
    q: "Who is this for?",
    a: "B2B companies in any industry where a single closed deal is worth five figures or more. At that size, a few good meetings a month can pay for the whole program. If your deals are smaller, cold outreach at this volume usually doesn’t pay for itself.",
  },
  {
    // TODO(Ken): review.
    q: "How does pricing work?",
    a: "You pay for meetings that happen. The sending infrastructure (domains, inboxes, and sending accounts) is passed through at cost. On top of that there’s a fee for each qualified meeting a prospect actually attends, not just books. There’s no management fee. The calculator shows the exact numbers for your business.",
  },
  {
    // TODO(Ken): review.
    q: "Will cold email hurt my main domain?",
    a: "It shouldn’t, because your main domain never sends a cold email. Outreach goes out from separate sending domains and accounts that are warmed up before any campaign starts, so your everyday email stays protected.",
  },
  {
    // TODO(Ken): review against your real launch timeline. Drafted from 2026 industry norms (first sends 3 to 6 weeks, first meetings 30 to 60 days).
    q: "How soon will I see meetings?",
    a: "Sending usually starts two to four weeks after kickoff, once the new domains are warmed up. Replies tend to come in the first week or two of sending, and first meetings typically follow within 30 to 60 days of kickoff. Month one runs lighter than the months after it.",
  },
  {
    // TODO(Ken): decide your actual terms (month to month or a minimum). Drafted from industry norms, where three months is common.
    q: "How long is the commitment?",
    a: "Plan on at least three months. The first few weeks go to setup and warm-up, and the copy gets sharper every week after that, so it takes a few months to see what outreach can really do for you. Exact terms are agreed on the call before anything starts.",
  },
  {
    // TODO(Ken): review. Add anything else you need from clients (approvals, DNS access, brand assets).
    q: "What do I need to provide?",
    a: "A clear picture of your offer and who buys it, a calendar for meetings to be booked into, and someone ready to take the calls. The list, the sending domains and accounts, the copy, and the weekly reporting are handled for you.",
  },
  {
    // TODO(Ken): review.
    q: "How is this different from buying a list?",
    a: "A bought list is the same list everyone else bought, and much of it is out of date. Your list is built name by name against what a closed deal is worth to you. It also comes with the sending setup that keeps messages out of spam, copy written from research into your buyers, and a written report every Monday.",
  },
  {
    // TODO(Ken): review. Make sure this matches how you define qualified on the call and in your agreement.
    q: "What counts as a qualified meeting?",
    a: "A call with someone who fits the buyer profile you agree on before launch, and who actually shows up. If a prospect doesn’t attend, or turns out to be outside that profile, you aren’t charged for that meeting. Meetings are invoiced weekly, so any question about a call gets settled while it’s fresh.",
  },
]

export function FaqSection() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32">
      <RuleLabel>FAQ</RuleLabel>

      <div className="mt-14 sm:mt-20 divide-y divide-border border-y border-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg sm:text-xl tracking-tight text-foreground [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="shrink-0 text-2xl leading-none text-accent transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-6 pr-8 text-base sm:text-lg leading-[1.7] text-foreground/85">{item.a}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </section>
  )
}
