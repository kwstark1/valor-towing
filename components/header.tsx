import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background-deep/85 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:h-24 sm:px-8">
        {/*
          Wordmark. If a gold monogram image ever ships to /public/images/sb-logo.png,
          wrap this Link's contents in a flex row and add an <Image> before the span.
        */}
        <Link
          href="/"
          className="font-sans text-lg font-bold uppercase tracking-[0.22em] text-foreground sm:text-xl"
          aria-label="Stark & Barker — home"
        >
          Stark <span className="text-primary">&amp;</span> Barker
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
