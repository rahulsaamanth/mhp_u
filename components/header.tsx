import { Search, ShoppingCart } from "lucide-react"
// import Image from "next/image";
import Image from "next/image"
import Link from "next/link"
import Navbar from "./navbar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Header() {
  return (
    <header className="flex w-full items-center justify-center gap-x-20 py-2 px-8">
      {/* Logo */}
      <Link href="/">
        <Image src="/_text_logo.png" alt="LOGO" width={160} height={100} />
      </Link>
      {/* Search */}
      <div className="flex w-6xl items-center justify-center">
        <Input
          className="rounded-none bg-none focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none"
          placeholder="Search products by ailment,  brand,  category,  potency..."
        />
        <Button
          variant="default"
          className="bg-brand hover:bg-brand cursor-pointer rounded-none"
        >
          <Search />
        </Button>
      </div>

      {/* cart and login */}
      <div className="flex items-center justify-center gap-4">
        <Link href="/cart" className="cursor-pointer">
          <ShoppingCart className="size-4 sm:size-8 hover:text-brand" />
        </Link>
        <Link href="/login">
          <Button
            variant="link"
            className="cursor-pointer font-medium text-sm hover:text-brand"
          >
            Login/Register
          </Button>
        </Link>
      </div>
    </header>
  )
}
