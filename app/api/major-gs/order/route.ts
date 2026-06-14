import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { majorGs, isInDeliveryArea } from "@/lib/major-gs"

const schema = z.object({
  product: z.string().trim().min(1, "Choose a product").max(50),
  lbs: z.string().trim().min(1, "Choose how many pounds").max(50),
  deliveryDate: z.string().trim().min(1, "Choose a delivery date").max(50),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("A valid email is required").max(200),
  phone: z.string().trim().min(7, "A valid phone is required").max(40),
  address: z.string().trim().min(1, "Delivery address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  zip: z.string().trim().min(3, "A valid ZIP is required").max(20),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — must stay empty (bots fill it).
  company: z.string().max(0).optional().or(z.literal("")),
})

const TO_ADDRESS = process.env.MAJOR_GS_TO_ADDRESS || majorGs.ordersEmail
const FROM_ADDRESS =
  process.env.MAJOR_GS_FROM_ADDRESS || "Major G's BBQ <onboarding@resend.dev>"

export async function POST(request: Request) {
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

  // Honeypot tripped — pretend success, send nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true })
  }

  // Enforce the delivery area server-side (the form checks too, but never trust it).
  if (!isInDeliveryArea(parsed.data.zip)) {
    return NextResponse.json(
      {
        error: `Sorry — that ZIP is outside our delivery area right now. Call ${majorGs.phone} and we'll see what we can do.`,
      },
      { status: 422 }
    )
  }

  // Input is valid — now require the email service to actually deliver it.
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Email service not configured. Set RESEND_API_KEY in the environment.",
      },
      { status: 503 }
    )
  }

  const { product, lbs, deliveryDate, name, email, phone, address, city, zip, notes } =
    parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New brisket delivery request — ${name} (${lbs})`,
      text: [
        `NEW DELIVERY ORDER REQUEST`,
        ``,
        `Product:       ${product}`,
        `Amount:        ${lbs}`,
        `Delivery date: ${deliveryDate}`,
        ``,
        `Name:  ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        ``,
        `Deliver to:`,
        `  ${address}`,
        `  ${city} ${zip}`,
        ``,
        `Notes: ${notes || "—"}`,
        ``,
        `—`,
        `Call ${phone} within 24 hrs to confirm the order + payment, and that the address is in the delivery area.`,
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
