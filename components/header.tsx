import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background-deep/85 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:h-24 sm:px-8">
        <Link href="/" className="flex items-center gap-4" aria-label="Stark & Barker — home">
          {/*
            sb-logo placeholder slot.
            TODO: once Ken drops the gold monogram at /public/images/sb-logo.png (or .svg),
            replace this <div> with:
              <Image src="/images/sb-logo.png" alt="Stark & Barker" width={48} height={48} priority />
            and delete the placeholder markup.
          */}
          <div
            id="sb-logo"
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-sm border border-primary/60 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-primary sm:h-12 sm:w-12"
          >
            sb-logo
          </div>
          <span className="font-sans text-lg font-bold uppercase tracking-[0.22em] text-foreground sm:text-xl">
            Stark <span className="text-primary">&amp;</span> Barker
          </span>
        </Link>

        <nav>
          <Link
            href="/about"
            className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
