"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { majorGs, NAV_LINKS } from "@/lib/major-gs"

export function MajorGsNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#1C1C1C]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="#top"
          className="font-[family-name:var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-[#F5F0E8]"
        >
          {majorGs.brand}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#C8C4BC] transition-colors hover:text-[#F5F0E8]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/major-gs/order"
            className="rounded-md bg-[#B0480E] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            Order Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[#F5F0E8] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-[#1C1C1C] px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-[#C8C4BC] hover:text-[#F5F0E8]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/major-gs/order"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-[#B0480E] px-4 py-3 text-center text-base font-semibold uppercase tracking-wide text-white"
            >
              Order Now
            </Link>
            <a
              href={majorGs.phoneHref}
              className="mt-1 flex items-center justify-center gap-2 py-2 text-sm text-[#E8621A]"
            >
              <Phone className="h-4 w-4" /> {majorGs.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
