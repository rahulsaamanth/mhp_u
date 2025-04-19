"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
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
        opts={{
          loop: true,
        }}
        // plugins={[
        //   Autoplay({
        //     delay: 1000,
        //   }),
        // ]}
      >
        <CarouselContent>
          <CarouselItem>
            <section className="h-[60vh] relative min-w-full w-full overflow-hidden bg-brand text-white">
              <div className="absolute top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-3/5 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/30 to-brand/5 z-10" />
                <Image
                  src="/assets/hero.jpg"
                  alt="Background image"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  priority
                />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full">
                <div className="max-w-xl space-y-8 xl:space-y-20 z-10 h-full grid place-content-center">
                  {/* Title and intro group */}
                  <div className="space-y-3 sm:space-y-4">
                    <h1
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white"
                      style={{
                        textShadow:
                          "0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Natural Healing For Modern Living
                    </h1>

                    <span
                      className="text-base sm:text-xl  md:text-white max-w-lg italic inline"
                      style={{
                        textShadow:
                          "0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)",
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
                    <div className="pt-2">
                      <Link
                        href="/products/all"
                        className="inline-flex items-center justify-center cursor-pointer px-4 md:px-8 py-2 md:py-4 bg-transparent text-white hover:bg-white hover:text-brand border-2 active:text-brand active:bg-white font-bold border-white hover:shadow-lg transition-all duration-300 tracking-wide"
                      >
                        Shop & Save Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious
          className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-12 rounded-r-full rounded-l-none border-0 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all text-white"
          size="lg"
        />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-24 w-12 rounded-l-full rounded-r-none border-0 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all text-white" />
      </Carousel>
    </div>
  )
}
