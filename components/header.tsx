"use client"

import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMediaQuery } from "react-responsive"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import DesktopNavbar from "./navbar"
import Cart from "./cart"
import UserButton from "./user-button"
import MobileNavigation from "./mobile-navbar"

export default function Header() {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
  const isDesktop = useMediaQuery({ minWidth: 1024 })

  const getLogoSize = () => {
    if (isMobile) return { width: 100, height: 80 }
    if (isTablet) return { width: 120, height: 100 }
    return { width: 160, height: 100 }
  }

  const { width, height } = getLogoSize()

  return (
    <header className="sticky top-0 z-50 bg-white">
      <section className="flex w-full flex-col items-center justify-center gap-4 px-4 py-2 md:flex-row md:gap-x-12 lg:gap-x-32 md:px-8">
        {/* Logo */}
        <div className="flex justify-between items-center w-full md:w-auto shrink-0">
          <Link href="/" className="relative">
            <Image
              src="/text_logo.png"
              alt="LOGO"
              width={width}
              height={height}
              priority
              className="object-contain"
            />
          </Link>
          {/* Mobile cart and login */}
          <div className="flex md:hidden items-center justify-center gap-3 md:gap-4 ml-auto">
            <UserButton />
            <Cart />
            <div className="block md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center">
            <Input
              className="rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 border-r-0"
              placeholder={
                isMobile
                  ? "Search products..."
                  : "Search products by ailment, brand, category, potency..."
              }
            />
            <Button
              variant="default"
              className="bg-brand hover:bg-brand/90 rounded-none transition-colors cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop cart and login */}
        <div className="hidden md:flex items-center justify-center gap-4">
          <Cart />
          <UserButton />
        </div>
      </section>
      <DesktopNavbar />
    </header>
  )
}
