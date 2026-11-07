// Illustrative only: example figures, labelled as such. No real client data.
const ROWS = [
  { label: "Inbox placement", value: "94%" },
  { label: "Replies", value: "41" },
  { label: "Qualified replies", value: "9" },
  // Left blank on purpose: dollar figures stay inside the calculator.
  { label: "Cost per booked meeting", value: null },
]

export function SampleReport() {
  return (
    <figure className="mt-6 rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">Monday report · Week 6</p>
        <span className="rounded border border-accent/60 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-accent">
          Sample report
        </span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {ROWS.map((row) => (
          <div key={row.label}>
            <dt className="text-xs leading-snug text-muted-foreground">{row.label}</dt>
            <dd className="mt-1 font-display text-2xl tabular-nums text-foreground">
              {row.value ?? (
                <>
                  <span aria-hidden="true" className="mt-3 block h-3 w-16 rounded-sm bg-border" />
                  <span className="sr-only">Shown in your own report</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-5 text-[0.7rem] leading-snug text-muted-foreground">
        Example numbers for illustration only. Your report shows your own figures, in writing, every Monday.
      </figcaption>
    </figure>
  )
}
