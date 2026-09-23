import type { Metadata } from "next"
import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

const aboutTitle = "About | Stark & Barker"
const aboutDescription =
  "Stark & Barker is named for two Texas families. The thesis behind the firm."

// A page's openGraph/twitter replace the layout's wholesale, so shared fields are restated.
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
  },
  twitter: {
    card: "summary_large_image",
    title: aboutTitle,
    description: aboutDescription,
    creator: "@Stark_Barker",
    site: "@Stark_Barker",
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
