"use client"

import { Heart, Users, Award, HandHeart } from "lucide-react"

const initiatives = [
  {
    icon: Heart,
    title: "Supporting Veterans",
    description:
      "As a veteran-owned business, we are committed to giving back to those who have served. We offer discounts to active military and veterans, and support local veteran organizations throughout Brunswick County.",
  },
  {
    icon: Users,
    title: "Local Partnerships",
    description:
      "We partner with local businesses, schools, and organizations to strengthen our community. From sponsoring youth sports teams to participating in community events, Valor Towing is proud to be a part of the Brunswick County family.",
  },
  {
    icon: Award,
    title: "First Responder Support",
    description:
      "We work closely with local law enforcement and first responders to keep our roads safe. Our team is available around the clock to assist with accident scenes and roadside emergencies across the region.",
  },
  {
    icon: HandHeart,
    title: "Giving Back",
    description:
      "We believe in lifting up our neighbors. Whether it is helping a stranded driver at no charge during a hardship or donating to local food drives, Valor Towing looks for every opportunity to make a difference.",
  },
]

export function CommunitySection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Community <span className="text-primary">Involvement</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Valor Towing & Transport is more than a towing company - we are your neighbors. We are proud to serve and invest in the Brunswick County community every day.
          </p>
        </div>

        {/* Initiative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {initiatives.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="bg-card border border-border rounded-2xl p-8 flex gap-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Banner */}
        <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Veteran Owned & Operated</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Our military values of honor, integrity, and service guide everything we do - on the road and in the community.
          </p>
        </div>
      </div>
    </section>
  )
}
