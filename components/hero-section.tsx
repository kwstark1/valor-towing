"use client"

import { useState, useEffect } from "react"
import { Phone, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  { src: "/images/IMG_4586.jpeg", alt: "Valor Towing flatbed with vehicle" },
  { src: "/images/IMG_4599.jpeg", alt: "Valor heavy equipment transport" },
  { src: "/images/IMG_8918.jpeg", alt: "Valor Towing flatbed with BMW" },
  { src: "/images/IMG_4585.jpeg", alt: "Valor Towing police vehicle transport" },
  { src: "/images/IMG_5958.jpeg", alt: "Valor Towing classic car transport" },
  { src: "/images/IMG_4634.JPG", alt: "Valor Towing boat transport at sunset" },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${slide.src})`,
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-medium">24/7 Emergency Response</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Stranded in{" "}
          <span className="text-blue-400">Brunswick County?</span>
          <br />
          <span className="text-red-500">{"We're On Our Way."}</span>
        </h1>
        <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
          Fast, reliable towing services across the Cape Fear region. When
          {"you're"} stranded, we respond with the urgency and discipline of those who served.
        </p>
        <p className="text-white/60 text-sm mb-10 flex items-center justify-center gap-2">
          <span>📍</span> Proudly Serving Brunswick, New Hanover {"&"} Pender Counties
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg">
            <a href="tel:+19108339771">
              <Phone className="h-5 w-5 mr-2" />
              Call Now: 910-833-9771
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm">
            <a href="#services">View Our Services</a>
          </Button>
        </div>
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  )
}
