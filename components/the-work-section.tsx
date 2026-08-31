import { RuleLabel } from "@/components/rule-label"

const services = [
  {
    number: "01",
    name: "Measurement",
    body: "You see which channels bring revenue and which are bringing real conversations. Attribution, CAC by channel, open deal value — in writing every Monday, so next week’s bets aren’t guesses.",
  },
  {
    number: "02",
    name: "Production",
    body: "Content at the speed of attention. Modern workflows for writing, editing, distributing, and atomizing across the channels your buyers actually use. A lean team produces what used to require a department.",
  },
  {
    number: "03",
    name: "Pipeline",
    body: "The lead-capture, qualification, routing, and nurture systems that turn attention into meetings. Set up once. Runs whether you’re at the desk or on a plane.",
  },
]

export function TheWorkSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24">
      <RuleLabel>The Work</RuleLabel>

      <p className="mt-14 sm:mt-20 font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
        Systems do the leverage.{" "}
        <span className="text-muted-foreground">We do the judgment.</span>
      </p>

      <ol className="mt-16 sm:mt-20 space-y-14 sm:space-y-16">
        {services.map((s) => (
          <li
            key={s.number}
            className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 gap-y-4 items-baseline"
          >
            <span className="font-display text-base sm:text-lg text-muted-foreground tabular-nums tracking-wide">
              {s.number}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
              {s.name}
            </h3>
            <span aria-hidden="true" />
            <p className="text-base sm:text-lg leading-[1.7] text-foreground/85">
              {s.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-20 sm:mt-24 border-t border-border pt-10 sm:pt-12 space-y-3">
        <p className="font-display text-2xl sm:text-3xl leading-snug tracking-tight text-foreground">
          Most agencies sell hours. We sell systems.
        </p>
        <p className="font-display text-xl sm:text-2xl italic text-muted-foreground">
          That&rsquo;s the deal.
        </p>
      </div>
    </section>
  )
}
