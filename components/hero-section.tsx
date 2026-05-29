import Link from "next/link"

export function HeroSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-8 pt-28 sm:pt-40 pb-24 sm:pb-32">
      <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight text-foreground">
        Marketing systems
        <br />
        that compound.
      </h1>

      <p className="mt-8 sm:mt-10 max-w-2xl text-lg sm:text-xl leading-[1.55] text-muted-foreground">
        We build and run the client pipelines that bring operators selling
        serious work a steady flow of qualified conversations — month over
        month, compounding.
      </p>

      <div className="mt-10 sm:mt-12">
        <Link
          href="#contact"
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
