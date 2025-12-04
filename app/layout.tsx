import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Nguyen Tien Dang - Full Stack Developer",
  description:
    "Full-Stack Developer & Software Engineering Student passionate about creating innovative solutions with modern technologies.",
  keywords: ["Full Stack Developer", "Software Engineer", "React", "Java", "C#", ".NET", "Android", "Unity"],
  authors: [{ name: "Nguyen Tien Dang" }],
  creator: "Nguyen Tien Dang",
  publisher: "Nguyen Tien Dang",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Nguyen Tien Dang - Full Stack Developer",
    description:
      "Full-Stack Developer & Software Engineering Student passionate about creating innovative solutions with modern technologies.",
    siteName: "Nguyen Tien Dang Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyen Tien Dang - Full Stack Developer",
    description:
      "Full-Stack Developer & Software Engineering Student passionate about creating innovative solutions with modern technologies.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://facebook.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        {children}
        {/* Embed the chatbot script */}
        <script src="/chatbot-embed.js" defer></script>
      </body>
    </html>
  )
}
