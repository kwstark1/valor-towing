type CustomField = { name: string; value: string | number }

export function beehiivConfigured() {
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID)
}

// Adds an email to The Stark & Barker Memo. Returns false (never throws) when it can't.
export async function subscribeToMemo(email: string, source: string, customFields: CustomField[] = []) {
  if (!beehiivConfigured()) {
    // TODO(Ken): set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID on Vercel, then redeploy.
    console.warn(`Memo signup from ${source} not sent to Beehiiv: BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID not set`)
    return false
  }
  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          double_opt_override: "not_set",
          utm_source: "starkandbarker.com",
          utm_medium: source,
          referring_site: "https://starkandbarker.com",
          // Beehiiv drops custom fields that don't exist in the publication rather than failing.
          custom_fields: customFields,
        }),
      },
    )
    if (!res.ok) console.error("Beehiiv subscription failed", res.status, await res.text().catch(() => ""))
    return res.ok
  } catch (err) {
    console.error("Beehiiv request error", err)
    return false
  }
}
