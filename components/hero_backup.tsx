"use client"

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

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent className="gap-0 space-x-0">
          {/* First slide */}
          <CarouselItem>
            <section className="relative min-w-full w-full overflow-hidden bg-brand text-white">
              {/* Background image with improved gradient overlay */}
              <div className="absolute top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-3/5 z-0">
                {/* Fixed gradient definition */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/30 to-brand/5 z-10" />
                <Image
                  src="/assets/hero.jpg"
                  alt="Background image"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  priority
                />
              </div>

              {/* Content container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="flex flex-col justify-center py-20 min-h-[85vh]">
                  {/* Text content */}
                  <div className="max-w-xl space-y-8 z-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                      Natural Healing For Modern Living
                    </h1>

                    <p className="text-lg sm:text-xl text-white/90 max-w-lg animate-fade-in animation-delay-200">
                      Discover premium homeopathic remedies that harness the
                      power of nature to promote wellness and balance in your
                      daily life.
                    </p>

                    <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-400">
                      <Link href="/products" passHref>
                        <button className="px-8 py-3 bg-white text-brand rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 duration-300">
                          Shop Now
                        </button>
                      </Link>

                      <Link href="/consultation" passHref>
                        <button className="px-8 py-3 border-2 border-white rounded-lg font-medium hover:bg-white/10 transition-colors hover:scale-105 duration-300">
                          Free Consultation
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Second slide */}
          <CarouselItem>
            <section className="relative min-w-full w-full overflow-hidden bg-emerald-700 text-white">
              {/* Background image with improved gradient overlay */}
              <div className="absolute top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-3/5 z-0">
                {/* Fixed gradient definition */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-700/30 to-emerald-700/5 z-10" />
                <Image
                  src="/assets/hero2.jpg"
                  alt="Background image"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  priority
                />
              </div>

              {/* Content container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="flex flex-col justify-center py-20 min-h-[85vh]">
                  {/* Text content */}
                  <div className="max-w-xl space-y-8 z-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                      🚚 Free Delivery On All Orders
                    </h1>

                    <p className="text-lg sm:text-xl text-white/90 max-w-lg animate-fade-in animation-delay-200">
                      Enjoy free shipping on all orders above ₹1000. Our
                      products are carefully packaged to maintain the integrity
                      of your remedies.
                    </p>

                    <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-400">
                      <Link href="/shipping-policy" passHref>
                        <button className="px-8 py-3 bg-white text-emerald-700 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 duration-300">
                          Shipping Policy
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 items-center justify-center z-30 transition-colors" />
        <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30  items-center justify-center z-30 transition-colors" />
      </Carousel>
    </div>
  )
}
