"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const DesktopNavbar = () => {
  return (
    <nav className="hidden md:grid place-items-center md:border-t md:border-b w-full">
      <div className="container mx-auto py-2">
        {/* Desktop Navigation */}
        <DesktopNavigation />
      </div>
    </nav>
  )
}

// Nested Popover Hook - to help with closing parent popovers
const useNestedPopover = () => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    setIsOpen,
    onOpenChange: (open: boolean | ((prevState: boolean) => boolean)) =>
      setIsOpen(open),
  }
}

// Submenu Link
function SubmenuLink({
  title,
  href,
  onClick,
}: {
  title: string
  href: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname.includes(href.replace("/", ""))

  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-accent px-4 py-2 border-b hover:border-b transition-all duration-150 active:scale-95 text-brand-foreground",
        isActive
          ? "text-brand border-b border-brand"
          : "hover:text-brand hover:border-brand"
      )}
      onClick={onClick}
    >
      {title}
    </Link>
  )
}

// Desktop Navigation Component
const DesktopNavigation = () => {
  const aboutPopover = useNestedPopover()
  const homeopathicPopover = useNestedPopover()
  const personalCarePopover = useNestedPopover()
  const otherProductsPopover = useNestedPopover()

  const pathname = usePathname()

  return (
    <div className="flex justify-center items-center w-full gap-3 xl:gap-6">
      {/* HOME */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-semibold hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base text-brand-foreground",
          pathname === "/" ? "text-brand underline" : ""
        )}
      >
        <Link
          href="/"
          className="font-medium transition-all duration-150 active:scale-95"
        >
          HOME
        </Link>
      </Button>

      {/* ABOUT US */}
      <Popover
        open={aboutPopover.isOpen}
        onOpenChange={aboutPopover.onOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className={cn(
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base !px-0 text-brand-foreground",
              pathname.includes("/about/") ? "text-brand underline" : ""
            )}
          >
            ABOUT US
            <ChevronDown className="size-4 -ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col rounded-none p-0">
          <SubmenuLink
            href="/about/who-we-are"
            title="Company Profile"
            onClick={() => {
              aboutPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/about/message"
            title="Founder's Message"
            onClick={() => {
              aboutPopover.onOpenChange(false)
            }}
          />
        </PopoverContent>
      </Popover>

      {/* HOMEOPATHIC */}
      <Popover
        open={homeopathicPopover.isOpen}
        onOpenChange={homeopathicPopover.onOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className={cn(
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base !px-0 text-brand-foreground",
              pathname.includes("/products/homeopathic")
                ? "text-brand underline"
                : ""
            )}
          >
            HOMEOPATHY
            <ChevronDown className="size-4 -ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col rounded-none p-0 border-0">
          <SubmenuLink
            href="/products/homeopathy/dilutions"
            title="Dilutions (Potencies)"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathy/mothertinctures"
            title="Mother Tinctures"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathy/biochemics"
            title="Biochemics"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathy/biocombinations"
            title="Biocombinations"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/trituration"
            title="Trituration Tablets"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/bach-flower"
            title="Bach Flower Remedies"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
        </PopoverContent>
      </Popover>

      {/* PERSONAL CARE */}
      <Popover
        open={personalCarePopover.isOpen}
        onOpenChange={personalCarePopover.onOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className={cn(
              "h-auto cursor-pointer font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base !p-0 text-brand-foreground",
              pathname.includes("/products/personal-care")
                ? "text-brand underline"
                : ""
            )}
          >
            PERSONAL CARE
            <ChevronDown className="size-4 -ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col rounded-none p-0 border-0">
          <SubmenuLink
            href="/products/personalcare"
            title="Skin Care"
            onClick={() => {
              personalCarePopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/personal-care/hair"
            title="Hair Care"
            onClick={() => {
              personalCarePopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/personal-care/hygiene"
            title="Hygiene"
            onClick={() => {
              personalCarePopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/personal-care/baby"
            title="Baby Care"
            onClick={() => {
              personalCarePopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/personal-care/oral"
            title="Oral Care"
            onClick={() => {
              personalCarePopover.onOpenChange(false)
            }}
          />
        </PopoverContent>
      </Popover>

      {/* AILMENT */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base text-brand-foreground",
          pathname.includes("/ailments") ? "text-brand underline" : ""
        )}
      >
        <Link
          href="/ailments"
          className="font-medium transition-all duration-150 active:scale-95"
        >
          AILMENT
        </Link>
      </Button>

      {/* BRANDS */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base text-brand-foreground",
          pathname.includes("/brands") ? "text-brand underline" : ""
        )}
      >
        <Link
          href="/brands"
          className="font-medium transition-all duration-150 active:scale-95"
        >
          BRANDS
        </Link>
      </Button>

      {/* OTHER PRODUCTS */}
      <Popover
        open={otherProductsPopover.isOpen}
        onOpenChange={otherProductsPopover.onOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className={cn(
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base !px-0 text-brand-foreground",
              pathname.includes("/products/") &&
                (pathname.includes("/ointments") ||
                  pathname.includes("/herbals") ||
                  pathname.includes("/eye-ear-drops"))
                ? "text-brand underline"
                : ""
            )}
          >
            OTHER PRODUCTS
            <ChevronDown className="size-4 -ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col rounded-none p-0">
          <SubmenuLink
            href="/products/ointments"
            title="OINTMENTS"
            onClick={() => {
              otherProductsPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/herbals"
            title="HERBALS"
            onClick={() => {
              otherProductsPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/eye-ear-drops"
            title="EYE/EAR DROP"
            onClick={() => {
              otherProductsPopover.onOpenChange(false)
            }}
          />
        </PopoverContent>
      </Popover>

      {/* ABOUT HOMEOPATHY */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base text-brand-foreground",
          pathname.includes("/about-homeopathy") ? "text-brand underline" : ""
        )}
      >
        <Link
          href="/about-homeopathy"
          className="font-medium transition-all duration-150 active:scale-95"
        >
          ABOUT HOMEOPATHY
        </Link>
      </Button>
    </div>
  )
}

export default DesktopNavbar
