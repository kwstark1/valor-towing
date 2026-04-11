import { Header } from "@/components/header"
import { GallerySection } from "@/components/gallery-section"
import { Footer } from "@/components/footer"

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 md:pt-20">
        <GallerySection />
      </div>
      <Footer />
    </main>
  )
}
