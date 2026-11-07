import type { Metadata } from "next"
import { Oswald } from "next/font/google"
import { majorGs } from "@/lib/major-gs"

// Bold condensed display for headlines; body inherits Inter (--font-sans) from root.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${majorGs.brand} — ${majorGs.tagline} | ${majorGs.city}`,
    template: `%s — ${majorGs.brand}`,
  },
  description: `Hand-trimmed, slow-smoked Texas-style beef brisket sold fresh by the pound and delivered to your door across ${majorGs.deliveryArea}. Order for your family cookout, your next event, or your restaurant.`,
}

export default function MajorGsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${oswald.variable} min-h-screen bg-[#1C1C1C] text-[#C8C4BC] antialiased`}
    >
      {children}
    </div>
  )
}
