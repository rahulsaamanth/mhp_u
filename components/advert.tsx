"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useCallback, useEffect, useState } from "react"

export default function Advert() {
  const adverts = [
    "🎉  Get 20% off on all Ayurvedic products!",
    "🚚  Free shipping on orders above ₹999",
    "⚡  Flash Sale: Buy 2 Get 1 Free on all supplements",
  ]
  const [api, setApi] = useState<CarouselApi>()
  const [isTabActive, setIsTabActive] = useState(true)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const advanceSlide = useCallback(() => {
    if (!api || !isTabActive) return
    api.scrollNext()
  }, [api, isTabActive])

  useEffect(() => {
    if (!isTabActive) return

    const timer = setInterval(advanceSlide, 4000)
    return () => clearInterval(timer)
  }, [advanceSlide, isTabActive])

  return (
    <Carousel
      className="w-full text-center py-2 bg-brand"
      setApi={setApi}
      opts={{
        loop: true,
        startIndex: 0,
      }}
    >
      <CarouselContent>
        {adverts.map((advert, index) => (
          <CarouselItem
            key={index}
            className="mx-auto w-full text-xs font-medium md:text-sm text-white"
          >
            {advert}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
