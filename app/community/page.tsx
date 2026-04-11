import { Header } from "@/components/header"
import { CommunitySection } from "@/components/community-section"
import { Footer } from "@/components/footer"

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 md:pt-20">
        <CommunitySection />
      </div>
      <Footer />
    </main>
  )
}
