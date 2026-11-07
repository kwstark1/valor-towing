import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { beehiivConfigured, subscribeToMemo } from "@/lib/beehiiv"

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(200),
  // Honeypot: real visitors never see this field, so anything in it is a bot that gets a quiet "ok".
  company: z.string().max(500).optional(),
})

const TO_ADDRESS = process.env.CONTACT_TO_ADDRESS || "pipelines@starkandbarker.com"
const FROM_ADDRESS = process.env.CONTACT_FROM_ADDRESS || "Stark & Barker <onboarding@resend.dev>"

// While Beehiiv isn't connected, signups are emailed to Ken so none are lost.
async function notifyKen(email: string) {
  if (!process.env.RESEND_API_KEY || beehiivConfigured()) return false
  try {
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `Memo signup: ${email}`,
      text: `${email} signed up for The Stark & Barker Memo on starkandbarker.com.\n\nBeehiiv isn't connected yet, so add them by hand or set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID on Vercel.`,
    })
    if (result.error) console.error("Memo signup email failed", result.error)
    return !result.error
  } catch (err) {
    console.error("Memo signup email error", err)
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

  const { email } = parsed.data
  const [subscribed, notified] = await Promise.all([subscribeToMemo(email, "memo-signup"), notifyKen(email)])

  const nothingConfigured = !beehiivConfigured() && !process.env.RESEND_API_KEY
  if (!subscribed && !notified && !nothingConfigured) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 })
  }

  return NextResponse.json({ ok: true, subscribed })
}
