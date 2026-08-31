import Link from "next/link"

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:px-8 sm:pt-24 sm:pb-32"
    >
      <div className="mb-10 h-px w-16 bg-primary/60 sm:mb-14" aria-hidden="true" />

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
        About the Firm
      </p>

      <h1 className="mt-6 font-sans text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
        The firm is named for two Texas families.
      </h1>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85 sm:mt-14 sm:space-y-7 sm:text-lg">
        <p>
          The Starks came up through East Texas before the Civil War. The
          Barkers came up through Brazos County, alongside the Millicans, who
          founded the town of Millican itself when it was still the end of the
          railroad line. In 1920, the two lines married. Their son lived to
          see the entire 20th century, and began the family&rsquo;s long work
          in oil and gas pipelines — from Alaska to West Texas. The{" "}
          <em className="italic text-foreground">Barker</em> name has been
          carried through the Stark family for generations.
        </p>

        <p>
          Now we build pipelines of a different sort, too — they carry
          attention instead of oil.{" "}
          <span className="text-foreground">
            The work compounds the same way it always did.
          </span>
        </p>

        <p className="text-foreground">A name like that carries a thesis.</p>
      </div>

      <div className="mt-14 space-y-6 text-base leading-relaxed text-foreground/85 sm:mt-16 sm:space-y-7 sm:text-lg">
        <p>
          <em className="italic text-foreground">Stark</em>{" "}— for the
          unvarnished truth. Reports that don&rsquo;t soften the numbers, even
          when the misses are ours to fix.
        </p>
        <p>
          <em className="italic text-foreground">Barker</em>{" "}— for the voice
          that carries the truth to your customers. Marketing only matters
          when it lands. The job is to make sure it does.
        </p>
      </div>

      <div className="mt-14 space-y-4 text-lg font-medium leading-snug text-foreground sm:mt-16 sm:text-2xl">
        <p>
          You see what&rsquo;s actually working — in numbers, not narratives.
          Then we build the pipelines that make sure your market hears it.
        </p>
        <p className="italic font-normal text-muted-foreground">
          That&rsquo;s the firm in a sentence.
        </p>
      </div>

      <div className="mt-16 sm:mt-20">
        <Link
          href="/#audit-form"
          className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90 sm:text-lg"
        >
          Find My Biggest Revenue Leak
        </Link>
      </div>
    </section>
  )
}
