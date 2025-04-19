"use client"

import Autoplay, { AutoplayType } from "embla-carousel-autoplay"
import ProductCard, { ProductCardProps } from "./product-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import React from "react"

interface FeaturedProductsCarouselProps {
  products: ProductCardProps[]
}

export default function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  const autoPlayref = React.useRef<AutoplayType>(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      jump: false,
    })
  )

  const handleNavigation = () => {
    autoPlayref.current.stop()

    setTimeout(() => {
      autoPlayref.current.play()
    }, 6000)
  }

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: 1,

        // containScroll: "trimSnaps",
      }}
      plugins={[autoPlayref.current]}
      className="w-3/4 2xl:w-2/3 mx-auto"
    >
      <CarouselContent className="mx-auto">
        {products.map((product, idx) => (
          <CarouselItem
            key={idx}
            className="basis-full sm:basis-1/2 xl:basis-1/3 2xl:basis-1/4 py-2 pr-1"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        variant="default"
        className="absolute -left-12 sm:-left-16 md:-left-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
        onMouseDown={handleNavigation}
      />
      <CarouselNext
        variant="default"
        className="absolute -right-12 sm:-right-16 md:-right-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
        onMouseDown={handleNavigation}
      />
    </Carousel>
  )
}
