"use client"

import { useState, type FormEvent } from "react"
import { track } from "@/lib/analytics"

type Status = "idle" | "submitting" | "success" | "error"

export function MemoSignup() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    setError(null)
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || "Something went wrong. Please try again.")
        setStatus("error")
        return
      }
      track("memo_signup", { location: "contact" })
      setStatus("success")
    } catch {
      setError("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <div className="border-t border-border pt-10">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">The Stark &amp; Barker Memo</p>
      {status === "success" ? (
        <p role="status" className="mt-4 text-base text-foreground">
          You&rsquo;re on the list. The first issue arrives when the Memo launches.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="memo-email" className="sr-only">
                Email
              </label>
              <input
                id="memo-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b border-border bg-transparent px-0 py-2 text-base text-foreground placeholder-muted-foreground/60 focus:border-foreground focus:outline-none"
              />
            </div>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-lg border border-accent/70 px-5 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {status === "submitting" ? "Joining…" : "Join the Memo"}
            </button>
          </div>
          {error ? (
            <p role="alert" className="mt-3 text-sm text-accent">
              {error}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">Calculator users get it automatically.</p>
        </form>
      )}
    </div>
  )
}
