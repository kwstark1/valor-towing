export function HeroSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32">
      <h1 className="font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        Your business does not need more marketing activity. It needs a{" "}
        <span className="text-primary">revenue system</span> you can actually
        trust.
      </h1>

      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-foreground/85 sm:mt-10 sm:text-xl">
        If you are still relying on referrals, scattered campaigns, and reports
        that explain what happened after the money is gone, Stark &amp; Barker
        helps you find the leaks, fix the message, and build a clearer path
        from attention to revenue.
      </p>

      <div className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          You did not build your business so an agency could hand you a
          confusing report and ask for another month.
        </p>
        <p>
          You built it to create dependable revenue, take care of your people,
          provide for your family, and eventually have the freedom to step
          away without everything slowing down.
        </p>
        <p>
          The problem is not that you need to become a full-time marketer. The
          problem is that your marketing has never been turned into a simple
          system with a clear offer, a clear path, and clear next actions.
        </p>
        <p>
          The next step is not more theory. It is finding where your revenue
          is leaking, and fixing the one that matters most.
        </p>
      </div>

      <div className="mt-12 sm:mt-14">
        <a
          href="#audit-form"
          className="group inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90 sm:text-lg"
        >
          Find My Biggest Revenue Leak
        </a>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          See what is holding your growth back and what to fix first.
        </p>
      </div>
    </section>
  )
}
