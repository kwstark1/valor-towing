export function RuleLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span className="font-sans text-[0.7rem] uppercase tracking-[0.22em]">
        {children}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
