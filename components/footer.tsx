const socials = [
  { name: "LinkedIn", href: "https://linkedin.com/company/starkandbarker" },
  { name: "X", href: "https://x.com/Stark_Barker" },
  { name: "YouTube", href: "https://www.youtube.com/@stark_barker" },
  { name: "Instagram", href: "https://www.instagram.com/starkandbarker/" },
  { name: "Threads", href: "https://www.threads.com/@starkandbarker" },
  { name: "Facebook", href: "https://www.facebook.com/61589220008543/" },
]

const legalLinks = [
  {
    name: "Privacy",
    href: "https://www.privacypolicies.com/live/5f9bc43b-bef0-4dd1-8eaa-eaedd4a9b9a6",
  },
  {
    name: "Terms",
    href: "https://www.privacypolicies.com/live/629cd7c1-664d-4552-a078-f2e4640b0238",
  },
]

export function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-6 sm:px-8 pb-12 sm:pb-16">
      <div className="border-t border-border pt-8 sm:pt-10 space-y-8 sm:space-y-10">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-sans uppercase tracking-[0.18em]">
          {socials.map((s, i) => (
            <li key={s.name} className="flex items-center gap-x-6">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {s.name}
              </a>
              {i < socials.length - 1 && (
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>© 2026 Stark &amp; Barker</span>
          <nav aria-label="Legal" className="flex items-center gap-x-3">
            {legalLinks.map((link, i) => (
              <span key={link.name} className="flex items-center gap-x-3">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
                {i < legalLinks.length - 1 && (
                  <span aria-hidden="true" className="text-border">
                    ·
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
