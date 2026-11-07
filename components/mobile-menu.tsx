"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { buttonClasses } from "@/components/button"
import { calculatorHref } from "@/site.config"

export function MobileMenu({ items }: { items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const close = () => setOpen(false)
  const linkClass = "text-base font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:border-foreground transition-colors"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
          {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
        </svg>
      </button>

      {open ? (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-border bg-background">
          <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:px-8">
            {items.map((item) =>
              item.href.includes("#") ? (
                <a key={item.href} href={item.href} onClick={close} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} onClick={close} className={linkClass}>
                  {item.label}
                </Link>
              ),
            )}
            <a href={calculatorHref()} onClick={close} className={buttonClasses("md", "self-start")}>
              See if you&rsquo;re a fit
            </a>
          </nav>
        </div>
      ) : null}
    </>
  )
}
