import Link from "next/link"
import {
  Flame,
  Truck,
  Snowflake,
  Users,
  Check,
  ArrowRight,
  Star,
  Phone,
  Mail,
} from "lucide-react"
import {
  majorGs,
  TRUST_BADGES,
  HOW_IT_WORKS,
  reviews,
} from "@/lib/major-gs"
import { MajorGsNav } from "@/components/major-gs/nav"
import { MajorGsFaq } from "@/components/major-gs/faq"
import { ImagePlaceholder } from "@/components/major-gs/image-placeholder"

const BADGE_ICONS = [Flame, Truck, Snowflake, Users]

// Availability copy: dynamic when current, evergreen fallback when not — a stale
// date is a worse trust signal than no date (spec, Energy layer).
const availabilityLine = majorGs.availabilityIsCurrent
  ? `Next delivery: ${majorGs.deliveryDay} · Order by ${majorGs.orderByDay}`
  : `Fresh brisket smoked & delivered weekly — call ${majorGs.phone} to reserve your pounds`

const announcementLine = majorGs.availabilityIsCurrent
  ? `🔥 This week's batch: ${majorGs.deliveryDay} delivery — ${majorGs.lbsRemaining} lbs left. Order by ${majorGs.orderByDay}.`
  : `🔥 Fresh brisket smoked & delivered weekly — call to reserve your pounds.`

const showReviewWidget =
  majorGs.currentReviewCount >= majorGs.reviewThreshold && majorGs.googleReviewsUrl

export default function MajorGsHomePage() {
  return (
    <main id="top" className="font-sans">
      {/* 1 — ANNOUNCEMENT BAR (text-safe ember #B0480E, white text ≈5.6:1) */}
      <div className="bg-[#B0480E] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-5 py-2.5 text-center text-sm font-medium sm:flex-row sm:gap-3">
          <span>{announcementLine}</span>
          <a
            href={majorGs.phoneHref}
            className="font-semibold underline-offset-2 hover:underline"
          >
            Call: {majorGs.phone}
          </a>
        </div>
      </div>

      {/* 2 — NAV (sticky) */}
      <MajorGsNav />

      {/* 3 — HERO */}
      <section className="bg-[#1C1C1C] px-5 py-6 md:py-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="font-[family-name:var(--font-oswald)] text-sm font-semibold uppercase tracking-[0.2em] text-[#E8621A]">
              {majorGs.city} · Fresh-Smoked Weekly
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-oswald)] text-4xl font-bold leading-[1.05] text-[#F5F0E8] sm:text-5xl">
              Real Texas Brisket. Smoked Low and Slow in {majorGs.city}.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#C8C4BC]">
              Hand-trimmed, slow-smoked Texas-style beef brisket — sold fresh by
              the pound and delivered to your door across {majorGs.deliveryArea}.
              Order for your family cookout, your next event, or your restaurant.
            </p>
            <p className="mt-4 font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wide text-[#E8621A]">
              {availabilityLine}
            </p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <Link
                href="/major-gs/order"
                className="inline-flex items-center gap-2 rounded-md bg-[#B0480E] px-12 py-4 font-[family-name:var(--font-oswald)] text-lg font-bold uppercase tracking-wide text-white transition hover:scale-[1.02] hover:brightness-110"
              >
                Order My Brisket <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#wholesale"
                className="text-sm font-medium text-[#C8C4BC] underline-offset-4 hover:text-[#F5F0E8] hover:underline"
              >
                Wholesale &amp; bulk pricing →
              </a>
            </div>
          </div>
          <ImagePlaceholder
            label="Hero — brisket sliced with smoke ring, Major G's hands in frame (the moment of craft)"
            aspect="aspect-[4/3]"
          />
        </div>
      </section>

      {/* 4 — TRUST BADGES (warm smoky alt bg) — extra top lead-in so only the
          brown banner crests the fold, not the icon tops */}
      <section className="bg-[#2B2418] px-5 pt-24 pb-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {TRUST_BADGES.map((b, i) => {
            const Icon = BADGE_ICONS[i]
            return (
              <div key={b.title} className="flex flex-col items-center text-center">
                <Icon className="h-7 w-7 text-[#E8621A]" aria-hidden />
                <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-base font-semibold uppercase tracking-wide text-[#F5F0E8]">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-[#C8C4BC]">{b.copy}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5 — PRODUCT */}
      <section id="product" className="bg-[#1C1C1C] px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <ImagePlaceholder label="Product — whole brisket + sliced flat, labeled 'by the lb'" />
          <div>
            <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
              Real Texas Brisket. No Shortcuts.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#C8C4BC]">
              Whole-packer beef brisket, hand-trimmed and smoked over real wood
              for 12+ hours — low and slow, the way it's done in Texas. We slice
              it fresh the day it's delivered. Never frozen, never rushed.
            </p>
            <div className="mt-6 rounded-lg border border-white/10 bg-[#2B2418] p-5">
              <p className="text-sm uppercase tracking-wide text-[#C8C4BC]/70">
                By the pound
              </p>
              <p className="mt-1 font-[family-name:var(--font-oswald)] text-3xl font-bold text-[#F5F0E8]">
                ${majorGs.pricePerLb.toFixed(2)}
                <span className="text-lg font-medium text-[#C8C4BC]">/lb</span>
              </p>
              <p className="mt-1 text-xs text-[#C8C4BC]/60">
                {majorGs.minOrderLbs} lb minimum · free delivery over $
                {majorGs.freeDeliveryOver} · bulk &amp; event pricing on larger
                orders
              </p>
            </div>
            <Link
              href="/major-gs/order"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#B0480E] px-10 py-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-white transition hover:scale-[1.02] hover:brightness-110"
            >
              Order My Brisket <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 — SOCIAL PROOF (hide-until-N: quote cards now, live widget once earned) */}
      <section id="social-proof" className="bg-[#2B2418] px-5 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
            What {majorGs.county} Is Saying
          </h2>

          {showReviewWidget ? (
            // Live Google Reviews widget slot (appears once count >= threshold).
            <div className="mt-10" data-google-reviews={majorGs.googleReviewsUrl} />
          ) : (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {reviews.map((r, i) => (
                  <figure
                    key={i}
                    className="rounded-lg border border-white/10 bg-[#1C1C1C] p-6 text-left"
                  >
                    <div className="flex gap-0.5 text-[#D4A853]">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-3 text-[#C8C4BC]">
                      “{r.quote}”
                    </blockquote>
                    <figcaption
                      className={`mt-3 text-sm font-medium ${
                        r.placeholder ? "text-[#E8621A]/70" : "text-[#F5F0E8]"
                      }`}
                    >
                      — {r.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-6 text-xs text-[#C8C4BC]/50">
                Founder-collected quotes shown until our Google reviews go live
                (at {majorGs.reviewThreshold}+).
              </p>
            </>
          )}

          <Link
            href="/major-gs/order"
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-[#B0480E] px-10 py-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-white transition hover:scale-[1.02] hover:brightness-110"
          >
            Order Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* 7 — FOUNDER */}
      <section id="founder" className="bg-[#1C1C1C] px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <ImagePlaceholder label="Founder — Major G at the smoker, candid (not corporate). Process video drops in here once shot." />
          <div>
            <p className="font-[family-name:var(--font-oswald)] text-sm font-semibold uppercase tracking-[0.2em] text-[#E8621A]">
              The Man Behind the Smoke
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
              Meet Major G.
            </h2>
            <div className="mt-5 space-y-4 text-[#C8C4BC] leading-relaxed">
              <p>
                {/* Problem */}
                Good brisket was hard to find in {majorGs.county} — plenty of
                barbecue, but not the real Texas-style, all-day-smoked brisket
                Major G grew up on.
              </p>
              <p>
                {/* Journey → Method */}
                So he built it himself: years at the smoker, dialing in the trim,
                the wood, and the 12+ hour cook until the bark and smoke ring came
                out right every single time.
              </p>
              <p>
                {/* Mission */}
                Now he smokes fresh weekly for families, events, and local
                kitchens across {majorGs.county} — one honest batch at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 — HOW IT WORKS */}
      <section className="bg-[#2B2418] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B0480E] font-[family-name:var(--font-oswald)] text-2xl font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-oswald)] text-xl font-semibold uppercase text-[#F5F0E8]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[#C8C4BC] leading-relaxed">{s.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/major-gs/order"
              className="inline-flex items-center gap-2 rounded-md bg-[#B0480E] px-10 py-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-white transition hover:scale-[1.02] hover:brightness-110"
            >
              Order My Brisket <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9 — B2B CALLOUT (forest green break, gold CTA with dark text ≈8.3:1) */}
      <section id="wholesale" className="bg-[#1E2D1F] px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
            Wholesale &amp; Bulk Brisket for Restaurants, Caterers &amp; Events
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Reliable weekly supply",
              "Bulk pricing",
              `${majorGs.county} & surrounding`,
            ].map((c) => (
              <div
                key={c}
                className="flex items-center justify-center gap-2 rounded-md bg-white/5 px-4 py-3 text-[#F5F0E8]"
              >
                <Check className="h-5 w-5 text-[#D4A853]" /> {c}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${majorGs.ordersEmail}?subject=Wholesale%20%26%20bulk%20inquiry`}
              className="inline-flex items-center gap-2 rounded-md bg-[#D4A853] px-10 py-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-[#1C1C1C] transition hover:scale-[1.02] hover:brightness-105"
            >
              <Mail className="h-5 w-5" /> Talk Wholesale &amp; Bulk
            </a>
            <a
              href={majorGs.phoneHref}
              className="inline-flex items-center gap-2 font-medium text-[#F5F0E8] hover:underline"
            >
              <Phone className="h-4 w-4 text-[#D4A853]" /> Or call: {majorGs.phone}
            </a>
          </div>
        </div>
      </section>

      {/* 10 — FAQ */}
      <section className="bg-[#1C1C1C] px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
            Questions, Answered
          </h2>
          <MajorGsFaq />
        </div>
      </section>

      {/* 11 — FINAL CTA (full-width text-safe ember) */}
      <section className="bg-[#B0480E] px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-white sm:text-4xl">
          Ready for the Best Brisket in {majorGs.county}?
        </h2>
        <Link
          href="/major-gs/order"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-12 py-5 font-[family-name:var(--font-oswald)] text-lg font-bold uppercase tracking-wide text-[#B0480E] transition hover:scale-[1.02]"
        >
          Order My Brisket <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* 12 — FOOTER */}
      <footer id="footer" className="bg-[#111111] px-5 pb-10 pt-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <p className="font-[family-name:var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-[#F5F0E8]">
              {majorGs.brand}
            </p>
            <p className="mt-2 text-sm text-[#C8C4BC]/70">
              {majorGs.tagline} · {majorGs.city}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-oswald)] text-sm font-semibold uppercase tracking-wide text-[#F5F0E8]">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#C8C4BC]">
              <li><Link href="/major-gs/order" className="hover:text-[#F5F0E8]">Order</Link></li>
              <li><a href="#wholesale" className="hover:text-[#F5F0E8]">Wholesale</a></li>
              <li><a href="#founder" className="hover:text-[#F5F0E8]">Our Story</a></li>
            </ul>
          </div>
          <div>
            <p className="font-[family-name:var(--font-oswald)] text-sm font-semibold uppercase tracking-wide text-[#F5F0E8]">
              Delivery &amp; Orders
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#C8C4BC]">
              <li>Delivering across {majorGs.deliveryArea}</li>
              <li>
                <a href={majorGs.phoneHref} className="hover:text-[#F5F0E8]">
                  {majorGs.phone}
                </a>
              </li>
              <li>Delivery: {majorGs.deliveryDay} · Order by {majorGs.orderByDay}</li>
            </ul>
          </div>
          <div>
            <p className="font-[family-name:var(--font-oswald)] text-sm font-semibold uppercase tracking-wide text-[#F5F0E8]">
              Get notified before each batch sells out
            </p>
            <a
              href="/major-gs/order"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#B0480E] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Notify Me <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-[#C8C4BC]/40">
          © {majorGs.brand}. {majorGs.tagline}, {majorGs.city}.
        </p>
      </footer>
    </main>
  )
}
