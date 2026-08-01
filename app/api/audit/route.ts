import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

/*
 * TODO: connect form submissions to Ken's lead pipeline
 * (email pipelines@starkandbarker.com and/or Notion CRM).
 *
 * Currently sends via Resend to CONTACT_TO_ADDRESS. Adding a Notion CRM
 * push here (e.g. via the Notion API to a "Leads" database) is a clean
 * follow-on: after the resend.emails.send call succeeds, POST the same
 * payload to Notion. Store NOTION_API_TOKEN + NOTION_LEADS_DB_ID as
 * Vercel env vars; keep Notion failure non-fatal so email delivery is
 * never blocked by a Notion outage.
 */

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  business: z.string().trim().min(1, "Business name is required").max(200),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  email: z.string().trim().email("A valid email is required").max(200),
  frustration: z.string().trim().max(2000).optional().or(z.literal("")),
  company: z.string().max(0).optional().or(z.literal("")),
})

const TO_ADDRESS =
  process.env.CONTACT_TO_ADDRESS || "pipelines@starkandbarker.com"
const FROM_ADDRESS =
  process.env.CONTACT_FROM_ADDRESS ||
  "Stark & Barker <onboarding@resend.dev>"

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Email service not configured. Set RESEND_API_KEY in the environment.",
      },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return NextResponse.json(
      { error: firstIssue?.message || "Invalid input" },
      { status: 400 }
    )
  }

  // Honeypot: bots typically fill every field including hidden ones.
  // Silently 200 without sending if it's filled — do not tip off the bot.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  const { name, business, website, email, frustration } = parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const lines = [
      `From: ${name} <${email}>`,
      `Business: ${business}`,
    ]
    if (website) lines.push(`Website / social: ${website}`)
    lines.push(``)
    if (frustration) {
      lines.push(`Biggest marketing frustration:`)
      lines.push(frustration)
      lines.push(``)
    }
    lines.push(`—`)
    lines.push(`Audit request submitted from starkandbarker.com`)

    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New audit request — ${business}`,
      text: lines.join("\n"),
    })

    if (result.error) {
      return NextResponse.json(
        { error: "Failed to send. Please try again." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to send. Please try again." },
      { status: 502 }
    )
  }
}
