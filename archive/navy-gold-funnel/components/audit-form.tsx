"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { sendGAEvent } from "@next/third-parties/google"

const schema = z.object({
  name: z.string().trim().min(1, "Required"),
  business: z.string().trim().min(1, "Required"),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email"),
  frustration: z.string().trim().max(2000).optional().or(z.literal("")),
  company: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Status = "idle" | "submitting" | "success" | "error"

const labelClass =
  "block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
const fieldClass =
  "mt-2 w-full rounded-sm border border-border/60 bg-secondary/40 px-4 py-3 text-base text-foreground placeholder-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-lg"

export function AuditForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setStatus("submitting")
    setServerError(null)
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setServerError(data?.error || "Something went wrong. Please try again.")
        setStatus("error")
        return
      }
      reset()
      setStatus("success")
      try {
        sendGAEvent("event", "generate_lead", { method: "audit_form" })
      } catch {
        // GA failure must not clobber the success state
      }
    } catch {
      setServerError("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <section
      id="audit-form"
      className="scroll-mt-32 border-t border-border/50 bg-background-deep/40"
    >
      <div className="mx-auto max-w-2xl px-6 py-20 sm:px-8 sm:py-28">
        <h2 className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Find my biggest revenue leak
        </h2>

        {status === "success" ? (
          <div className="mt-10">
            <p className="text-lg font-medium text-foreground sm:text-xl">
              Got it. We will be in touch with your leak review shortly.
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              Your note is on its way to{" "}
              <span className="text-foreground">
                pipelines@starkandbarker.com
              </span>
              .
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-10 space-y-6 sm:mt-12"
          >
            <div>
              <label htmlFor="audit-name" className={labelClass}>
                Name
              </label>
              <input
                id="audit-name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "audit-name-error" : undefined}
                className={fieldClass}
                {...register("name")}
              />
              {errors.name && (
                <p
                  id="audit-name-error"
                  className="mt-2 text-xs text-primary"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="audit-business" className={labelClass}>
                Business name
              </label>
              <input
                id="audit-business"
                type="text"
                autoComplete="organization"
                aria-invalid={!!errors.business}
                aria-describedby={
                  errors.business ? "audit-business-error" : undefined
                }
                className={fieldClass}
                {...register("business")}
              />
              {errors.business && (
                <p
                  id="audit-business-error"
                  className="mt-2 text-xs text-primary"
                >
                  {errors.business.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="audit-website" className={labelClass}>
                Website or main social page (optional)
              </label>
              <input
                id="audit-website"
                type="text"
                autoComplete="url"
                className={fieldClass}
                {...register("website")}
              />
            </div>

            <div>
              <label htmlFor="audit-email" className={labelClass}>
                Email
              </label>
              <input
                id="audit-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "audit-email-error" : undefined
                }
                className={fieldClass}
                {...register("email")}
              />
              {errors.email && (
                <p
                  id="audit-email-error"
                  className="mt-2 text-xs text-primary"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="audit-frustration" className={labelClass}>
                What is your biggest marketing frustration right now? (optional)
              </label>
              <textarea
                id="audit-frustration"
                rows={4}
                className={`${fieldClass} resize-none`}
                {...register("frustration")}
              />
            </div>

            {/* Honeypot — bots fill this, humans do not. Kept off-screen. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              {...register("company")}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:text-lg"
              >
                {status === "submitting" ? "Sending…" : "Send me my leak review"}
              </button>
              {serverError && (
                <p role="alert" className="mt-4 text-sm text-primary">
                  {serverError}
                </p>
              )}
            </div>

            <p className="pt-2 text-sm text-muted-foreground">
              No obligation. You keep the findings either way.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
