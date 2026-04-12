"use client"

import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "James T.",
    location: "Shallotte, NC",
    rating: 5,
    text: "Stranded on the side of 17 late at night and Valor showed up in under 30 minutes. Professional, friendly, and got my truck to the shop safely. Cannot recommend them enough.",
  },
  {
    name: "Maria S.",
    location: "Wilmington, NC",
    rating: 5,
    text: "Best towing service in the area. They were upfront about pricing and handled my car with care. The driver was courteous and made a stressful situation much easier.",
  },
  {
    name: "Derek W.",
    location: "Rocky Point, NC",
    rating: 5,
    text: "Called at 2am after a blowout on I-40. They answered immediately and were on scene fast. Veteran-owned and it shows - top-notch professionalism start to finish.",
  },
  {
    name: "Linda H.",
    location: "Leland, NC",
    rating: 5,
    text: "Had my SUV towed after an accident. Valor was gentle with my vehicle and kept me informed the whole time. Fair price, great service. Will use again if ever needed.",
  },
  {
    name: "Chris B.",
    location: "Bolivia, NC",
    rating: 5,
    text: "Quick response, reasonable rates, and a driver who actually cares about doing the job right. Glad to support a veteran-owned business that delivers like this.",
  },
  {
    name: "Tanya R.",
    location: "Brunswick County, NC",
    rating: 5,
    text: "Valor Towing went above and beyond. Not only did they tow my car but helped me figure out a shop nearby. True community people. Five stars all the way.",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real reviews from drivers across Brunswick, New Hanover & Pender Counties.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-foreground font-semibold">5.0</span>
            <span className="text-muted-foreground text-sm">average rating</span>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <Quote className="h-6 w-6 text-primary/40" />
              <p className="text-muted-foreground leading-relaxed flex-1">{review.text}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.location}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
