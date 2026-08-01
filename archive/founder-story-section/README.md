# Founder story section archive

## What this is

The original first-person founder story that lived in the middle of the navy/gold homepage funnel — headed *"The week I learned that preparation can become the problem"*. It told the founder's Certainty Collector origin story (one-week marketing challenge, ghosted prospect, the epiphany that action beats preparation).

## Why it was archived

The homepage funnel targets established owners and operators (roughly $500k–$5M revenue businesses). A founder's personal "step out before you feel ready" story does not connect to a seasoned owner — they are years past that phase — and can read as inexperience on a cold conversion page.

The story was replaced by an operator-mirror section that reflects the reader's own situation back to them (*"You built a business that works, but marketing is the one place it still leaves you guessing."*), which earns trust from the target audience on cold traffic.

The founder's personal origin story belongs on the About page and personal-brand surfaces, not on the cold-side homepage funnel.

## Restoring

If the funnel later needs a founder story again:

1. Copy `archive/founder-story-section/components/story-section.tsx` → `components/story-section.tsx` (overwriting the current operator-mirror version)
2. Nothing else needs changing — `app/page.tsx` already imports `<StorySection />` from that path

Note that the archived copy uses the *"preparation as substitute for action / Certainty Collector"* framing. If you want a different founder story (for example, family lineage or industrial-marketing origin), write fresh copy rather than restoring this one.
