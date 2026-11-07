import Link from "next/link"
import type { ReactNode } from "react"
import { calculatorHref } from "@/site.config"

type Size = "sm" | "md"

export function buttonClasses(size: Size = "md", extra = "") {
  return (
    "inline-flex items-center justify-center rounded-[8px] bg-accent font-sans font-medium text-accent-foreground " +
    "transition-colors hover:bg-accent-hover disabled:opacity-50 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    (size === "sm" ? "px-4 py-2 text-sm " : "px-6 py-3 text-base ") +
    extra
  )
}

// Hash links use a plain <a>: Next's <Link> needed two clicks for same-page anchors on this site.
export function Button({
  href,
  children,
  size = "md",
  className = "",
  newTab = false,
}: {
  href: string
  children: ReactNode
  size?: Size
  className?: string
  newTab?: boolean
}) {
  const classes = buttonClasses(size, className)
  if (newTab || href.includes("#") || href.startsWith("http")) {
    return (
      <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export function FitButton({ size = "md", className = "" }: { size?: Size; className?: string }) {
  return (
    <Button href={calculatorHref()} size={size} className={className}>
      See if you&rsquo;re a fit
    </Button>
  )
}
