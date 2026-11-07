import { sendGAEvent } from "@next/third-parties/google"

// Event names only, never input values: deal sizes and contact details stay out of analytics.
export function track(event: string, params: Record<string, string> = {}) {
  try {
    sendGAEvent("event", event, params)
  } catch {
    // Analytics failures never block the page.
  }
}
