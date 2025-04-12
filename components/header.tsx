import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Cart from "./cart"
import MobileNavigation from "./mobile-navbar"
import DesktopNavbar from "./navbar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import UserButton from "./user-button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <section className="flex w-full flex-col items-center justify-center px-4 py-2 md:flex-row md:gap-x-12 lg:gap-x-32">
        {/* Logo */}
        <div className="flex justify-between items-center w-full md:w-auto shrink-0">
          <Link href="/" className="relative">
            <Image
              src="/text_logo.png"
              alt="LOGO"
              width={160}
              height={100}
              className="object-contain w-[100px] h-[80px] md:w-[120px] md:h-[100px] lg:w-[160px] lg:h-[100px]"
              priority
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
        <div className="w-full max-w-2xl px-2 sm:px-0">
          <div className="flex items-center justify-center">
            <Input
              className="rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 border-r-0"
              placeholder={
                "Search products by ailment, brand, category, potency..."
              }
              // Mobile placeholder using Tailwind's sr-only
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
