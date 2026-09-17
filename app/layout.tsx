import type { Metadata } from "next"
import { Baloo_2, Nunito_Sans } from "next/font/google"
import "./globals.css"

const heading = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
})

const body = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Jesperhus AI-assistent",
  description: "Prototype: AI-assistent for Jesperhus Feriepark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body className={`${heading.variable} ${body.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
