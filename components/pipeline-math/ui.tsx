"use client"

import { useId, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "quiet"
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-accent text-accent-foreground hover:bg-[#dd9a5c]",
        variant === "ghost" && "border border-border bg-transparent text-foreground hover:border-foreground/60",
        variant === "quiet" && "min-h-10 px-3 text-sm text-muted-foreground hover:text-foreground",
        className
      )}
    />
  )
}

export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className={cn("pm-card pm-print-block rounded-lg border border-border bg-card/60 p-5 sm:p-7", className)}
    >
      {children}
    </section>
  )
}

/** Small uppercase label above a card or field group. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-sans text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground", className)}>{children}</p>
  )
}

/** One short sentence at the top of a card: what am I looking at. */
export function Lede({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-base leading-relaxed text-muted-foreground">{children}</p>
}

/** The large number on a card. */
export function Figure({ children, className, accent = false }: { children: ReactNode; className?: string; accent?: boolean }) {
  return (
    <p className={cn("pm-figure mt-4 text-4xl sm:text-5xl", accent ? "text-accent" : "text-foreground", className)}>{children}</p>
  )
}

/** A closed-by-default disclosure. Native <details>, so it prints and works without JS. */
export function Disclosure({
  label,
  children,
  className,
  defaultOpen = false,
}: {
  label: string
  children: ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  return (
    <details className={cn("pm-details group mt-4", className)} open={defaultOpen}>
      <summary className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
        <span aria-hidden="true" className="pm-caret inline-block text-accent">
          ›
        </span>
        <span className="border-b border-border group-hover:border-foreground/60">{label}</span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </details>
  )
}

/** "How is this figured?" — the arithmetic in words, using their numbers. */
export function HowFigured({ children }: { children: ReactNode }) {
  return <Disclosure label="How is this figured?">{children}</Disclosure>
}

/** Pill-style radio group for 2–4 options. Works one-handed on a phone. */
export function Choice<T extends string>({
  name,
  value,
  onChange,
  options,
  label,
}: {
  name: string
  value: T | null
  onChange: (v: T) => void
  options: Array<{ value: T; label: string; description?: string }>
  label: string
}) {
  const id = useId()
  return (
    <fieldset>
      <legend className="text-base leading-snug text-foreground sm:text-lg">{label}</legend>
      <div className="mt-3 grid gap-2">
        {options.map((o) => {
          const checked = value === o.value
          const oid = `${id}-${o.value}`
          return (
            <label
              key={o.value}
              htmlFor={oid}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors",
                checked ? "border-accent bg-accent/10" : "border-border hover:border-foreground/40"
              )}
            >
              <input
                id={oid}
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="mt-1 h-4 w-4 accent-[#d28b4a]"
              />
              <span>
                <span className="block text-base text-foreground">{o.label}</span>
                {o.description && <span className="block text-sm text-muted-foreground">{o.description}</span>}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Inline hint, closed by default. */
export function Hint({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
      >
        {open ? "Hide hint" : "Not sure?"}
      </button>
      {open && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>}
    </div>
  )
}

export function Callout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-md border-l-2 border-accent bg-accent/5 px-4 py-3 text-sm leading-relaxed text-foreground/90", className)}>
      {children}
    </div>
  )
}
