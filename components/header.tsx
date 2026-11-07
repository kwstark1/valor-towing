import Link from "next/link"
import { FitButton } from "@/components/button"
import { MobileMenu } from "@/components/mobile-menu"

export const NAV_ITEMS = [
  { label: "How it works", href: "/#the-work" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/#faq" },
]

export const navLinkClass =
  "text-sm font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-sm border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex items-center justify-between gap-6 h-28 sm:h-32">
          <Link
            href="/"
            className="font-display text-5xl sm:text-6xl leading-none tracking-tight text-foreground"
            aria-label="Stark & Barker — home"
          >
            Stark <span className="text-muted-foreground font-normal">&amp;</span> Barker
          </Link>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.href.includes("#") ? (
                <a key={item.href} href={item.href} className={navLinkClass}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={navLinkClass}>
                  {item.label}
                </Link>
              ),
            )}
            <FitButton size="sm" />
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <div className="hidden md:block">
              <FitButton size="sm" />
            </div>
            <MobileMenu items={NAV_ITEMS} />
          </div>
        </div>
      </div>
    </header>
  )
}
