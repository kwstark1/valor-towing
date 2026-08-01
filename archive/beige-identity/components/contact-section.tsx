import { RuleLabel } from "@/components/rule-label"
import { ContactForm } from "@/components/contact-form"
import { EmailCta } from "@/components/email-cta"

const socials = [
  { name: "LinkedIn", href: "https://linkedin.com/company/starkandbarker" },
  { name: "X", href: "https://x.com/Stark_Barker" },
  { name: "YouTube", href: "https://www.youtube.com/@stark_barker" },
  { name: "Instagram", href: "https://www.instagram.com/starkandbarker/" },
  { name: "Threads", href: "https://www.threads.com/@starkandbarker" },
  { name: "Facebook", href: "https://www.facebook.com/61589220008543/" },
]

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 scroll-mt-32"
    >
      <RuleLabel>Get in Touch</RuleLabel>

      <p className="mt-14 sm:mt-20 max-w-2xl font-display text-xl sm:text-2xl leading-[1.5] tracking-tight text-foreground">
        For new engagements, partnership inquiries, or to be on the list for{" "}
        <span className="italic">The Stark &amp; Barker Memo</span>
        <span className="text-muted-foreground">
          {" "}— a weekly intelligence brief on the frameworks, quiet edges,
          and plays serious operators use to compound revenue. Coming Soon.
        </span>
      </p>

      <div className="mt-12 sm:mt-16">
        <ContactForm />
      </div>

      <div className="mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm text-muted-foreground">
        <span>Or write directly:</span>
        <EmailCta />
      </div>

      <ul className="mt-16 sm:mt-20 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-sans uppercase tracking-[0.18em]">
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
    </section>
  )
}
