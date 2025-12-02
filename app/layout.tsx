import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Oswald } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
// <CHANGE> Added Oswald font for bold heading style
const _oswald = Oswald({ subsets: ["latin"], weight: ["400", "600", "700"] })

export const metadata: Metadata = {
  // <CHANGE> Updated metadata for burger restaurant
  title: "BURGER KINGO - La Verdadera Bestia",
  description: "Las mejores hamburguesas gourmet. Carne 100% roast beef, pan de papa y nuestra salsa secreta.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

import { ConfigProvider } from "@/context/config-context"
import { OrderProvider } from "@/context/order-context"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <ConfigProvider>
          <OrderProvider>{children}</OrderProvider>
        </ConfigProvider>
        <Analytics />
      </body>
    </html>
  )
}
