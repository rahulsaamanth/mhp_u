import "./styles/globals.css"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import Advert from "@/components/advert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { auth as Auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import { CartProvider } from "./cart/_components/cart-provider"

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Homeo South",
  description: "Homeo South - Premium quality homeopathic remedies from India",
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
          <CartProvider>
            <Advert />
            <Header />
            {children}
            {auth}
            <Footer />
            <Toaster
              richColors
              theme="light"
              toastOptions={{
                duration: 3000,
              }}
              position="top-right"
            />
          </CartProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
