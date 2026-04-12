import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

const crewMembers = [
  {
    name: "Allen Ellixson",
    title: "Owner / Operator",
    veteran: "U.S. Marine Corps Veteran",
  },
  {
    name: "Justin France",
    title: "Owner / Operator",
    veteran: "U.S. Marine Corps Veteran",
  },
  {
    name: "Ken Stark",
    title: "Operator",
    veteran: "U.S. Navy Veteran",
  },
  {
    name: "William Chambers",
    title: "Operator",
    veteran: null,
  },
]

export function CrewSection() {
  return (
    <section id="crew" className="py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Meet the Crew
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our team is built on a foundation of service. Every member brings the same dedication 
            they showed in uniform to helping you on the road.
          </p>
        </div>

        {/* Crew Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {crewMembers.map((member) => (
            <Card key={member.name} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden group">
              {/* Photo Placeholder */}
              <div className="aspect-square bg-secondary flex items-center justify-center relative overflow-hidden">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              </div>
              <CardContent className="p-6">
                {member.veteran && (
                  <Badge variant="outline" className="mb-3 border-accent/50 text-accent">
                    {member.veteran}
                  </Badge>
                )}
                <h3 className="text-xl font-bold text-card-foreground mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm">{member.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
