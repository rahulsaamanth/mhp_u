"use client"

import Autoplay from "embla-carousel-autoplay"
import ProductCard, { ProductCardProps } from "./product-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"

interface FeaturedProductsCarouselProps {
  products: ProductCardProps[]
}

export default function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnFocusIn: true,
          jump: false,
        }),
      ]}
      className="w-3/4 sm:w-2/3 mx-auto"
    >
      <CarouselContent>
        {products.map((product, idx) => (
          <CarouselItem
            key={idx}
            className="basis-full sm:basis-1/2 xl:basis-1/3 2xl:basis-1/4 py-2"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        variant="default"
        className="absolute -left-12 sm:-left-16 md:-left-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
      />
      <CarouselNext
        variant="default"
        className="absolute -right-12 sm:-right-16 md:-right-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
      />
    </Carousel>
  )
}
