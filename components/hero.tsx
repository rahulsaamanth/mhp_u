"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { eq, and, gt, or, isNull, desc } from "drizzle-orm"
import { db } from "@/db/db"
import { discountCode } from "@rahulsaamanth/mhp-schema"

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveSlide(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  const copyToClipboard = async () => {
    try {
      // Find an active welcome discount code
      const welcomeCode = await db.query.discountCode.findFirst({
        where: and(
          eq(discountCode.isActive, true),
          or(
            isNull(discountCode.expiresAt),
            gt(discountCode.expiresAt, new Date())
          ),
          or(
            eq(discountCode.limit, 0),
            gt(discountCode.limit, discountCode.usageCount)
          )
        ),
        orderBy: desc(discountCode.discountAmount),
      })

      const couponCode = welcomeCode?.code || "WELCOME10"
      await navigator.clipboard.writeText(couponCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="relative">
      <Carousel
        plugins={[
          Autoplay({
            delay: 8000,
          }),
        ]}
        setApi={setApi}
      >
        <CarouselContent>
          <CarouselItem className="h-[48vh] xs:h-[40vh]">
            <section className="h-full relative min-w-full w-full overflow-hidden">
              <div className="absolute inset-0 z-0 lg:hidden">
                <Image
                  src="/assets/hero.jpg"
                  alt="Background image"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
              </div>

              <div className="hidden lg:block absolute inset-0 z-0">
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-brand">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
                </div>
                <div className="absolute top-0 right-0 bottom-0 w-1/2">
                  <Image
                    src="/assets/hero.jpg"
                    alt="Background image"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-brand opacity-100" />
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-20 h-full">
                <div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-3 xs:space-y-4 sm:space-y-5 xl:space-y-6 z-10 h-full grid place-content-center">
                  <div className="space-y-2 sm:space-y-3 xl:space-y-6">
                    <h1
                      className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Natural Healing For Modern Living
                    </h1>

                    <span
                      className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xs md:max-w-md lg:max-w-lg italic hidden md:inline-block"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      Discover premium homeopathic remedies that harness the
                      power of nature for your wellbeing.
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4 xl:space-y-6 flex flex-col">
                    <div className="bg-white/30 backdrop-blur-lg p-1.5 sm:p-2 inline-block text-xs xs:text-sm sm:text-base border border-white/40 shadow-md transition-all duration-300 hover:bg-white/40 leading-relaxed rounded-lg self-start">
                      <span
                        className="font-bold sm:font-semibold text-white"
                        style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.4)" }}
                      >
                        Use:{" "}
                      </span>
                      <span
                        onClick={copyToClipboard}
                        className="relative bg-white text-brand px-1.5 py-0.5 xs:p-1.5 sm:px-2.5 sm:py-1.5 rounded font-bold cursor-copy hover:bg-gray-100 active:bg-gray-200 shadow-sm transition-all duration-300 group"
                        aria-label="Copy coupon code WELCOME10"
                      >
                        WELCOME10
                        {copied && (
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                        <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/40 rounded pointer-events-none"></span>
                      </span>
                      <span
                        className="ml-1 xs:ml-2 text-white text-xs xs:text-sm sm:text-base font-bold sm:font-semibold"
                        style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.4)" }}
                      >
                        10% off{" "}
                        <span className="max-sm:hidden">above ₹300</span>
                      </span>
                    </div>

                    <Link
                      href="/products/all"
                      className="inline-flex items-center justify-center cursor-pointer px-2.5 py-1.5 xs:px-3.5 xs:py-2 sm:px-4 sm:py-2.5 bg-transparent text-white hover:text-brand border border-white hover:bg-white hover:shadow-lg font-bold transition-all duration-300 tracking-wide focus:bg-white focus:text-brand text-sm xs:text-base sm:text-lg self-start"
                    >
                      Shop Now & Save
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          <CarouselItem className="h-[48vh] xs:h-[40vh]">
            <section className="h-full relative min-w-full w-full overflow-hidden">
              <div className="absolute inset-0 z-0 lg:hidden">
                <Image
                  src="/assets/hero2.jpg"
                  alt="Background image"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
              </div>

              <div className="hidden lg:block absolute inset-0 z-0">
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-brand-foreground">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
                </div>
                <div className="absolute top-0 right-0 bottom-0 w-1/2">
                  <Image
                    src="/assets/hero2.jpg"
                    alt="Background image"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-stone-900 opacity-100" />
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-20 h-full">
                <div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-3 xs:space-y-4 sm:space-y-5 z-10 h-full grid place-content-center">
                  <div className="space-y-2 sm:space-y-3">
                    <h2
                      className="text-2xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Trusted Brands, One Destination
                    </h2>

                    <span
                      className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xs md:max-w-md lg:max-w-lg hidden md:inline-block italic"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      Discover premium homeopathic products from leading
                      manufacturers all in one place
                    </span>
                  </div>

                  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 xs:gap-1.5 sm:gap-2">
                    {[
                      "sbl.png",
                      "Reckeweg.png",
                      "adel.png",
                      "bakson.png",
                      "allen.png",
                      "schwabe.png",
                      "medisynth.png",
                      "st-georges.png",
                      "fathermuller-logo.png",
                      "wheezal.png",
                      "bahola.webp",
                      "allenlab.png",
                    ].map((brand, index) => (
                      <div
                        key={index}
                        className={`bg-white/90 backdrop-blur-sm rounded-lg p-1 xs:p-1.5 sm:p-2 shadow-lg h-8 xs:h-10 sm:h-12 md:h-14 lg:h-14 w-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl
                 ${index >= 4 && index < 6 ? "hidden md:flex" : ""} 
                 ${index >= 6 && index < 8 ? "hidden xl:flex" : ""}
                 ${index >= 8 ? "hidden xl:flex" : ""}
              `}
                      >
                        <Image
                          src={`/assets/brands/${brand}`}
                          alt={`${brand.split(".")[0]} brand logo`}
                          width={100}
                          height={50}
                          className="max-h-full w-auto object-contain max-w-[75%]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-1 sm:mt-2">
                    <Link
                      href="/brands"
                      className="inline-flex items-center justify-center cursor-pointer px-2.5 py-1.5 xs:px-3.5 xs:py-2 sm:px-4 sm:py-2.5 bg-transparent text-white hover:text-stone-900 border border-white hover:bg-white hover:shadow-lg font-bold transition-all duration-300 tracking-wide focus:bg-white focus:text-stone-900 text-sm xs:text-base sm:text-lg self-start"
                    >
                      Explore All Brands
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>

        <div className="flex justify-center space-x-1.5 absolute bottom-2 xs:bottom-3 sm:bottom-4 left-0 right-0">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "border-2 w-8"
                  : "bg-gray-300 hover:bg-brand/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <CarouselPrevious
          className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 h-10 sm:h-14 xl:h-28 w-10 sm:w-14 rounded-r-full rounded-l-none border-2 border-white/70 bg-brand/70 backdrop-blur-sm hover:bg-brand/90 transition-all shadow-lg z-30 text-white"
          size="sm"
        />
        <CarouselNext
          className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 h-10 sm:h-14 xl:h-28 w-10 sm:w-14 rounded-l-full rounded-r-none border-2 border-white/70 bg-brand/70 backdrop-blur-sm hover:bg-brand/90 transition-all shadow-lg z-30 text-white"
          size="sm"
        />
      </Carousel>
    </div>
  )
}
