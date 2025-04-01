import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import Link from "next/link"

export default function MobileNavigation() {
  return (
    <div className="flex items-center justify-between">
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
          <MobileNavigationHelper />
        </SheetContent>
      </Sheet>
    </div>
  )
}

const MobileNavigationHelper = () => {
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
