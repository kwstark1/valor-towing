"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(1, "Required"),
  company: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Status = "idle" | "submitting" | "success" | "error"

const labelClass =
  "block font-sans text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground"
const fieldClass =
  "mt-2 w-full bg-transparent border-0 border-b border-border px-0 py-2 font-sans text-base sm:text-lg text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"

export function ContactForm() {
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
      const res = await fetch("/api/contact", {
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
    } catch {
      setServerError("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="border-t border-border pt-10">
        <p className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
          Thanks — we&rsquo;ll be in touch.
        </p>
        <p className="mt-3 text-base text-muted-foreground">
          Your note is on its way to{" "}
          <span className="text-foreground">pipelines@starkandbarker.com</span>.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex items-baseline gap-3 font-sans text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <span aria-hidden="true">↩</span>
          <span className="border-b border-border hover:border-foreground transition-colors">
            Send another
          </span>
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border-t border-border pt-10 space-y-8"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              className="mt-2 text-xs text-accent"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={fieldClass}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              className="mt-2 text-xs text-accent"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className={fieldClass + " resize-none"}
          {...register("message")}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className="mt-2 text-xs text-accent"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("company")}
      />

      <div className="flex items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-baseline gap-3 font-sans text-base sm:text-lg text-foreground disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className="text-accent transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
          <span className="border-b border-border group-hover:border-foreground transition-colors">
            {status === "submitting" ? "Sending…" : "Send"}
          </span>
        </button>
        {serverError && (
          <p role="alert" className="text-sm text-accent">
            {serverError}
          </p>
        )}
      </div>
    </form>
  )
}
