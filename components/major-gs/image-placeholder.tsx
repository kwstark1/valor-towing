import { Camera } from "lucide-react"

/**
 * Labeled photo slot. Product/founder photography is a HARD GATE in the spec —
 * we never ship fake stock, so until real shots exist these render as obvious,
 * captioned placeholders describing the shot to capture. Swap for next/image once
 * the photoshoot (Dependency #0) is done.
 */
export function ImagePlaceholder({
  label,
  className = "",
  aspect = "aspect-[4/3]",
}: {
  label: string
  className?: string
  aspect?: string
}) {
  return (
    <div
      className={`${aspect} ${className} flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#E8621A]/40 bg-[#2B2418] p-6 text-center`}
      role="img"
      aria-label={`Photo placeholder: ${label}`}
    >
      <Camera className="h-8 w-8 text-[#E8621A]" aria-hidden />
      <span className="max-w-[28ch] text-sm leading-snug text-[#C8C4BC]/80">
        <span className="font-semibold text-[#F5F0E8]">Photo: </span>
        {label}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-[#E8621A]/70">
        Hard gate — replace before launch
      </span>
    </div>
  )
}
