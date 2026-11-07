import { RuleLabel } from "@/components/rule-label"
import { TIMELINES, calculatorHref } from "@/site.config"

const STEPS = [
  {
    title: "Run the numbers",
    body: "Use the calculator to see the pricing and what outreach could return for your business.",
    timeline: TIMELINES.numbers,
    link: { label: "Open the calculator", href: calculatorHref() },
  },
  {
    title: "Pipeline Review",
    body: "Talk through your offer, your buyers, and whether the numbers work for you.",
    timeline: TIMELINES.call,
  },
  {
    title: "Build and launch",
    body: "Domains, warm-up, list, and copy get built. Sending starts once the domains are ready, then a written report arrives every Monday.",
    timeline: TIMELINES.launch,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32">
      <RuleLabel>How It Works</RuleLabel>

      <ol className="mt-14 sm:mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col">
            <span className="font-display text-3xl tabular-nums text-accent">{i + 1}</span>
            <h3 className="mt-3 font-display text-xl sm:text-2xl tracking-tight text-foreground">{step.title}</h3>
            <p className="mt-3 text-base leading-[1.7] text-foreground/85">{step.body}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{step.timeline}</p>
            {step.link ? (
              <a
                href={step.link.href}
                className="mt-4 self-start border-b border-border text-sm text-foreground hover:border-foreground transition-colors"
              >
                {step.link.label}
              </a>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
