import { auth as Auth } from "@/auth"
import Advert from "@/components/advert"
import { AuthListener } from "@/components/auth/auth-listener"
import { CartMergeHandler } from "@/components/cart-merge-handler"
import Footer from "@/components/footer"
import Header from "@/components/header"
import JsonLd from "@/components/json-ld"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/lib/providers"
import { generateOrganizationSchema } from "@/lib/schema"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Raleway } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { CartProvider } from "./cart/_components/cart-provider"
import "./styles/globals.css"

const raleway = Raleway({ subsets: ["latin"] })

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

  const orgSchema = generateOrganizationSchema()

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <JsonLd data={orgSchema} />
        </head>
        <body className={`${raleway.className} antialiased`}>
          <NuqsAdapter>
            <Providers>
              <CartProvider>
                <CartMergeHandler />
                <AuthListener />
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
