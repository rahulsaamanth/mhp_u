"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { memo, useState } from "react"

const Navbar = () => {
  return (
    <nav className="grid place-items-center border-t border-b">
      <div className="container mx-auto py-2">
        {/* Desktop Navigation */}
        <div className="hidden items-center justify-start lg:flex">
          <DesktopNavigation />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-between lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] overflow-y-auto sm:w-[350px]"
            >
              <SheetTitle>Menu</SheetTitle>
              <MobileNavigation />
            </SheetContent>
          </Sheet>
        </div>
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
  return (
    <Link
      href={href}
      className="hover:bg-accent hover:text-brand hover:border-brand px-4 py-2 hover:border-b"
      onClick={onClick}
    >
      {title}
    </Link>
  )
}

// Desktop Navigation Component
const DesktopNavigation = memo(() => {
  const aboutPopover = useNestedPopover()
  const homeopathicPopover = useNestedPopover()
  const personalCarePopover = useNestedPopover()
  const otherProductsPopover = useNestedPopover()

  const pathname = usePathname()

  return (
    <div className="flex justify-center items-center space-x-8 w-full">
      {/* HOME */}
      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-semibold hover:text-[#1DA827] hover:underline hover:underline-offset-8",
          pathname === "/" ? "text-brand" : ""
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
            className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
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
            className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
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
            className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
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
        className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
      >
        <Link href="/products/ointments" className="font-medium">
          AILMENT
        </Link>
      </Button>

      {/* BRANDS */}
      <Button
        variant="link"
        className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
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
            className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
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
        className="h-auto cursor-pointer p-0 font-medium hover:text-[#1DA827] hover:underline hover:underline-offset-8"
      >
        <Link href="/products/about-homeopathy" className="font-medium">
          ABOUT HOMEOPATHY
        </Link>
      </Button>
    </div>
  )
})

// Mobile Navigation Component using Accordion
const MobileNavigation = () => {
  return (
    <div className="py-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="home">
          <SheetClose asChild>
            <Link href="/" className="flex w-full py-2">
              HOME
            </Link>
          </SheetClose>
        </AccordionItem>

        <AccordionItem value="about">
          <AccordionTrigger>ABOUT US</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 pl-4">
              <SheetClose asChild>
                <Link href="/about/who-we-are" className="py-1">
                  Who We Are
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/about/our-team" className="py-1">
                  Our Team
                </Link>
              </SheetClose>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="products">
          <AccordionTrigger>OUR PRODUCTS</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 pl-4">
              <SheetClose asChild>
                <Link href="/products" className="py-1">
                  All Products
                </Link>
              </SheetClose>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="homoeopathic">
                  <AccordionTrigger className="py-1">
                    Homoeopathic
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-4">
                      <SheetClose asChild>
                        <Link
                          href="/products/homoeopathic/dilutions"
                          className="py-1"
                        >
                          Dilutions
                        </Link>
                      </SheetClose>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="biochemics">
                          <AccordionTrigger className="py-1">
                            Bio Chemics & Bio Combinations
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col space-y-2 pl-4">
                              <SheetClose asChild>
                                <Link
                                  href="/products/homoeopathic/biochemics/tablets"
                                  className="py-1"
                                >
                                  Bio Chemic Tablets
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/products/homoeopathic/biochemics/dilutions"
                                  className="py-1"
                                >
                                  Bio Chemic Dilutions
                                </Link>
                              </SheetClose>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <SheetClose asChild>
                        <Link
                          href="/products/homoeopathic/mother-tinctures"
                          className="py-1"
                        >
                          Mother Tinctures
                        </Link>
                      </SheetClose>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <SheetClose asChild>
                <Link href="/products/ointments" className="py-1">
                  Ointments
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/products/herbals" className="py-1">
                  Herbals
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/products/eye-ear-drops" className="py-1">
                  Eye/Ear Drop
                </Link>
              </SheetClose>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ailment">
          <SheetClose asChild>
            <Link href="/ailment" className="flex w-full py-2">
              AILMENT
            </Link>
          </SheetClose>
        </AccordionItem>

        <AccordionItem value="about-homoeopathy">
          <SheetClose asChild>
            <Link href="/about-homoeopathy" className="flex w-full py-2">
              ABOUT HOMOEOPATHY
            </Link>
          </SheetClose>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Navbar
