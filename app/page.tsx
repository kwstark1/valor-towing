import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TheWorkSection } from "@/components/the-work-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <TheWorkSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
