"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay, { AutoplayType } from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function SearchByAilment() {
  const ailments = [
    {
      id: "skin-care",
      imagePath: "/assets/ailments/skin-care.png",
      displayName: "Skin Care",
    },
    {
      id: "mind-care",
      imagePath: "/assets/ailments/mind-care.png",
      displayName: "Mental Wellness",
    },
    {
      id: "stomach-care",
      imagePath: "/assets/ailments/stomach-care.png",
      displayName: "Digestive Health",
    },
    {
      id: "women-care",
      imagePath: "/assets/ailments/women-care.png",
      displayName: "Women Care",
    },
    {
      id: "respiratory-care",
      imagePath: "/assets/ailments/respiratory-care.png",
      displayName: "Respiratory Health",
    },
    {
      id: "cardiac-care",
      imagePath: "/assets/ailments/cardiac.png",
      displayName: "Cardiac Health",
    },
    {
      id: "weight-care",
      imagePath: "/assets/ailments/weight-care.png",
      displayName: "Weight Management",
    },
    {
      id: "bone-muscle-care",
      imagePath: "/assets/ailments/bone-joint.png",
      displayName: "Bone & Joint Health",
    },
    {
      id: "constipation",
      imagePath: "/assets/ailments/constipation.png",
      displayName: "Constipation Relief",
    },
    {
      id: "diabetes",
      imagePath: "/assets/ailments/diabetes.png",
      displayName: "Diabetes Management",
    },
    {
      id: "kidney-liver-care",
      imagePath: "/assets/ailments/kidney-liver.png",
      displayName: "Kidney & Liver Health",
    },
    {
      id: "cough-cold-care",
      imagePath: "/assets/ailments/cough-cold.png",
      displayName: "Cough & Cold Relief",
    },
    {
      id: "infections",
      imagePath: "/assets/ailments/infections.png",
      displayName: "Infection Treatment",
    },
    {
      id: "hygeine-care",
      imagePath: "/assets/ailments/personal-hygeine.png",
      displayName: "Personal Hygiene",
    },
    {
      id: "eye-ear-care",
      imagePath: "/assets/ailments/ear-eye.png",
      displayName: "Eye & Ear Health",
    },
    {
      id: "weakness",
      imagePath: "/assets/ailments/vitality.png",
      displayName: "Energy & Vitality",
    },
    {
      id: "sexualwellness",
      imagePath: "/assets/ailments/sexual-wellness.png",
      displayName: "Sexual Wellness",
    },

    {
      id: "hair-care",
      imagePath: "/assets/ailments/hair-care.png",
      displayName: "Hair Health",
    },

    {
      id: "oral-care",
      imagePath: "/assets/ailments/oral-care.png",
      displayName: "Dental Health",
    },
    {
      id: "baby-care",
      imagePath: "/assets/ailments/baby-care.png",
      displayName: "Baby Care",
    },
  ]

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
    }, 10000)
  }

  return (
    <section className="overflow-x-hidden">
      <h1 className="text-center text-xl md:text-4xl font-semibold py-2">
        Search By Ailment
      </h1>
      <Carousel
        opts={{
          align: "start",
          // dragFree: true,
          containScroll: "trimSnaps",
          // slidesToScroll: 1,
        }}
        plugins={[autoPlayref.current]}
        className="max-w-3/5 mx-auto"
      >
        <CarouselContent className="mx-auto">
          {ailments.map((ailment, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/5 p-0"
            >
              <Card className="w-full h-full border-0 outline-0 shadow-none cursor-default">
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <Link
                    href={`/products/all?ailment=${ailment.id}`}
                    className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-md"
                  >
                    <div className="flex flex-col items-center justify-center h-full outline-1 outline-primary-foreground border-transparent hover:border-brand-foreground focus:border-brand-foreground active:border-brand-foreground border-2 hover:border-dashed focus:border-dashed active:border-dashed -outline-offset-2 ring-1 ring-stone-200 hover:ring-0 focus:ring-0 active:ring-0 transition-all duration-300 ease-out shadow-md hover:shadow-none focus:shadow-none active:shadow-none rounded-xl p-2">
                      <Image
                        src={ailment.imagePath}
                        alt={ailment.displayName}
                        width={200}
                        height={160}
                        quality={100}
                        className="size-36 object-cover"
                        loading="lazy"
                      />
                      <h3 className="text-center font-semibold py-2 uppercase text-xs xl:text-sm text-nowrap">
                        {ailment.displayName}
                      </h3>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="absolute -left-6 sm:-left-16 md:-left-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
          variant="default"
          onMouseDown={handleNavigation}
        />

        <CarouselNext
          className="absolute -right-6 sm:-right-16 md:-right-24 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-brand"
          variant="default"
          onMouseDown={handleNavigation}
        />
      </Carousel>
    </section>
  )
}
