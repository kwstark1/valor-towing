import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Check, Phone } from "lucide-react"
import { majorGs } from "@/lib/major-gs"

export const metadata: Metadata = {
  title: "Order Request Received",
  robots: { index: false },
}

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1C1C1C] px-5 py-16 font-sans">
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[#E8621A]" />
        <h1 className="mt-6 font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
          Your Order Request Is In!
        </h1>
        <p className="mt-3 text-lg text-[#C8C4BC]">
          We'll call you at the number you gave us within 24 hours to confirm
          your order &amp; payment.
        </p>

        <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
          {[
            "We'll call to confirm your order",
            `Delivered ${majorGs.deliveryDay} to your door`,
            "Fresh-sliced and ready",
          ].map((c) => (
            <li key={c} className="flex items-center gap-3 text-[#C8C4BC]">
              <Check className="h-5 w-5 shrink-0 text-[#D4A853]" /> {c}
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-lg border border-white/10 bg-[#2B2418] p-5">
          <p className="text-sm text-[#C8C4BC]">
            Want a heads-up before each weekly batch sells out? You're already on
            the list — we'll text you when the next drop is live.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/major-gs"
            className="font-medium text-[#E8621A] hover:underline"
          >
            ← Back to {majorGs.brand}
          </Link>
          <a
            href={majorGs.phoneHref}
            className="inline-flex items-center gap-2 text-[#C8C4BC] hover:text-[#F5F0E8]"
          >
            <Phone className="h-4 w-4 text-[#D4A853]" /> Questions? {majorGs.phone}
          </a>
        </div>
      </div>
    </main>
  )
}
