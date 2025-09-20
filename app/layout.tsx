import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "CasaLink - Condominium Management System",
  description: "A smarter, friendlier way to manage your condominium. Transform visitor management, community connection, and daily operations with QR-based solutions.",
  keywords: ["condominium management", "visitor management", "QR code", "property management", "community platform"],
  authors: [{ name: "CasaLink Team" }],
  creator: "CasaLink",
  publisher: "CasaLink",
  generator: "Next.js",
  applicationName: "CasaLink",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://casalink.arwindpianist.store",
    siteName: "CasaLink",
    title: "CasaLink - Condominium Management System",
    description: "A smarter, friendlier way to manage your condominium. Transform visitor management, community connection, and daily operations with QR-based solutions.",
    images: [
      {
        url: "https://casalink.arwindpianist.store/casalink-screenshot.png",
        width: 1200,
        height: 630,
        alt: "CasaLink Landing Page Screenshot",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@casalink",
    creator: "@casalink",
    title: "CasaLink - Condominium Management System",
    description: "A smarter, friendlier way to manage your condominium. Transform visitor management, community connection, and daily operations with QR-based solutions.",
    images: ["https://casalink.arwindpianist.store/casalink-screenshot.png"],
  },
  icons: {
    icon: [
      { url: "/casalink-favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/casalink-favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/casalink-favicon/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/casalink-favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { url: "/casalink-favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/casalink-favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  manifest: "/casalink-favicon/site.webmanifest",
  metadataBase: new URL("https://casalink.arwindpianist.store"),
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* CasaLink Favicons */}
          <link rel="icon" type="image/x-icon" href="/casalink-favicon/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/casalink-favicon/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/casalink-favicon/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/casalink-favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/casalink-favicon/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/casalink-favicon/android-chrome-512x512.png" />
          <link rel="manifest" href="/casalink-favicon/site.webmanifest" />
          
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Dancing+Script:wght@400;500;600;700&display=swap" 
            rel="stylesheet" 
          />
        </head>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            <AuthProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </AuthProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
