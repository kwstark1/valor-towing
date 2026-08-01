import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-sm border-b border-border/60">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="flex items-center justify-between h-28 sm:h-32">
          <Link
            href="/"
            className="font-display text-5xl sm:text-6xl leading-none tracking-tight text-foreground"
            aria-label="Stark & Barker — home"
          >
            Stark <span className="text-muted-foreground font-normal">&amp;</span> Barker
          </Link>

          <nav>
            <Link
              href="/about"
              className="text-sm font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
