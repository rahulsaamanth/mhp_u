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
import React from "react"

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
  // const autoPlayRef = React.useRef<ReturnType<typeof Autoplay> | null>(null)

  return (
    <section className="border-b overflow-x-hidden">
      <h1 className="text-center text-xl md:text-4xl font-bold py-2">
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
            stopOnMouseEnter: true,
            stopOnInteraction: true,
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
                    <div
                      className="relative outline  outline-zinc-200 p-2 rounded-xl hover:outline-none
                      transition-all duration-200 before:content-[''] before:absolute before:inset-0 before:outline-brand before:outline-dashed before:outline-2 before:opacity-0 before:rounded-xl before:-outline-offset-1 hover:before:opacity-100 before:transition-opacity before:duration-500"
                    >
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
        <CarouselPrevious
          className="absolute -left-6 sm:-left-16 md:-left-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
          variant="default"
        />

        <CarouselNext
          className="absolute -right-6 sm:-right-16 md:-right-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
          variant="default"
        />
      </Carousel>
    </section>
  )
}
