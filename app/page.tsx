import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProofBar } from "@/components/proof-bar"
import { ProblemSection } from "@/components/problem-section"
import { TheWorkSection } from "@/components/the-work-section"
import { WhatsIncluded } from "@/components/whats-included"
import { PullQuote } from "@/components/pull-quote"
import { HowYouPay } from "@/components/how-you-pay"
import { HowItWorks } from "@/components/how-it-works"
import { FaqSection } from "@/components/faq-section"
import { ClosingBand } from "@/components/closing-band"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProofBar />
      <ProblemSection />
      <TheWorkSection />
      <WhatsIncluded />
      <PullQuote />
      <HowYouPay />
      <HowItWorks />
      <FaqSection />
      <ClosingBand />
      <ContactSection />
      <Footer />
    </main>
  )
}
