"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
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
        "hover:bg-accent px-4 py-2 hover:border-b",
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
    <div className="flex justify-center items-center w-full gap-4 lg:gap-8">
      {/* HOME */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-semibold hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
          pathname === "/" ? "text-brand underline" : ""
        )}
      >
        <Link href="/" className="font-medium">
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
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
              pathname.includes("/about/") ? "text-brand underline" : ""
            )}
          >
            ABOUT US ⏷
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
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
              pathname.includes("/products/homeopathic")
                ? "text-brand underline"
                : ""
            )}
          >
            HOMEOPATHIC ⏷
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col rounded-none p-0">
          <SubmenuLink
            href="/products/homeopathic/dilutions"
            title="Dilutions (Potencies)"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathic/mother-tinctures"
            title="Mother Tinctures"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathic/biochemic"
            title="Biochemic & Biocombinations"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathic/trituration"
            title="Trituration Tablets"
            onClick={() => {
              homeopathicPopover.onOpenChange(false)
            }}
          />
          <SubmenuLink
            href="/products/homeopathic/bach-flower"
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
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
              pathname.includes("/products/personal-care")
                ? "text-brand underline"
                : ""
            )}
          >
            PERSONAL CARE ⏷
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-fit flex-col rounded-none p-0">
          <SubmenuLink
            href="/products/personal-care/skin"
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
          "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
          pathname.includes("/products/ointments") ? "text-brand underline" : ""
        )}
      >
        <Link href="/products/ointments" className="font-medium">
          AILMENT
        </Link>
      </Button>

      {/* BRANDS */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
          pathname.includes("/brands") ? "text-brand underline" : ""
        )}
      >
        <Link href="/brands" className="font-medium">
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
              "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
              pathname.includes("/products/") &&
                (pathname.includes("/ointments") ||
                  pathname.includes("/herbals") ||
                  pathname.includes("/eye-ear-drops"))
                ? "text-brand underline"
                : ""
            )}
          >
            OTHER PRODUCTS ⏷
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
          "h-auto cursor-pointer p-0 font-medium hover:text-brand hover:underline hover:underline-offset-8 text-xs lg:text-base",
          pathname.includes("/about-homeopathy") ? "text-brand underline" : ""
        )}
      >
        <Link href="/about-homeopathy" className="font-medium">
          ABOUT HOMEOPATHY
        </Link>
      </Button>
    </div>
  )
}

export default DesktopNavbar
