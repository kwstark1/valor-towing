import { FitButton } from "@/components/button"

export function HeroSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-8 pt-24 sm:pt-36 pb-24 sm:pb-32">
      <p className="font-sans text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-accent">
        Performance-based B2B cold email
      </p>

      <h1 className="mt-5 sm:mt-6 font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-foreground">
        Marketing systems
        <br />
        that compound.
      </h1>

      <p className="mt-8 sm:mt-10 max-w-2xl text-lg sm:text-xl leading-[1.55] text-muted-foreground">
        The client pipeline that compounds with qualified conversations every
        month, built and run for operators selling serious work.
      </p>

      <div className="mt-10 sm:mt-12">
        <FitButton />
      </div>

      {/* Stacks below lg; one dotted line from lg up, where the column is wide enough for all three. */}
      <p className="mt-5 flex flex-col gap-y-1 lg:flex-row lg:flex-wrap lg:gap-x-3 text-sm text-muted-foreground lg:[&>span]:whitespace-nowrap">
        <span>You pay for meetings that happen</span>
        <span aria-hidden="true" className="hidden lg:inline text-border">
          ·
        </span>
        <span>Sending setup at cost</span>
        <span aria-hidden="true" className="hidden lg:inline text-border">
          ·
        </span>
        <span>Results reported in writing every Monday</span>
      </p>
    </section>
  )
}
