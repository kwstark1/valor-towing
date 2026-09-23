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
      <div className="border-t border-border pt-8 sm:pt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
    </footer>
  )
}
