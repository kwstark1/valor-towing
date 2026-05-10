import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("A valid email is required").max(200),
  message: z.string().trim().min(1, "A message is required").max(5000),
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

  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  const { name, email, message } = parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New inquiry — ${name}`,
      text: [
        `From: ${name} <${email}>`,
        ``,
        message,
        ``,
        `—`,
        `Sent from starkandbarker.com`,
      ].join("\n"),
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
