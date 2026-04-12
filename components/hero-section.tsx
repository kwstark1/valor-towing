"use client"

import { Phone, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/images/IMG_3776.jpeg)` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-medium">24/7 Emergency Response</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Valor Towing <span className="text-blue-400">&</span> Transport
        </h1>
        <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
          Fast, reliable towing services across the Cape Fear region. When you&apos;re stranded, we respond with the urgency and discipline of those who served.
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
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  )
}
