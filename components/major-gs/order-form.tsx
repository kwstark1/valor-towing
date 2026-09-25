"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Lock, Loader2, Check, AlertTriangle } from "lucide-react"
import {
  ORDER_PRODUCTS,
  ORDER_LBS,
  majorGs,
  normalizeZip,
  isInDeliveryArea,
} from "@/lib/major-gs"

const inputCls =
  "w-full rounded-md border border-white/15 bg-[#1C1C1C] px-4 py-3 text-[#F5F0E8] placeholder:text-[#C8C4BC]/40 focus:border-[#E8621A] focus:outline-none focus:ring-1 focus:ring-[#E8621A]"
const labelCls =
  "block font-[family-name:var(--font-oswald)] text-sm font-semibold uppercase tracking-wide text-[#F5F0E8]"

export function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    product: "",
    lbs: "",
    deliveryDate: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
    company: "", // honeypot
  })

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const zipDigits = normalizeZip(form.zip)
  const zipComplete = zipDigits.length === 5
  const zipInArea = zipComplete && isInDeliveryArea(form.zip)
  const zipOutOfArea = zipComplete && !zipInArea

  const step1Valid = form.product && form.lbs && form.deliveryDate
  const step2Valid = !!(
    form.name &&
    form.email &&
    form.phone &&
    form.address &&
    form.city &&
    zipInArea
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!step2Valid) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/major-gs/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }
      router.push("/major-gs/thank-you")
    } catch {
      setError("Couldn't reach the server. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#C8C4BC]/70">
        <span className={step === 1 ? "text-[#E8621A]" : ""}>1 · Your Order</span>
        <span className="text-[#C8C4BC]/30">———</span>
        <span className={step === 2 ? "text-[#E8621A]" : ""}>2 · Your Info</span>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls} htmlFor="product">
              What would you like?
            </label>
            <select
              id="product"
              className={`${inputCls} mt-2`}
              value={form.product}
              onChange={(e) => set("product", e.target.value)}
            >
              <option value="">Choose a product…</option>
              {ORDER_PRODUCTS.map((p) => (
                <option key={p.value} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="lbs">
              How much? ({majorGs.minOrderLbs} lb minimum)
            </label>
            <select
              id="lbs"
              className={`${inputCls} mt-2`}
              value={form.lbs}
              onChange={(e) => set("lbs", e.target.value)}
            >
              <option value="">Choose pounds…</option>
              {ORDER_LBS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="deliveryDate">
              Preferred delivery date
            </label>
            <input
              id="deliveryDate"
              type="date"
              className={`${inputCls} mt-2`}
              value={form.deliveryDate}
              onChange={(e) => set("deliveryDate", e.target.value)}
            />
            <p className="mt-1 text-xs text-[#C8C4BC]/60">
              We smoke weekly — order by {majorGs.orderByDay} for {majorGs.deliveryDay} delivery.
            </p>
          </div>

          <button
            type="button"
            disabled={!step1Valid}
            onClick={() => setStep(2)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#B0480E] px-8 py-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to Your Info <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className={labelCls} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className={`${inputCls} mt-2`}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`${inputCls} mt-2`}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                className={`${inputCls} mt-2`}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="address">
              Delivery address
            </label>
            <input
              id="address"
              className={`${inputCls} mt-2`}
              placeholder="Street address"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              autoComplete="street-address"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="city">
                City / town
              </label>
              <input
                id="city"
                className={`${inputCls} mt-2`}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="zip">
                ZIP code
              </label>
              <input
                id="zip"
                inputMode="numeric"
                className={`${inputCls} mt-2`}
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
                autoComplete="postal-code"
              />
            </div>
          </div>
          {!zipComplete && (
            <p className="-mt-2 text-xs text-[#C8C4BC]/60">
              We deliver across {majorGs.deliveryArea}. Enter your ZIP to check
              instantly.
            </p>
          )}
          {zipInArea && (
            <p className="-mt-2 flex items-center gap-1.5 text-xs font-medium text-[#8BC34A]">
              <Check className="h-3.5 w-3.5 shrink-0" /> We deliver to {zipDigits} —
              you're in our area.
            </p>
          )}
          {zipOutOfArea && (
            <p className="-mt-2 flex items-start gap-1.5 text-xs text-[#E8915A]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Sorry — {zipDigits} is outside our delivery area right now. Call{" "}
                <a
                  href={majorGs.phoneHref}
                  className="font-semibold underline underline-offset-2"
                >
                  {majorGs.phone}
                </a>{" "}
                and we'll see what we can do.
              </span>
            </p>
          )}

          <div>
            <label className={labelCls} htmlFor="notes">
              Special requests <span className="text-[#C8C4BC]/50">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              className={`${inputCls} mt-2`}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Honeypot — visually hidden, off-screen */}
          <div aria-hidden className="absolute left-[-9999px] top-[-9999px]">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-md border border-[#C0392B]/50 bg-[#C0392B]/10 px-4 py-3 text-sm text-[#F5F0E8]">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-6 py-4 font-[family-name:var(--font-oswald)] font-semibold uppercase tracking-wide text-[#C8C4BC] transition hover:text-[#F5F0E8]"
            >
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
            <button
              type="submit"
              disabled={!step2Valid || submitting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#B0480E] px-8 py-4 font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                </>
              ) : (
                <>Confirm My Order <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </div>

          <p className="flex items-center justify-center gap-2 text-xs text-[#C8C4BC]/60">
            <Lock className="h-3.5 w-3.5" /> We never sell your info. Confirmation
            call from a local number before we deliver.
          </p>
        </div>
      )}
    </form>
  )
}
