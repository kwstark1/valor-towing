import type { Metadata, Viewport } from "next"
import "./pipeline-math.css"

export const metadata: Metadata = {
  title: "The Pipeline Math",
  description:
    "Put in your real numbers and see what your marketing actually returned once revenue is matched to the spend that caused it, how much of your revenue you can't trace, and what the next 90 to 180 days look like.",
}

export const viewport: Viewport = {
  themeColor: "#122741",
  width: "device-width",
  initialScale: 1,
}

export default function PipelineMathLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="pm-theme antialiased">{children}</div>
}
