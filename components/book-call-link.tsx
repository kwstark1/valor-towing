"use client"

import type { ReactNode } from "react"
import { CALENDLY_URL } from "@/site.config"
import { track } from "@/lib/analytics"

export function BookCallLink({
  location,
  className,
  children,
}: {
  location: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("calendly_click", { location })}
      className={className}
    >
      {children}
    </a>
  )
}
