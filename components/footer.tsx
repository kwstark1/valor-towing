import { Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <div>
                <span className="text-foreground font-bold text-lg">Valor Towing & Transport</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-4">
              Proudly serving Brunswick County with the same dedication and honor we showed in uniform. 
              Veteran-owned, community-focused, always ready to serve.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Brunswick, New Hanover & Pender Counties</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#crew" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Meet the Crew
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+19108339771" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  (910) 833-9771
                </a>
              </li>
              <li>
                <a href="mailto:contact@valortowing.net" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                  <Mail className="h-4 w-4" />
                  contact@valortowing.net
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Valor Towing & Transport. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">Veteran Owned &amp; Operated</p>
        </div>
      </div>
    </footer>
  )
}
