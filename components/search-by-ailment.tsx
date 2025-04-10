"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"

export default function SearchByAilment() {
  const ailments = [
    "skin-care",
    "mind-care",
    "stomach-care",
    "women-care",
    "respiratory-care",
    "constipation",
    "diabetes",
    "kidney-liver-care",
    "cough-cold-care",
    "infections",
    "eye-ear-care",
    "weakness",
    "sexualwellness",
    "cardiac-care",
    "weight-care",
    "bone-muscle-care",
    "hair-care",
    "hygeine-care",
    "oral-care",
    "baby-care",
  ]

  return (
    <section className="border-b overflow-x-hidden">
      <h1 className="text-center text-base md:text-4xl font-bold py-2">
        Search By Ailment
      </h1>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          containScroll: "trimSnaps",
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnFocusIn: true,
            jump: false,
          }),
        ]}
        className="max-w-3/4 mx-auto"
      >
        <CarouselContent>
          {ailments.map((ailment, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
            >
              <Link href={`/ailments/${ailment}`}>
                <Card className="w-full border-0 outline-0 shadow-none px-1">
                  <CardContent className="flex items-center justify-center p-2">
                    <div className="outline-1 outline-zinc-200 hover:outline-2 hover:outline-brand hover:outline-dashed p-2 rounded-xl">
                      <Image
                        src={`/assets/ailments/${ailment}.webp`}
                        alt={ailment}
                        width={200}
                        height={160}
                        quality={100}
                        className="size-48 object-cover rounded-xl"
                        loading="lazy"
                      />
                      <h3 className="text-center font-semibold py-2">
                        {ailment}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 sm:-left-16 md:-left-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10" />

        <CarouselNext className="absolute right-0 sm:-right-16 md:-right-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10" />
      </Carousel>
    </section>
  )
}
