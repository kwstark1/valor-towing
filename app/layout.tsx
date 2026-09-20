import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Stark & Barker — Marketing systems that compound',
    template: '%s — Stark & Barker',
  },
  description:
    'The client pipeline that compounds — qualified conversations every month, built and run for operators selling serious work.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#ebe4d3',
  width: 'device-width',
  initialScale: 1,
}

// Preview-only theme switch. Reads ?theme=navy | ?theme=navy-deep from the URL
// and sets data-theme on <html> before body paints (avoids FOUC). Anything
// else falls back to the beige default in globals.css.
const themeSwitchScript = `(function(){try{var m=/[?&]theme=([^&]+)/.exec(location.search);var t=m?decodeURIComponent(m[1]):'';if(t==='navy'||t==='navy-deep'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeSwitchScript }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  )
}
