# Beige-identity archive

Full snapshot of the previous Stark & Barker visual identity — warm beige palette + Fraunces display serif + editorial voice + three-pillar service structure (Measurement / Production / Pipeline).

Archived on the branch that introduced the navy + gold rebrand. Preserved verbatim so it can be restored later without git spelunking.

## What's here

### Components moved out of `components/` (no longer used by the live site)
- `components/hero-section.tsx` — old homepage hero ("The client pipeline that compounds — qualified conversations every month…")
- `components/the-work-section.tsx` — three-pillar Work section (Measurement / Production / Pipeline)
- `components/contact-section.tsx` — old inline contact section with socials and click-to-copy email
- `components/rule-label.tsx` — hairline-rule label used above each section (editorial motif)
- `components/email-cta.tsx` — click-to-copy email CTA
- `components/contact-form.tsx` — react-hook-form + zod contact form that submitted to `/api/contact`

### API route moved out
- `app/api/contact/route.ts` — Resend-backed endpoint the old contact form posted to (`name`, `email`, `message`, honeypot `company`)

### Snapshots (originals still exist at their live paths, overwritten with the navy/gold identity)
- `components/header.tsx` — beige header with Fraunces wordmark
- `components/footer.tsx` — beige footer
- `components/about-section.tsx` — beige About page section
- `app/page.tsx` — old homepage composition
- `app/globals.css` — old palette tokens (warm beige `oklch(0.93 0.025 85)` background, deep ink foreground, muted oxblood accent)
- `app/layout.tsx` — old font imports (Fraunces + Inter)

## Restoring the beige identity

If you want to roll back to this identity:

1. Copy `archive/beige-identity/app/globals.css` → `app/globals.css` (restores palette tokens)
2. Copy `archive/beige-identity/app/layout.tsx` → `app/layout.tsx` (restores Fraunces + Inter font imports)
3. Copy `archive/beige-identity/app/page.tsx` → `app/page.tsx`
4. Copy every file in `archive/beige-identity/components/` → `components/` (overwriting the current navy/gold versions of `header.tsx`, `footer.tsx`, `about-section.tsx`, and re-adding the ones that were only in the archive)
5. Move `archive/beige-identity/app/api/contact/route.ts` back to `app/api/contact/route.ts`

At that point the site renders exactly as it did before the rebrand. You may also want to remove the new navy/gold `components/` files (`hero-section.tsx`, `story-section.tsx`, `offer-section.tsx`, `close-section.tsx`, `audit-form.tsx`) and the new `app/api/audit/route.ts` since they'll no longer be referenced.
