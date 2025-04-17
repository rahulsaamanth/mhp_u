import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function MobileNavigation() {
  return (
    <div className="flex items-center justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="border-none">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] overflow-y-auto sm:w-[350px] p-0"
        >
          <SheetHeader className="border-b p-4 bg-brand/5">
            <SheetTitle className="text-brand">
              <div className="flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                HOMEO SOUTH
              </div>
            </SheetTitle>
          </SheetHeader>
          <MobileNavigationHelper />
        </SheetContent>
      </Sheet>
    </div>
  )
}

const MobileNavigationHelper = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="py-2">
      <Accordion type="single" collapsible className="w-full">
        {/* HOME */}
        <AccordionItem value="home" className="border-b-0">
          <SheetClose asChild>
            <Link
              href="/"
              className={cn(
                "flex w-full py-3 px-6 font-medium hover:bg-brand/5 transition-all duration-150 active:scale-95",
                isActive("/") && "text-brand font-semibold bg-brand/5"
              )}
            >
              HOME
            </Link>
          </SheetClose>
        </AccordionItem>

        {/* ABOUT US */}
        <AccordionItem value="about" className="border-b-0">
          <AccordionTrigger
            className={cn(
              "py-3 px-6 font-medium hover:bg-brand/5 transition-colors hover:no-underline",
              isActive("/about") && "text-brand font-semibold bg-brand/5"
            )}
          >
            ABOUT US
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="flex flex-col border-l-2 border-brand/20 ml-6">
              <SheetClose asChild>
                <Link
                  href="/about/who-we-are"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/about/who-we-are") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Company Profile
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/about/message"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/about/message") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Founder's Message
                </Link>
              </SheetClose>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* HOMEOPATHIC */}
        <AccordionItem value="homeopathic" className="border-b-0">
          <AccordionTrigger
            className={cn(
              "py-3 px-6 font-medium hover:bg-brand/5 transition-colors hover:no-underline",
              isActive("/products/homeopathy") &&
                "text-brand font-semibold bg-brand/5"
            )}
          >
            HOMEOPATHIC
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="flex flex-col border-l-2 border-brand/20 ml-6">
              <SheetClose asChild>
                <Link
                  href="/products/homeopathy/dilutions"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/homeopathy/dilutions") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Dilutions (Potencies)
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/homeopathy/mothertinctures"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/homeopathy/mothertinctures") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Mother Tinctures
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/homeopathy/biochemics"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/homeopathy/biochemics") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Biochemic & Biocombinations
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/trituration"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/trituration") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Trituration Tablets
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/bach-flower"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/bach-flower") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Bach Flower Remedies
                </Link>
              </SheetClose>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PERSONAL CARE */}
        <AccordionItem value="personal-care" className="border-b-0">
          <AccordionTrigger
            className={cn(
              "py-3 px-6 font-medium hover:bg-brand/5 transition-colors hover:no-underline",
              isActive("/products/personal-care") &&
                "text-brand font-semibold bg-brand/5"
            )}
          >
            PERSONAL CARE
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="flex flex-col border-l-2 border-brand/20 ml-6">
              <SheetClose asChild>
                <Link
                  href="/products/personalcare"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/personalcare") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Skin Care
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/personal-care/hair"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/personal-care/hair") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Hair Care
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/personal-care/hygiene"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/personal-care/hygiene") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Hygiene
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/personal-care/baby"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/personal-care/baby") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Baby Care
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/personal-care/oral"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/personal-care/oral") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  Oral Care
                </Link>
              </SheetClose>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* AILMENT */}
        <AccordionItem value="ailment" className="border-b-0">
          <SheetClose asChild>
            <Link
              href="/ailments"
              className={cn(
                "flex w-full py-3 px-6 font-medium hover:bg-brand/5 transition-all duration-150 active:scale-95",
                isActive("/ailments") && "text-brand font-semibold bg-brand/5"
              )}
            >
              AILMENTS
            </Link>
          </SheetClose>
        </AccordionItem>

        {/* BRANDS */}
        <AccordionItem value="brands" className="border-b-0">
          <SheetClose asChild>
            <Link
              href="/brands"
              className={cn(
                "flex w-full py-3 px-6 font-medium hover:bg-brand/5 transition-all duration-150 active:scale-95",
                isActive("/brands") && "text-brand font-semibold bg-brand/5"
              )}
            >
              BRANDS
            </Link>
          </SheetClose>
        </AccordionItem>

        {/* OTHER PRODUCTS */}
        <AccordionItem value="other-products" className="border-b-0">
          <AccordionTrigger
            className={cn(
              "py-3 px-6 font-medium hover:bg-brand/5 transition-all duration-150 active:scale-95 hover:no-underline",
              (isActive("/products/ointments") ||
                isActive("/products/herbals") ||
                isActive("/products/eye-ear-drops")) &&
                "text-brand font-semibold bg-brand/5"
            )}
          >
            OTHER PRODUCTS
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="flex flex-col border-l-2 border-brand/20 ml-6">
              <SheetClose asChild>
                <Link
                  href="/products/ointments"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/ointments") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  OINTMENTS
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/herbals"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/herbals") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  HERBALS
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/products/eye-ear-drops"
                  className={cn(
                    "py-2 px-6 hover:bg-brand/5 transition-all duration-150 active:scale-95",
                    isActive("/products/eye-ear-drops") &&
                      "text-brand font-semibold bg-brand/5"
                  )}
                >
                  EYE/EAR DROP
                </Link>
              </SheetClose>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ABOUT HOMEOPATHY */}
        <AccordionItem value="about-homeopathy" className="border-b-0">
          <SheetClose asChild>
            <Link
              href="/about-homeopathy"
              className={cn(
                "flex w-full py-3 px-6 font-medium hover:bg-brand/5 transition-all duration-150 active:scale-95",
                isActive("/about-homeopathy") &&
                  "text-brand font-semibold bg-brand/5"
              )}
            >
              ABOUT HOMEOPATHY
            </Link>
          </SheetClose>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
