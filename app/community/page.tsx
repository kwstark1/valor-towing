import { Header } from "@/components/header"
import { CommunitySection } from "@/components/community-section"
import { Footer } from "@/components/footer"

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20 md:pt-28">
        <CommunitySection />
      </div>
      <Footer />
    </main>
  )
}
