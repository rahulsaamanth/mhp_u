import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./styles/globals.css"
import Advert from "@/components/advert"
import Footer from "@/components/footer"
import Header from "@/components/header"

import { SessionProvider } from "next-auth/react"
import { auth as Auth } from "@/auth"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Buy Homeopathic Remedies Online - Homeo South",
  description: "Online Homeopathic remedies for all your ailments",
}

export default async function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode
  auth: React.ReactNode
}>) {
  const session = await Auth()

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${dmSans.className} antialiased`}
          // suppressHydrationWarning={true}
        >
          <Advert />
          <Header />
          {children}
          {auth}
          <Footer />
        </body>
      </html>
    </SessionProvider>
  )
}
