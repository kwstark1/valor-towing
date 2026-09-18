"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import type { FieldValue } from "@/lib/pipeline-math/form-state"
import { fieldHelp } from "@/lib/pipeline-math/help-content"
import { Hint } from "./ui"

const inputClass =
  "w-full rounded-md border border-border bg-transparent px-4 py-3 text-lg text-foreground placeholder-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-40"

/**
 * A text field for a number the user might not know. "I don't know" is a
 * first-class answer, and whatever they typed is kept if they toggle it.
 */
export function NumberField({
  fieldId,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  error,
  labelOverride,
  inputMode = "decimal",
  allowUnknown = true,
  optional = false,
  autoFocus,
}: {
  fieldId: string
  value: FieldValue
  onChange: (v: FieldValue) => void
  prefix?: string
  suffix?: string
  placeholder?: string
  error?: string | null
  labelOverride?: string
  inputMode?: "decimal" | "numeric" | "text"
  allowUnknown?: boolean
  optional?: boolean
  autoFocus?: boolean
}) {
  const id = useId()
  const help = fieldHelp[fieldId]
  const label = labelOverride ?? help?.label ?? fieldId
  const errId = `${id}-err`

  return (
    <div>
      <label htmlFor={id} className="block text-base leading-snug text-foreground sm:text-lg">
        {label}
        {optional && <span className="ml-2 text-sm text-muted-foreground">(optional)</span>}
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 basis-40">
          {prefix && (
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type="text"
            inputMode={inputMode}
            autoComplete="off"
            autoFocus={autoFocus}
            value={value.raw}
            disabled={value.unknown}
            placeholder={value.unknown ? "I don't know" : placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            onChange={(e) => onChange({ raw: e.target.value, unknown: false })}
            className={cn(inputClass, prefix && "pl-8", suffix && "pr-16", error && "border-destructive")}
          />
          {suffix && (
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        {allowUnknown && (
          <button
            type="button"
            aria-pressed={value.unknown}
            onClick={() => onChange({ ...value, unknown: !value.unknown })}
            className={cn(
              "min-h-12 shrink-0 rounded-md border px-4 text-sm transition-colors",
              value.unknown ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {value.unknown ? "Don't know ✓" : "I don't know"}
          </button>
        )}
      </div>
      {value.unknown && <p className="mt-2 text-sm text-muted-foreground">Fine. We&rsquo;ll show you what that changes in the results.</p>}
      {error && (
        <p id={errId} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {help && <Hint text={help.hint} />}
    </div>
  )
}

/** Small inline number input for channel rows. Blank means "don't know". */
export function MiniField({
  label,
  value,
  onChange,
  prefix,
  placeholder = "don't know",
  error,
}: {
  label: string
  value: string
  onChange: (raw: string) => void
  prefix?: string
  placeholder?: string
  error?: boolean
}) {
  const id = useId()
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-xs text-muted-foreground">
        {label}
      </label>
      <div className="relative mt-1">
        {prefix && (
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          aria-invalid={error || undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-base text-foreground placeholder-muted-foreground/50 focus:border-accent focus:outline-none",
            prefix && "pl-7",
            error && "border-destructive"
          )}
        />
      </div>
    </div>
  )
}

export const READ_ERROR = "Couldn't read that. Try a number like 12,500 or 12.5k."
export const RANGE_ERROR = "Couldn't read that. Try something like 45, 30-60, or 6 weeks."
