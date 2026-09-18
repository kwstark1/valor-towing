"use client"

import { useState } from "react"
import { Button } from "./ui"

const inputClass =
  "mt-2 w-full rounded-md border border-border bg-transparent px-4 py-3 text-base text-foreground placeholder-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"

export function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("") // honeypot, matches the existing contact form
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!first.trim() || !last.trim()) return setError("Need your first and last name.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("That email doesn't look right.")
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${first.trim()} ${last.trim()}`,
          email: email.trim(),
          message: `Opened The Pipeline Math.${phone.trim() ? ` Phone: ${phone.trim()}` : " No phone given."}`,
          company,
          source: "pipeline-math",
          phone: phone.trim() || undefined,
        }),
      })
      if (res.ok || res.status >= 500) {
        // A server-side email problem is ours, not theirs. Don't make them wait on it.
        onUnlock()
        return
      }
      const data = await res.json().catch(() => ({}))
      setError((data as { error?: string })?.error || "Something went wrong. Try again.")
      setStatus("error")
    } catch {
      // Network failure: same rule, our problem.
      onUnlock()
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
      <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">A free tool from Stark &amp; Barker</p>
      <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">The Pipeline Math</h1>
      <p className="mt-5 text-lg leading-relaxed text-foreground/90">
        Put in your real numbers. See what your marketing actually returned once revenue is matched to the spend that caused it, how much of your revenue
        you can&rsquo;t trace to any source, and what the next 90 to 180 days look like at your current rates.
      </p>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        About a dozen questions, under four minutes. Every number you see is figured from what you type. No benchmarks, no averages, nothing borrowed.
      </p>

      <form onSubmit={submit} noValidate className="mt-10 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="gate-first" className="block text-sm text-foreground">
              First name
            </label>
            <input id="gate-first" autoComplete="given-name" required value={first} onChange={(e) => setFirst(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="gate-last" className="block text-sm text-foreground">
              Last name
            </label>
            <input id="gate-last" autoComplete="family-name" required value={last} onChange={(e) => setLast(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="gate-email" className="block text-sm text-foreground">
            Email
          </label>
          <input id="gate-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="gate-phone" className="block text-sm text-foreground">
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <input id="gate-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={company} onChange={(e) => setCompany(e.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
            {status === "sending" ? "One moment…" : "Open the tool"}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Your business numbers never leave your browser. The only thing sent to us is the name, email, and phone on this form.
      </p>
    </div>
  )
}
