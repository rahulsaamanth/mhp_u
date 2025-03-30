"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  return (
    <section>
      <div className="container mx-auto py-4">
        {/* Desktop Navigation */}
        <div className="hidden items-center justify-start space-x-6 lg:flex">
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
    </section>
  );
};

// Nested Popover Hook - to help with closing parent popovers
const useNestedPopover = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
    onOpenChange: (open: boolean | ((prevState: boolean) => boolean)) =>
      setIsOpen(open),
  };
};

// Desktop Navigation Component
const DesktopNavigation = () => {
  const aboutPopover = useNestedPopover();
  const productsPopover = useNestedPopover();
  const homoeopathicPopover = useNestedPopover();
  const bioChemicsPopover = useNestedPopover();

  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-4">
      {/* HOME */}

      <Button
        variant="link"
        className={cn(
          "h-auto cursor-pointer p-0 font-semibold text-neutral-600 underline underline-offset-4 hover:text-[#1DA827]",
          pathname.includes("/") ? "text-brand" : "",
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
            className="h-auto cursor-pointer p-0 font-medium underline underline-offset-4 hover:text-[#1DA827]"
          >
            ABOUT US ⏷
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <div className="flex flex-col py-2">
            <Link
              href="/about/who-we-are"
              className="hover:bg-accent px-4 py-2"
            >
              Who We Are
            </Link>
            <Link href="/about/our-team" className="hover:bg-accent px-4 py-2">
              Our Team
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      {/* OUR PRODUCTS */}
      <Popover
        open={productsPopover.isOpen}
        onOpenChange={productsPopover.onOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className="h-auto cursor-pointer p-0 font-medium underline underline-offset-4 hover:text-[#1DA827]"
          >
            OUR PRODUCTS ⏷
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <div className="flex flex-col py-2">
            <Link href="/products" className="hover:bg-accent px-4 py-2">
              All Products
            </Link>

            {/* Homoeopathic - with nested popover */}
            <div className="relative">
              <Popover
                open={homoeopathicPopover.isOpen}
                onOpenChange={homoeopathicPopover.onOpenChange}
              >
                <PopoverTrigger asChild>
                  <button
                    className="hover:bg-accent flex w-full items-center justify-between px-4 py-2 text-left text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Homoeopathic</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="start"
                  className="w-56 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col py-2">
                    <Link
                      href="/products/homoeopathic/dilutions"
                      className="hover:bg-accent px-4 py-2"
                      onClick={() => {
                        homoeopathicPopover.setIsOpen(false);
                        productsPopover.setIsOpen(false);
                      }}
                    >
                      Dilutions
                    </Link>

                    {/* Bio Chemics - nested popover */}
                    <div className="relative">
                      <Popover
                        open={bioChemicsPopover.isOpen}
                        onOpenChange={bioChemicsPopover.onOpenChange}
                      >
                        <PopoverTrigger asChild>
                          <button
                            className="hover:bg-accent flex w-full items-center justify-between px-4 py-2 text-left text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Bio Chemics & Bio Combinations</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="right"
                          align="start"
                          className="w-56 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col py-2">
                            <Link
                              href="/products/homoeopathic/biochemics/tablets"
                              className="hover:bg-accent px-4 py-2"
                              onClick={() => {
                                bioChemicsPopover.setIsOpen(false);
                                homoeopathicPopover.setIsOpen(false);
                                productsPopover.setIsOpen(false);
                              }}
                            >
                              Bio Chemic Tablets
                            </Link>
                            <Link
                              href="/products/homoeopathic/biochemics/dilutions"
                              className="hover:bg-accent px-4 py-2"
                              onClick={() => {
                                bioChemicsPopover.setIsOpen(false);
                                homoeopathicPopover.setIsOpen(false);
                                productsPopover.setIsOpen(false);
                              }}
                            >
                              Bio Chemic Dilutions
                            </Link>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Link
                      href="/products/homoeopathic/mother-tinctures"
                      className="hover:bg-accent px-4 py-2"
                      onClick={() => {
                        homoeopathicPopover.setIsOpen(false);
                        productsPopover.setIsOpen(false);
                      }}
                    >
                      Mother Tinctures
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Link
              href="/products/ointments"
              className="hover:bg-accent px-4 py-2"
              onClick={() => productsPopover.setIsOpen(false)}
            >
              Ointments
            </Link>
            <Link
              href="/products/herbals"
              className="hover:bg-accent px-4 py-2"
              onClick={() => productsPopover.setIsOpen(false)}
            >
              Herbals
            </Link>
            <Link
              href="/products/eye-ear-drops"
              className="hover:bg-accent px-4 py-2"
              onClick={() => productsPopover.setIsOpen(false)}
            >
              Eye/Ear Drop
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      {/* AILMENT */}
      <Button
        variant="link"
        className="h-auto cursor-pointer p-0 font-medium underline underline-offset-4 hover:text-[#1DA827]"
      >
        <Link href="/ailments" className="font-medium">
          AILMENT
        </Link>
      </Button>

      {/* ABOUT HOMOEOPATHY */}
      <Button
        variant="link"
        className="h-auto cursor-pointer p-0 font-medium underline underline-offset-4 hover:text-[#1DA827]"
      >
        <Link href="/about-homeo" className="font-medium">
          ABOUT HOMEOPATHY
        </Link>
      </Button>
    </div>
  );
};

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
  );
};

export default Navbar;
