import { Truck, Wrench, Package, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Truck,
    title: "Emergency Towing",
    description: "Stranded on the roadside? Our rapid response team is ready 24/7. We handle all vehicle types from compact cars to heavy-duty trucks with care and precision.",
    features: ["Fast Response Times", "All Vehicle Types", "Damage-Free Transport", "Accident Recovery"]
  },
  {
    icon: Wrench,
    title: "Roadside Assistance",
    description: "Don&apos;t let a dead battery, flat tire, or empty tank ruin your day. Our skilled technicians arrive equipped to get you back on the road quickly.",
    features: ["Jump Starts", "Tire Changes", "Fuel Delivery", "Lockout Service"]
  },
  {
    icon: Package,
    title: "Equipment Transport",
    description: "Need heavy equipment moved? We specialize in safe, reliable transport of construction equipment, machinery, and oversized loads throughout the region.",
    features: ["Construction Equipment", "Industrial Machinery", "Oversized Loads", "Scheduled Transport"]
  }
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Do</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Professional Towing Services You Can Trust
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From emergency roadside assistance to heavy equipment transport, 
            we bring military precision and dedication to every call.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <Card key={service.title} className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Need immediate assistance?</p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            <a href="tel:+19108339771">
              <Phone className="h-5 w-5 mr-2" />
              Call Now: (910) 833-9771
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
