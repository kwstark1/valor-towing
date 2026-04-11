tsx"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const photos = [
  { src: "/images/IMG_4586.jpeg", alt: "Valor flatbed towing a Ford Bronco", caption: "Flatbed Transport" },
  { src: "/images/IMG_4587.jpg", alt: "Valor flatbed with Ford Bronco", caption: "Flatbed Transport" },
  { src: "/images/IMG_4599.jpeg", alt: "Valor heavy equipment transport â€” JLG 1850SJ boom lift", caption: "Heavy Equipment Transport" },
  { src: "/images/IMG_4585.jpeg", alt: "Valor towing a Leland Police vehicle", caption: "Municipal & Fleet Services" },
  { src: "/images/IMG_4632.JPG", alt: "Valor flatbed on construction job site", caption: "Job Site Transport" },
  { src: "/images/IMG_4634.JPG", alt: "Valor flatbed transporting a boat at sunset", caption: "Boat & Watercraft Transport" },
  { src: "/images/IMG_4636.JPG", alt: "Valor flatbed transporting a U-Haul van", caption: "Commercial Vehicle Transport" },
  { src: "/images/IMG_3790.jpeg", alt: "Valor crew member working roadside recovery", caption: "Roadside Recovery" },
  { src: "/images/IMG_3789.jpeg", alt: "Valor on-scene roadside assistance on highway", caption: "Roadside Assistance" },
  { src: "/images/IMG_3776.jpeg", alt: "Valor heavy wrecker closeup", caption: "Heavy Wrecker Services" },
  { src: "/images/IMG_3775.jpeg", alt: "Valor crew member on the job", caption: "Professional Crew" },
  { src: "/images/IMG_8918.jpeg", alt: "Valor flatbed transporting a BMW", caption: "Luxury Vehicle Transport" },
  { src: "/images/IMG_5958.jpeg", alt: "Valor flatbed transporting a classic Trans Am", caption: "Classic Car Transport" },
]

export function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox((l) => (l! - 1 + photos.length) % photos.length)
  const next = () => setLightbox((l) => (l! + 1) % photos.length)

  return (
    <section id="gallery" className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">Our Work</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From flatbed towing to heavy equipment and boat transport â€” see Valor's fleet in action across Brunswick County and beyond.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden rounded-xl aspect-video bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`View ${photo.caption}`}
            >
              <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <span className="text-white font-semibold text-sm px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">{photo.caption}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white z-10"><X className="h-8 w-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/70 hover:text-white z-10"><ChevronLeft className="h-10 w-10" /></button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[85vh] w-full">
            <img src={photos[lightbox].src} alt={photos[lightbox].alt} className="w-full h-full object-contain rounded-lg" />
            <p className="text-white/70 text-center mt-3 text-sm">{photos[lightbox].caption} â€” {lightbox + 1} / {photos.length}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/70 hover:text-white z-10"><ChevronRight className="h-10 w-10" /></button>
        </div>
      )}
    </section>
  )
}