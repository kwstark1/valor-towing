"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQS } from "@/lib/major-gs"

export function MajorGsFaq() {
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-3xl">
      {FAQS.map((f, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-white/10"
        >
          <AccordionTrigger className="text-left font-[family-name:var(--font-oswald)] text-lg font-semibold text-[#F5F0E8] hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-[#C8C4BC]">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
