import { Header } from "@/components/header"
import { CrewSection } from "@/components/crew-section"
import { Footer } from "@/components/footer"

export default function CrewPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20 md:pt-28">
        <CrewSection />
      </div>
      <Footer />
    </main>
  )
}
