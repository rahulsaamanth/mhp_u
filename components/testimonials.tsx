"use client"

import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ReviewCard } from "./review-card"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"

// Sample Google reviews - replace with your actual reviews
const googleReviews = [
  {
    id: 1,
    name: "Sudhir SB",
    rating: 5,
    comment:
      "The customer service provided by this local Homeopathic shop in mangalore is absolutely outstanding! My experience can't be expressed in words as to how glad I ordered from this shop. Just to give you an example, I required one homeopathic medicine urgently and I called them and they arranged immediately and shipped it out by end of the day! That's pure service excellence in customer service ! Thanks again ! I have bought homeopathic twice and was totally satisfied with the service! You deserve the 5 star rating ! 👍👏 One thing I can promise is you will never get this level of personalised service online with Amazon or other e-commerce platforms !",
  },
  {
    id: 2,
    name: "Vivekanand Halady",
    rating: 5,
    comment:
      "Excellent service. Medicines ordered from Kundapura, requested if they could be delivered to Mangalore hotel after 5.00pm. They were indeed delivered at 5.00 pm even before getting price which, of course was paid in the same evening . Thanks for such valuable Excellent service. 🙏",
  },
  {
    id: 3,
    name: "Kanupriya Prashant",
    rating: 5,
    comment:
      "I reached out to Pawan ji for sending medicines outside India, and he was extremely helpful ,he went out of his way to help out. Kudos to people like him ,kind people like him do still exist.",
  },
  {
    id: 4,
    name: "vijetha Poojary",
    rating: 5,
    comment:
      "I never believed in HOMOEOPATHIC but i heard about this place from a friend who lives in Mumbai was shocked on why she would buy from this place then she explained about their experience and service, then I visited this place for a HOMOEOPATHIC hair colour then I got to know why they are famous ,Thank you for the outstanding service.",
  },
  {
    id: 5,
    name: "Swati Shetty",
    rating: 5,
    comment:
      "I got to know about this place through dr prassana kumar,this place has medicines from all over the globe , must visit if you want the best quality medicines. I have seen good results from the medicine .Thank you for kindness",
  },
  {
    id: 6,
    name: "pratiksha dsilva",
    rating: 5,
    comment:
      "Excellent customer service. We requested for some meds on sunday and though they were closed, as a request there was a person who obliged, not only gave us the medicine but came all the way from 30 mins away from Mangalore and helped us since we were traveling the next day . Great team !",
  },
]

export default function Testimonials() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))
  const [activeSlide, setActiveSlide] = useState(0)
  const [api, setApi] = useState<any>(null)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveSlide(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section className="py-20">
      <div className="flex items-center justify-center mb-8 pb-6">
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary"></div>
        <h2 className="text-xl md:text-4xl text-center px-4">
          What our customers
          <br />
          <span className="text-3xl lg:text-6xl font-bold">Are Saying</span>
        </h2>
        <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary"></div>
      </div>
      <div className="container mx-auto max-w-2/3 sm:px-4">
        <Carousel
          className="w-full"
          plugins={[plugin.current]}
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="mx-auto">
            {googleReviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="pl-6 xl:basis-1/2 2xl:basis-1/3 px-2"
              >
                <ReviewCard
                  rating={review.rating}
                  title={review.name}
                  content={review.comment}
                  author={review.name}
                  timeAgo="Verified Customer"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center mt-8 space-x-1.5">
          {googleReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "bg-brand w-8"
                  : "bg-gray-300 hover:bg-brand/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center flex-col items-center">
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg py-5 px-8 inline-flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-brand" />
              </div>
              <div className="ml-3 pr-6 border-r border-gray-100">
                <p className="text-xs text-gray-500">Considering</p>
                <p className="text-xl font-medium text-gray-800">
                  100+ Reviews
                </p>
              </div>
            </div>
            <div className="pl-6">
              <p className="text-xs text-gray-500">Average Rating</p>
              <div className="flex items-center">
                <p className="text-xl font-medium text-gray-800 mr-2">4.7</p>
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-brand fill-brand"
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="https://www.google.com/search?client=ubuntu-sn&hs=oFI&sca_esv=a5672ed9c1a134ac&channel=fs&biw=2560&bih=1323&sxsrf=AHTn8zrSTvqGBg-bKOktfFPZpsph8tEHhA:1744692381035&si=APYL9bs7Hg2KMLB-4tSoTdxuOx8BdRvHbByC_AuVpNyh0x2KzfHrzCcqOLg81-gHyBJWbvHGu6UrVUXpkgAVlIBmMatTgZSCvGIar7mCyZwLWZsy3dFa0gCOKx2bVvfwoXzEV05gnGpDU0l0UewdRQ5VX0oflcz6hg%3D%3D&q=MANGALORE+HOMOEOPATHIC+PHARMACY+Reviews&sa=X&ved=2ahUKEwj7qfTMndmMAxXMS2cHHRrgClkQ0bkNegQIHxAD"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 text-brand hover:text-brand/80 font-medium flex items-center transition-colors"
          >
            View all reviews on Google
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 ml-1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
