import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { majorGs } from "@/lib/major-gs"
import { OrderForm } from "@/components/major-gs/order-form"

export const metadata: Metadata = {
  title: "Order My Brisket",
  description: `Order fresh Texas-style brisket by the pound, delivered across ${majorGs.deliveryArea}.`,
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-[#1C1C1C] px-5 py-12 font-sans">
      <div className="mx-auto max-w-xl">
        <Link
          href="/major-gs"
          className="inline-flex items-center gap-1.5 text-sm text-[#C8C4BC] hover:text-[#F5F0E8]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {majorGs.brand}
        </Link>

        <h1 className="mt-6 font-[family-name:var(--font-oswald)] text-3xl font-bold uppercase text-[#F5F0E8] sm:text-4xl">
          Order My Brisket
        </h1>
        <p className="mt-2 text-[#C8C4BC]">
          Two quick steps. No payment now — we call to confirm your order &amp;
          payment within 24 hours.
        </p>

        <div className="mt-8 rounded-xl border border-white/10 bg-[#2B2418] p-6 sm:p-8">
          <OrderForm />
        </div>
      </div>
    </main>
  )
}
