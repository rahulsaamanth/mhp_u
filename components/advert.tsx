"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  const count = 5

  // Update current index when slide changes
  useEffect(() => {
    if (!api) {
      return
    }

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

    if (current === count - 1) {
      // If at last slide, first silently jump to start without animation
      // then animate to the next slide
      api.scrollTo(0, false)
      setTimeout(() => api.scrollNext(), 50)
    } else {
      api.scrollNext()
    }
  }, [api, current, count])

  // Set up automatic slide advancement
  useEffect(() => {
    const timer = setInterval(advanceSlide, 3000)
    return () => clearInterval(timer)
  }, [advanceSlide])

  return (
    <Carousel
      className="w-full text-center py-2 bg-black"
      setApi={setApi}
      opts={{ loop: true }}
    >
      <CarouselContent className="w-full">
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
  )
}
