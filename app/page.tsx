import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { CrewSection } from "@/components/crew-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { GallerySection } from "@/components/gallery-section"
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <CrewSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
