import { Header } from "@/components/header"
import { GallerySection } from "@/components/gallery-section"
import { Footer } from "@/components/footer"

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20 md:pt-28">
        <GallerySection />
      </div>
      <Footer />
    </main>
  )
}
