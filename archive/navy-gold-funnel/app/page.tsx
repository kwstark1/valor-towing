import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import { OfferSection } from "@/components/offer-section"
import { CloseSection } from "@/components/close-section"
import { AuditForm } from "@/components/audit-form"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <StorySection />
      <OfferSection />
      <CloseSection />
      <AuditForm />
      <Footer />
    </main>
  )
}
