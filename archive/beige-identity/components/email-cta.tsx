"use client"

import { useState } from "react"

const EMAIL = "pipelines@starkandbarker.com"

type Size = "default" | "large"

export function EmailCta({ size = "default" }: { size?: Size }) {
  const [copied, setCopied] = useState(false)

  function handleClick() {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(EMAIL)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        })
        .catch(() => {})
    }
  }

  const isLarge = size === "large"

  return (
    <a
      href={`mailto:${EMAIL}`}
      onClick={handleClick}
      className={
        "group inline-flex items-baseline gap-3 " +
        (isLarge
          ? "font-display text-2xl sm:text-3xl tracking-tight text-foreground"
          : "font-sans text-base sm:text-lg text-foreground")
      }
    >
      <span
        aria-hidden="true"
        className={
          "text-accent transition-transform group-hover:translate-x-0.5 " +
          (isLarge ? "text-xl sm:text-2xl" : "")
        }
      >
        →
      </span>
      <span className="border-b border-border group-hover:border-foreground transition-colors">
        {EMAIL}
      </span>
      <span
        aria-live="polite"
        className={
          "ml-2 font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground transition-opacity duration-200 " +
          (copied ? "opacity-100" : "opacity-0")
        }
      >
        Copied
      </span>
    </a>
  )
}
