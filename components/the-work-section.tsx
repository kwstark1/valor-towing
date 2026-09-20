import { RuleLabel } from "@/components/rule-label"

const services = [
  {
    number: "01",
    name: "Measurement",
    body: "You see what actually happened, in numbers you can check: how many messages landed in the inbox instead of spam, how many got a reply, how many of those replies were worth having, and what each booked meeting cost you. It comes in writing every Monday, so the next week’s decisions get made on what happened rather than on a feeling.",
  },
  {
    number: "02",
    name: "Targeting, Outreach, The Sending",
    body: "The list gets built rather than bought, name by name, against the one thing that qualifies a company: what a closed deal is actually worth to you. Then the domains, the sending accounts, and the warm-up that keep those messages out of spam. The writing starts from your offer and from research into the people who actually buy it, in the words they use themselves, and it goes out at a volume that produces real conversations. We won’t pretend every email is written by hand for one person. It’s written for the buyers you’re trying to reach, and sent at a scale that works.",
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
        Anyone can put a message in front of thousands of people.{" "}
        <span className="text-muted-foreground">
          The work is knowing who to write to, and what to say when you do.
        </span>
      </p>

      <ol className="mt-16 sm:mt-20 space-y-14 sm:space-y-16">
        {services.map((s) => (
          <li
            key={s.number}
            className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 gap-y-4 items-baseline"
          >
            <span
              data-role="numeral"
              className="font-display text-base sm:text-lg text-muted-foreground tabular-nums tracking-wide"
            >
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
