import type { Metadata } from "next"
import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

const aboutTitle = "About | Stark & Barker"
const aboutDescription =
  "Stark & Barker is named for two Texas families. The thesis behind the firm."
const shareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Stark & Barker",
}

// A page's openGraph/twitter replace the layout's wholesale, including the file-based share image, so shared fields are restated.
export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  openGraph: {
    title: aboutTitle,
    description: aboutDescription,
    url: "/about",
    siteName: "Stark & Barker",
    type: "website",
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: aboutTitle,
    description: aboutDescription,
    creator: "@Stark_Barker",
    site: "@Stark_Barker",
    images: [shareImage],
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <AboutSection />
      <Footer />
    </main>
  )
}
