import type { Metadata } from "next"
import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About",
  description:
    "Stark & Barker is named for two Texas families. The thesis behind the firm.",
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
