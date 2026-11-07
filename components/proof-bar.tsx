import { PROOF, SHOW_PROOF } from "@/site.config"

// Renders nothing until SHOW_PROOF is on and PROOF holds real, approved logos and results.
export function ProofBar() {
  if (!SHOW_PROOF || (PROOF.logos.length === 0 && PROOF.stats.length === 0)) return null

  return (
    <section aria-label="Results" className="mx-auto max-w-3xl px-6 sm:px-8 pb-16">
      {PROOF.stats.length > 0 ? (
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {PROOF.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-3xl tabular-nums text-foreground">{stat.value}</dd>
              <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>
      ) : null}
      {PROOF.logos.length > 0 ? (
        <ul className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 opacity-80">
          {PROOF.logos.map((logo) => (
            <li key={logo.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.name} className="h-7 w-auto" />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
