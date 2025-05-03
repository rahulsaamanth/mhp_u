import "./styles/globals.css"
import type { Metadata } from "next"
import Advert from "@/components/advert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { auth as Auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import { CartProvider } from "./cart/_components/cart-provider"
import { Providers } from "@/lib/providers"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { CartMergeHandler } from "@/components/cart-merge-handler"
import { DM_Sans } from "next/font/google"

const dmSans = DM_Sans({ subsets: ["latin"] })

// Using local Menco font defined in globals.css
export const metadata: Metadata = {
  title: "Homeo South - Buy Homeopathic Medicines Online",
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
          // className="font-['Menco'] antialiased"
          className={`${dmSans.className} antialiased`}
          // suppressHydrationWarning={true}
        >
          <NuqsAdapter>
            <Providers>
              <CartProvider>
                <CartMergeHandler />
                <Advert />
                <Header />
                {children}
                {auth}
                <Footer />
              </CartProvider>
            </Providers>
          </NuqsAdapter>
          <Toaster
            richColors
            theme="light"
            toastOptions={{
              duration: 1500,
            }}
            position="top-right"
          />
        </body>
      </html>
    </SessionProvider>
  )
}
