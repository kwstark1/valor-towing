"use client"

import { Phone, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg md:text-xl">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-lg md:text-xl tracking-tight">Valor Towing</span>
              <span className="text-muted-foreground text-xs hidden sm:block">Veteran Owned & Operated</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="#services" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="/crew" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Our Crew
            </Link>
            <Link href="/gallery" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Gallery
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
              Contact
            </Link>
          </nav>

          {/* Phone & CTA */}
          <div className="flex items-center gap-3">
            <a href="tel:+19108339771" className="hidden sm:flex items-center gap-2 text-foreground font-semibold">
              <Phone className="h-4 w-4 text-primary" />
              <span>(910) 833-9771</span>
            </a>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <a href="tel:+19108339771">
                <Phone className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Call Now</span>
                <span className="sm:hidden">Call</span>
              </a>
            </Button>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#services"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/crew"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Crew
              </Link>
              <Link
                href="/gallery"
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="#contact" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <a href="tel:+19108339771" className="flex items-center gap-2 text-primary font-semibold sm:hidden">
                <Phone className="h-4 w-4" />
                <span>(910) 833-9771</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
