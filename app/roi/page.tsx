import type { Metadata } from "next"
import Link from "next/link"
import { RoiCalculator } from "@/components/roi-calculator"
import { Footer } from "@/components/footer"

const roiTitle = "ROI estimate | Stark & Barker"
const roiDescription =
  "Estimate what cold email outreach could return for your business, using your own numbers."
const shareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Stark & Barker",
}

// Unlinked while placement is decided, so it stays out of search until then.
export const metadata: Metadata = {
  title: "ROI estimate",
  description: roiDescription,
  robots: { index: false, follow: false },
  openGraph: {
    title: roiTitle,
    description: roiDescription,
    url: "/roi",
    siteName: "Stark & Barker",
    type: "website",
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: roiTitle,
    description: roiDescription,
    creator: "@Stark_Barker",
    site: "@Stark_Barker",
    images: [shareImage],
  },
}

export default function RoiPage() {
  return (
    <>
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="font-display text-xl leading-none tracking-tight text-foreground">
            Stark <span className="font-normal text-muted-foreground">&amp;</span> Barker
          </Link>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">ROI estimate</span>
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
