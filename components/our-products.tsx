"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function OurProducts() {
  const OurProducts = [
    {
      id: 1,
      name: "homeopathy",
      image: "/assets/our-products/homeopathy.jpg",
    },
    {
      id: 2,
      name: "ointments",
      image: "/assets/our-products/ointments.jpg",
    },
    {
      id: 3,
      name: "personal-care",
      image: "/assets/our-products/personal-care.jpg",
    },
    {
      id: 4,
      name: "herbals",
      image: "/assets/our-products/herbals.jpg",
    },
    {
      id: 5,
      name: "eye-ear-drops",
      image: "/assets/our-products/eye-drops.jpg",
    },
  ]

  return (
    <section className="overflow-x-hidden w-full">
      <h1 className="text-center text-xl md:text-4xl font-bold py-2">
        Our Products
      </h1>
      <div className="p-8 w-full flex items-center justify-center gap-4 sm:gap-8 xl:gap-12 flex-wrap">
        {OurProducts.map((cat) => (
          <Card
            className="w-fit border-0 outline-0 shadow-none px-1 active:scale-95 transition-transform p-0"
            key={cat.id}
          >
            <CardContent className="flex items-center justify-center p-2">
              <Link
                href={`/products/${cat.name}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-md"
              >
                <div
                  // className="relative outline outline-zinc-200 p-2 rounded-xl hover:outline-none focus:outline-none active:outline-none
                  //     transition-all duration-200 before:content-[''] before:absolute before:inset-0 before:outline-brand-foreground before:outline-dashed before:outline-2 before:opacity-0 before:rounded-xl before:-outline-offset-1 hover:before:opacity-100 focus:before:opacity-100 active:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  className="outline-1 outline-primary-foreground border-transparent hover:border-brand-foreground focus:border-brand-foreground active:border-brand-foreground border-2 hover:border-dashed focus:border-dashed active:border-dashed -outline-offset-2 ring-1 ring-stone-200 hover:ring-0 focus:ring-0 active:ring-0 transition-all duration-300 ease-out shadow-md hover:shadow-none focus:shadow-none active:shadow-none rounded-xl p-2"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={200}
                    height={160}
                    quality={100}
                    className="size-48 object-cover rounded-xl"
                    loading="lazy"
                  />
                  <h3 className="text-center font-semibold py-2 uppercase text-sm">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
