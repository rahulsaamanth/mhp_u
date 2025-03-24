"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export default function Advert() {
  const adverts = [
    "🎉  Get 20% off on all Ayurvedic products!",
    "🌿  Free shipping on orders above ₹999",
    "⚡  Flash Sale: Buy 2 Get 1 Free on all supplements",
  ]
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Update current index when slide changes
  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }
    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  // Function to advance slide with smooth transition
  const advanceSlide = useCallback(() => {
    if (!api) return
    api.scrollNext()
  }, [api])

  // Set up automatic slide advancement
  useEffect(() => {
    const timer = setInterval(advanceSlide, 3000)
    return () => clearInterval(timer)
  }, [advanceSlide])

  if (!isVisible) return null

  return (
    <div className="relative">
      <Carousel
        className="w-full text-center py-2 bg-black"
        setApi={setApi}
        opts={{
          loop: true,
          startIndex: 0,
          // initial: 0,
        }}
      >
        <CarouselContent>
          {adverts.map((advert, index) => (
            <CarouselItem
              key={index}
              className="text-xs md:text-sm text-white mx-auto w-full"
            >
              {advert}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden" />
        <CarouselNext className="hidden" />
      </Carousel>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:underline cursor-pointer"
        aria-label="Close advertisement"
      >
        ✕
      </button>
    </div>
  )
}
