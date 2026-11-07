import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProofBar } from "@/components/proof-bar"
import { TheWorkSection } from "@/components/the-work-section"
import { HowYouPay } from "@/components/how-you-pay"
import { HowItWorks } from "@/components/how-it-works"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProofBar />
      <TheWorkSection />
      <HowYouPay />
      <HowItWorks />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
