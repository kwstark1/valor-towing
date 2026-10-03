import { RuleLabel } from "@/components/rule-label"
import { ContactForm } from "@/components/contact-form"
import { EmailCta } from "@/components/email-cta"

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
    </section>
  )
}
