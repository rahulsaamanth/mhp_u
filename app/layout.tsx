import type { Metadata } from "next"
import { Geist, Geist_Mono, Roboto } from "next/font/google"
import "./globals.css"
import Advert from "@/components/advert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const roboto = Roboto({
  weight: ["100", "200", "400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Buy Homeopathic Remedies Online - Homeo South",
  description: "Onlie Homeopathic remedies for all your ailments",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <Advert />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
