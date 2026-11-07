import type { Metadata } from "next"
import Link from "next/link"
import { RoiCalculator } from "@/components/roi-calculator"
import { Footer } from "@/components/footer"

const pageTitle = "ROI calculator | Stark & Barker"
const pageDescription =
  "See what cold email outreach could return for your business, using your own numbers, and what it would cost."
const shareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Stark & Barker",
}

export const metadata: Metadata = {
  title: "ROI calculator",
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/calculator",
    siteName: "Stark & Barker",
    type: "website",
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    creator: "@Stark_Barker",
    site: "@Stark_Barker",
    images: [shareImage],
  },
}

export default function CalculatorPage() {
  return (
    <>
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="font-display text-xl leading-none tracking-tight text-foreground">
            Stark <span className="font-normal text-muted-foreground">&amp;</span> Barker
          </Link>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">ROI calculator</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:py-5">
        <RoiCalculator />
      </main>
      <div className="mt-12">
        <Footer />
      </div>
    </>
  )
}
