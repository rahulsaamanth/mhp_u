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

  const copyToClipboard = () => {
    const couponCode = "WELCOME10"

    // Try to use the Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(couponCode)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          fallbackCopyToClipboard(couponCode)
        })
    } else {
      // Fallback for browsers without clipboard API support
      fallbackCopyToClipboard(couponCode)
    }
  }

  const fallbackCopyToClipboard = (text: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement("textarea")
      textArea.value = text

      // Make the textarea out of viewport
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      // Execute the copy command
      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)

      if (successful) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error("Fallback copy method failed: ", err)
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
          <CarouselItem>
            <section className="h-[60vh] relative min-w-full w-full overflow-hidden">
              {/* Full-width background image with overlay - only for small to medium screens */}
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

              {/* Half color, half image for large screens */}
              <div className="hidden lg:block absolute inset-0 z-0">
                {/* Brand color block on left half */}
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-brand">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
                </div>
                {/* Image on right half with gradient overlay */}
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

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full">
                <div className="max-w-xl space-y-8 xs:space-y-16 xl:space-y-20 z-10 h-full grid place-content-center">
                  {/* Title and intro group */}
                  <div className="space-y-3 sm:space-y-4">
                    <h1
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Natural Healing For Modern Living
                    </h1>

                    <span
                      className="text-base sm:text-xl text-gray-200 max-w-lg italic inline-block opacity-0 sm:opacity-100"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      Discover premium homeopathic remedies that harness the
                      power of nature for your wellbeing.
                    </span>
                  </div>

                  {/* Offers group */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white/30 backdrop-blur-lg p-3 inline-block text-sm sm:text-base border border-white/40 shadow-md transition-all duration-300 hover:bg-white/40 leading-relaxed rounded-lg">
                      <span
                        className="font-bold sm:font-semibold text-white"
                        style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.4)" }}
                      >
                        Use code:{" "}
                      </span>
                      <span
                        onClick={copyToClipboard}
                        className="relative bg-white text-brand p-1 sm:px-3.5 sm:py-2 rounded font-bold cursor-copy hover:bg-gray-100 active:bg-gray-200 shadow-sm transition-all duration-300 group"
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
                        className="ml-2 text-white font-bold sm:font-semibold"
                        style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.4)" }}
                      >
                        for 10% off{" "}
                        <span className="max-sm:hidden">
                          on orders above ₹300
                        </span>
                      </span>
                    </div>

                    <Link
                      href="/products/all"
                      className="inline-flex items-center justify-center cursor-pointer px-4 py-3 bg-transparent text-white hover:text-brand border-2 hover:bg-white hover:shadow-lg font-bold transition-all duration-300 tracking-wide focus:bg-white focus:text-brand"
                    >
                      Shop & Save Now
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Brand Showcase Carousel Item */}
          <CarouselItem>
            <section className="h-[60vh] relative min-w-full w-full overflow-hidden">
              {/* Full-width background image with overlay - only visible on smaller screens */}
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

              {/* Half color, half image for large screens */}
              <div className="hidden lg:block absolute inset-0 z-0">
                {/* Dark slate color block on left half */}
                <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-black">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
                </div>
                {/* Image on right half with gradient overlay */}
                <div className="absolute top-0 right-0 bottom-0 w-1/2">
                  <Image
                    src="/assets/hero2.jpg"
                    alt="Background image"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black opacity-100" />
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full">
                <div className="max-w-xl space-y-2 xs:space-y-8 xl:space-y-12 z-10 h-full grid place-content-center">
                  {/* Title and intro group */}
                  <div className="space-y-3 sm:space-y-4">
                    <h2
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white"
                      style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      Trusted Brands, One Destination
                    </h2>

                    <span
                      className="text-base sm:text-xl text-gray-200 max-w-lg inline-block opacity-0 sm:opacity-100 italic"
                      style={{
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      Discover premium homeopathic products from leading
                      manufacturers all in one place
                    </span>
                  </div>

                  {/* Responsive brand grid - shows different number of brands based on screen size */}
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3  lg:grid-cols-6 gap-2 sm:gap-3">
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
                        className={`bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg h-14 sm:h-16 md:h-16 lg:h-16 w-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl
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
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Link
                      href="/brands"
                      className="inline-flex items-center justify-center cursor-pointer px-4 py-3 bg-transparent text-white hover:text-black border-2 hover:bg-white hover:shadow-lg font-bold transition-all duration-300 tracking-wide focus:bg-white focus:text-black"
                    >
                      Explore All Brands
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>

        {/* Dot indicators */}
        <div className="flex justify-center space-x-1.5 absolute bottom-4 left-0 right-0">
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
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-28 w-14 rounded-r-full rounded-l-none border-2 border-white/70 bg-brand/70 backdrop-blur-sm hover:bg-brand/90 transition-all shadow-lg z-30 text-white"
          size="lg"
        />
        <CarouselNext
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-28 w-14 rounded-l-full rounded-r-none border-2 border-white/70 bg-brand/70 backdrop-blur-sm hover:bg-brand/90 transition-all shadow-lg z-30 text-white"
          size="lg"
        />
      </Carousel>
    </div>
  )
}
