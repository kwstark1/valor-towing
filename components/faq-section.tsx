import { RuleLabel } from "@/components/rule-label"

// TODO(Ken): review every answer below before this goes live. One list feeds both the accordion and the FAQPage schema.
const FAQS = [
  {
    // Ken's wording (2026-11-07). The one dollar figure on the homepage, by his choice; it's a deal size, not pricing.
    q: "Who is this for?",
    a: "B2B companies in any industry where a single closed deal is worth $10,000 or more. Most B2B sellers close somewhere between 1 in 4 and 1 in 6 qualified meetings, so roughly five meetings tends to turn into one new customer. At $10,000 or more per deal, that one customer covers the program several times over. If your deals are smaller, the math gets tight fast, and cold outreach at this volume usually isn’t worth it.",
  },
  {
    // TODO(Ken): review.
    q: "How does pricing work?",
    a: "You pay for meetings that happen. The sending infrastructure (domains, inboxes, and sending accounts) is passed through at cost. On top of that there’s a fee for each qualified meeting a prospect actually attends, not just books. There’s no management fee. The calculator shows the exact numbers for your business.",
  },
  {
    // TODO(Ken): review. Merges the funnel's question with the old "What counts as a qualified meeting?" so it appears once.
    q: "How do you define a qualified call?",
    a: "Before a single email goes out, we agree in writing on what qualifies: the job titles, the kinds of companies, and what makes someone a real fit. A call counts only if the prospect meets that bar and actually shows up. Calls are invoiced weekly, so any question about one gets settled while it’s fresh.",
  },
  {
    // TODO(Ken): review.
    q: "What happens if someone doesn’t show up?",
    a: "It doesn’t count, and you don’t pay for it. The per-call fee only applies to qualified calls that actually happen. The sending setup is still billed at cost, the same as any other week.",
  },
  {
    // TODO(Ken): review.
    q: "Will cold email hurt my main domain?",
    a: "It shouldn’t, because your main domain never sends a cold email. Outreach goes out from separate sending domains and accounts that are warmed up before any campaign starts, so your everyday email stays protected.",
  },
  {
    // TODO(Ken): review. Kept free of performance claims; there are no comparative results yet.
    q: "Why cold email instead of paid ads?",
    a: "Ads wait for the right buyer to happen to see them. Cold email goes straight to the companies and titles you choose, by name. You decide exactly who hears from you, and every Monday you see what landed in the inbox, who replied, and what each meeting cost. It can run alongside ads; it just doesn’t depend on someone finding you first.",
  },
  {
    // TODO(Ken): review against your real launch timeline. Drafted from 2026 industry norms (first sends 3 to 6 weeks, first meetings 30 to 60 days).
    q: "How soon will I see meetings?",
    a: "Sending usually starts two to four weeks after kickoff, once the new domains are warmed up. Replies tend to come in the first week or two of sending, and first meetings typically follow within 30 to 60 days of kickoff. Month one runs lighter than the months after it.",
  },
  {
    // TODO(Ken): confirm. Drafted as an onboarding call plus taking the booked calls; replies and booking depend on "What's included" items 7 to 9.
    q: "How much of my time does this take?",
    a: "Very little after the start. Plan on an onboarding call to walk through your offer and your best customers. After that, your time goes into taking the qualified calls that land on your calendar, while replies, follow-up, and booking are handled for you.",
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
