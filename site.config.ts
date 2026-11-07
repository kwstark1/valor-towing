// Everything Ken may need to change for the site lives here.
// Secrets never go in this file: API keys are set as Vercel environment variables.

// The calculator is the front door. With CALCULATOR_LIVE off, every
// "See if you're a fit" button falls back to the contact form instead.
export const CALCULATOR_PATH = "/calculator"
export const CALCULATOR_LIVE = true

export const CALENDLY_URL = "https://calendly.com/pipelines-starkandbarker/pipeline-review"
// "Book a call" pre-fills only name and email; the event's notes question stays empty for the prospect.

// TODO(Ken): set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID in Vercel (Preview + Production), then redeploy.
// Until they're set, Memo and calculator signups are emailed to the contact inbox instead.
// To store these on each subscriber, create matching custom fields in Beehiiv; missing ones are skipped.
export const BEEHIIV_CUSTOM_FIELDS = { name: "Name", dealSize: "Deal Size" }

// Proof stays hidden until it's real. No invented logos, stats, or testimonials.
export const SHOW_PROOF = false
export const PROOF = {
  logos: [] as { name: string; src: string }[], // TODO(Ken): real client logos, with permission
  stats: [] as { value: string; label: string }[], // TODO(Ken): real results only
}

// TODO(Ken): review these against how your launches actually run.
export const TIMELINES = {
  numbers: "About 2 minutes",
  call: "30 to 45 minutes",
  launch: "First sends in 2 to 4 weeks",
}

export function calculatorHref() {
  return CALCULATOR_LIVE ? CALCULATOR_PATH : "/#contact"
}
