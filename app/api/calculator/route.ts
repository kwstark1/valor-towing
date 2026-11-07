import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { DEFAULTS, calculate, clampInputs, type RoiInputs } from "@/lib/roi"
import { beehiivConfigured, subscribeToMemo } from "@/lib/beehiiv"
import { BEEHIIV_CUSTOM_FIELDS } from "@/site.config"

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

async function notifyKen(name: string, email: string, inputs: RoiInputs) {
  if (!process.env.RESEND_API_KEY) return false
  try {
    const r = calculate(inputs)
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
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
  } catch (err) {
    console.error("Calculator lead email error", err)
    return false
  }
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

  const [subscribed, notified] = await Promise.all([
    subscribeToMemo(email, "calculator", [
      { name: BEEHIIV_CUSTOM_FIELDS.name, value: name },
      { name: BEEHIIV_CUSTOM_FIELDS.dealSize, value: inputs.dealSize },
    ]),
    notifyKen(name, email, inputs),
  ])

  // Results only unlock once the lead is saved somewhere. A local build with neither service set up still works.
  const nothingConfigured = !beehiivConfigured() && !process.env.RESEND_API_KEY
  if (!subscribed && !notified && !nothingConfigured) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 })
  }

  return NextResponse.json({ ok: true, subscribed, notified })
}
