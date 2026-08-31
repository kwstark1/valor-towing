# Navy + gold funnel archive

## What this is

Full snapshot of the deep-navy + gold Hook / Story / Offer funnel that briefly ran as `starkandbarker.com`. The site shipped:

- Palette: navy gradient `#122741 → #0A1626`, gold accent `#D28B4A`, off-white text `#F3EEE6`, slate muted text `#8FA0B4`
- Typography: Inter throughout, weight-varied (400 body, 700 headings, 800 display)
- Structure: hero Hook, operator-mirror Story, six-step Growth System offer, page close, audit-request form
- Backend: `/api/audit` Resend-backed endpoint (name / business / website / email / frustration + honeypot), delivers to `pipelines@starkandbarker.com`
- Single conversion action: `#audit-form` (both hero and offer CTAs scroll there)

Rolled back to the beige/Fraunces identity per Ken's decision. Preserved here for future use as a **dedicated funnel landing page** (e.g. `/audit` or `/growth-system`) alongside the beige main site, not to become the primary brand again.

## What's here

- `app/globals.css` — navy/gold palette tokens (hex values, gradient background applied via `@layer base` on `body`)
- `app/layout.tsx` — Inter-only font import, dark theme color, GA + Vercel Analytics wired
- `app/page.tsx` — composes the funnel sections in order
- `app/api/audit/route.ts` — Resend-backed audit form endpoint; reads `RESEND_API_KEY`, `CONTACT_FROM_ADDRESS`, `CONTACT_TO_ADDRESS`
- `components/header.tsx`, `footer.tsx` — navy sans wordmark treatment
- `components/about-section.tsx` — heritage/*Stark*/*Barker* copy restyled in Inter/navy
- `components/hero-section.tsx` — Hook (Section 1)
- `components/story-section.tsx` — Operator-mirror story (Section 2, replaces earlier founder-story component from `archive/founder-story-section/`)
- `components/offer-section.tsx` — Six-step Growth System offer (Section 3, contains the prominent `[CONFIRM: swap exact services]` block comment)
- `components/close-section.tsx` — Page close (Section 4)
- `components/audit-form.tsx` — Audit form + section wrapper (Section 5), react-hook-form + zod, honeypot, `sendGAEvent("event", "generate_lead", { method: "audit_form" })` on success

## Deploying as a separate funnel page (future work)

To use this content as a dedicated landing page (e.g. `/audit`) **alongside** the beige main site without breaking either:

1. **Create a new route** with a route group so it can carry its own layout and palette:
   ```
   app/(navy)/audit/page.tsx
   app/(navy)/layout.tsx    ← navy-scoped layout, imports Inter, sets navy theme, wraps in a themed div
   ```
2. **Copy or re-import components** from this archive into `components/growth/` (or leave them here and import directly — either works). Avoid re-using the beige `components/hero-section.tsx` name; rename to `growth-hero.tsx` etc. so they don't collide.
3. **Restore `app/api/audit/route.ts`** to its live path so the form can POST there.
4. **Scope the palette** — the navy/gold tokens must apply *only* under the funnel route. Two clean options:
   - **Route-group layout with scoped `<style>`:** `app/(navy)/layout.tsx` renders a `<div className="theme-navy">` wrapper with a `<style>` block redefining the color CSS variables under that class.
   - **Data-attribute switch:** in `app/globals.css`, add a `[data-theme="navy"]` selector that overrides the beige tokens with the navy set from this archive. Then wrap the funnel page in `<div data-theme="navy">`.
5. **Duplicate or theme-adapt** `<Header />` and `<Footer />` — the navy versions here have different chrome from the beige site's; if the funnel page should carry its own header/footer, import the navy ones from this archive; otherwise reuse the beige ones.
6. **CTAs must still point at the form** — the navy CTAs use plain `<a href="#audit-form">` (not Next `<Link>`) to fix a same-page anchor scroll issue on Next.js App Router. Preserve that pattern.
7. **CTA copy consistency** — if this funnel page is served alongside the beige site, decide whether the beige site's `/#contact` CTA and the funnel's `#audit-form` CTA both route to the audit form, or whether they remain separate lead capture surfaces.

## What made this identity work as a funnel (worth preserving as a pattern)

- **Outcome-first Hook** — leads with the visitor's problem (*"revenue system you can actually trust"*), not the firm's activity.
- **Operator-mirror Story** — reflects the reader's situation back to them (*"You built a business that works, but marketing is the one place it still leaves you guessing"*) rather than telling a founder's origin story. Founder story archived separately at `archive/founder-story-section/` for reference.
- **Six-step Growth System** — plain-language framework, not agency-jargon.
- **Single conversion action** — every CTA scrolls to the same audit form. No competing conversion surfaces.
- **Cost-of-waiting section** — drains-your-growth framing without alarmism.
- **AI-invisible copy** — no mention of AI as the fulfillment mechanism, per the cold-side rule.

## Restoring the navy/gold identity as the main site

If you ever want to swing back to this as `starkandbarker.com`'s primary identity (the reverse of what just happened):

1. Reverse of the current restore. Snapshot the beige live state to `archive/beige-identity-v2/` (or similar), then copy every file in `archive/navy-gold-funnel/` back to its live path:
   - `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/api/audit/route.ts`
   - All eight component files
2. Delete the beige-only components that would no longer be imported (`the-work-section.tsx`, `contact-section.tsx`, `contact-form.tsx`, `email-cta.tsx`, `rule-label.tsx`) and `app/api/contact/route.ts`.
3. Push to `main`.

The beige archive at `archive/beige-identity/` remains intact and provides the reverse path.
