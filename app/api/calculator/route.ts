import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { DEFAULTS, calculate, clampInputs } from "@/lib/roi"

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  // Honeypot: real visitors never see this field, so anything in it is a bot that gets a quiet "ok".
  company: z.string().max(500).optional(),
  inputs: z
    .object({
      bundles: z.number(),
      dealSize: z.number(),
      engagementRate: z.number(),
      qualifiedRate: z.number(),
      meetingRate: z.number(),
      showRate: z.number(),
      closeRate: z.number(),
    })
    .partial()
    .optional(),
})

const TO_ADDRESS = process.env.CONTACT_TO_ADDRESS || "pipelines@starkandbarker.com"
const FROM_ADDRESS = process.env.CONTACT_FROM_ADDRESS || "Stark & Barker <onboarding@resend.dev>"

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

async function subscribeToMemo(name: string, email: string, dealSize: number) {
  const apiKey = process.env.BEEHIIV_API_KEY
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !publicationId) {
    // TODO(Ken): set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID on Vercel (Preview + Production), then redeploy.
    console.warn("Calculator lead not sent to Beehiiv: BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID not set")
    return false
  }
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      reactivate_existing: false,
      send_welcome_email: true,
      double_opt_override: "not_set",
      utm_source: "starkandbarker.com",
      utm_medium: "calculator",
      referring_site: "https://starkandbarker.com/calculator",
      // Beehiiv drops custom fields that don't exist in the publication rather than failing.
      custom_fields: [
        { name: "Name", value: name },
        { name: "Deal Size", value: dealSize },
      ],
    }),
  })
  if (!res.ok) console.error("Beehiiv subscription failed", res.status, await res.text().catch(() => ""))
  return res.ok
}

async function notifyKen(name: string, email: string, inputs: ReturnType<typeof clampInputs>) {
  if (!process.env.RESEND_API_KEY) return false
  const r = calculate(inputs)
  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.emails.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    replyTo: email,
    subject: `Calculator lead: ${name}`,
    text: [
      `${name} <${email}> unlocked their estimate on the calculator.`,
      ``,
      `Deal size: ${money.format(inputs.dealSize)}`,
      `Bundles: ${inputs.bundles}`,
      `Rates: engaged ${inputs.engagementRate}%, qualified ${inputs.qualifiedRate}%, meetings ${inputs.meetingRate}%, show ${inputs.showRate}%, close ${inputs.closeRate}%`,
      ``,
      `Their monthly estimate: ${r.attended} attended meetings, ${r.deals} deals, ${money.format(r.revenue)} revenue against ${money.format(r.totalCost)} cost.`,
      ``,
      `Sent from starkandbarker.com/calculator`,
    ].join("\n"),
  })
  if (result.error) console.error("Calculator lead email failed", result.error)
  return !result.error
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 })
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  const { name, email } = parsed.data
  const inputs = clampInputs({ ...DEFAULTS, ...parsed.data.inputs })

  // Each step fails independently so one outage never blocks the lead or the other step.
  const [subscribed, notified] = await Promise.all([
    subscribeToMemo(name, email, inputs.dealSize).catch((err) => {
      console.error("Beehiiv request error", err)
      return false
    }),
    notifyKen(name, email, inputs).catch((err) => {
      console.error("Calculator lead email error", err)
      return false
    }),
  ])

  return NextResponse.json({ ok: true, subscribed, notified })
}
