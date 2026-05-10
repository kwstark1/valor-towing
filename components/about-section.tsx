import Link from "next/link"
import { RuleLabel } from "@/components/rule-label"

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-3xl px-6 sm:px-8 pt-24 sm:pt-32 pb-20 sm:pb-28"
    >
      <RuleLabel>About the Firm</RuleLabel>

      <div className="mt-14 sm:mt-20 font-display text-foreground">
        <p className="text-2xl sm:text-3xl leading-snug tracking-tight">
          The firm is named for two Texas families.
        </p>

        <div className="mt-10 space-y-7 text-lg sm:text-xl leading-[1.7] text-foreground/85">
          <p>
            The Starks came up through East Texas before the Civil War. The
            Barkers came up through Brazos County, alongside the Millicans,
            who founded the town of Millican
            itself when it was still the end of the railroad line. In 1920,
            the two lines married. Their son lived to see the entire 20th
            century, and began the family&rsquo;s long work in oil and gas
            pipelines — from Alaska to West Texas. Three generations have
            carried <span className="italic">Barker</span> as a middle name.
          </p>

          <p>
            Now we build pipelines of a different sort, too — they run on AI
            and carry attention instead of oil.{" "}
            <span className="text-foreground">
              The work compounds the same way it always did.
            </span>
          </p>

          <p className="text-foreground">A name like that carries a thesis.</p>
        </div>

        <div className="mt-12 space-y-7 text-lg sm:text-xl leading-[1.7] text-foreground/85">
          <p>
            <em className="italic text-foreground">Stark</em>{" "}— for the
            unvarnished truth. The hard look at what's working in a business
            and what isn't. The willingness to say what most agencies won't.
          </p>
          <p>
            <em className="italic text-foreground">Barker</em>{" "}— for the
            voice that carries the truth to the people who need to hear it.
            Marketing only matters when customers hear it. The job is to make
            sure they do.
          </p>
        </div>

        <div className="mt-12 space-y-5 text-xl sm:text-2xl leading-[1.55] tracking-tight text-foreground">
          <p>
            We tell you what's actually true about your business. Then we
            build the pipelines that make sure your market hears it.
          </p>
          <p className="text-muted-foreground italic">
            That's the firm in a sentence.
          </p>
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <Link
          href="/#contact"
          className="group inline-flex items-baseline gap-3 font-sans text-base sm:text-lg text-foreground"
        >
          <span
            aria-hidden="true"
            className="text-accent transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
          <span className="border-b border-border group-hover:border-foreground transition-colors">
            Get in touch
          </span>
        </Link>
      </div>
    </section>
  )
}
