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
    {
      id: "skin-care",
      imagePath: "/assets/ailments/skin-care.webp",
      displayName: "Skin Care",
    },
    {
      id: "mind-care",
      imagePath: "/assets/ailments/mind-care.webp",
      displayName: "Mind Care",
    },
    {
      id: "stomach-care",
      imagePath: "/assets/ailments/stomach-care.webp",
      displayName: "Stomach Care",
    },
    {
      id: "women-care",
      imagePath: "/assets/ailments/women-care.webp",
      displayName: "Women Care",
    },
    {
      id: "respiratory-care",
      imagePath: "/assets/ailments/respiratory-care.webp",
      displayName: "Respiratory Care",
    },
    {
      id: "constipation",
      imagePath: "/assets/ailments/constipation.webp",
      displayName: "Constipation",
    },
    {
      id: "diabetes",
      imagePath: "/assets/ailments/diabetes.webp",
      displayName: "Diabetes",
    },
    {
      id: "kidney-liver-care",
      imagePath: "/assets/ailments/kidney-liver-care.webp",
      displayName: "Kidney Liver Care",
    },
    {
      id: "cough-cold-care",
      imagePath: "/assets/ailments/cough-cold-care.webp",
      displayName: "Cough Cold Care",
    },
    {
      id: "infections",
      imagePath: "/assets/ailments/infections.webp",
      displayName: "Infections",
    },
    {
      id: "eye-ear-care",
      imagePath: "/assets/ailments/eye-ear-care.webp",
      displayName: "Eye Ear Care",
    },
    {
      id: "weakness",
      imagePath: "/assets/ailments/weakness.webp",
      displayName: "Weakness",
    },
    {
      id: "sexualwellness",
      imagePath: "/assets/ailments/sexualwellness.webp",
      displayName: "Sexual Wellness",
    },
    {
      id: "cardiac-care",
      imagePath: "/assets/ailments/cardiac-care.webp",
      displayName: "Cardiac Care",
    },
    {
      id: "weight-care",
      imagePath: "/assets/ailments/weight-care.webp",
      displayName: "Weight Care",
    },
    {
      id: "bone-muscle-care",
      imagePath: "/assets/ailments/bone-muscle-care.webp",
      displayName: "Bone Muscle Care",
    },
    {
      id: "hair-care",
      imagePath: "/assets/ailments/hair-care.webp",
      displayName: "Hair Care",
    },
    {
      id: "hygeine-care",
      imagePath: "/assets/ailments/hygeine-care.webp",
      displayName: "Hygeine Care",
    },
    {
      id: "oral-care",
      imagePath: "/assets/ailments/oral-care.webp",
      displayName: "Oral Care",
    },
    {
      id: "baby-care",
      imagePath: "/assets/ailments/baby-care.webp",
      displayName: "Baby Care",
    },
  ]
  // const autoPlayRef = React.useRef<ReturnType<typeof Autoplay> | null>(null)

  return (
    <section className="overflow-x-hidden">
      <h1 className="text-center text-xl md:text-4xl font-semibold py-2">
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
              <Link href={`/products/all?ailment=${ailment.id}`}>
                <Card className="w-full border-0 outline-0 shadow-none px-1">
                  <CardContent className="flex items-center justify-center p-2">
                    <div
                      className="relative outline  outline-zinc-200 p-2 rounded-xl hover:outline-none
                      transition-all duration-200 before:content-[''] before:absolute before:inset-0 before:outline-brand before:outline-dashed before:outline-2 before:opacity-0 before:rounded-xl before:-outline-offset-1 hover:before:opacity-100 before:transition-opacity before:duration-500"
                    >
                      <Image
                        src={ailment.imagePath}
                        alt={ailment.displayName}
                        width={200}
                        height={160}
                        quality={100}
                        className="size-48 object-cover rounded-xl"
                        loading="lazy"
                      />
                      <h3 className="text-center font-semibold py-2 uppercase text-sm">
                        {ailment.displayName}
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
