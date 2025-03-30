"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function Advert() {
  const adverts = [
    "🎉  Get 20% off on all Ayurvedic products!",
    "🚚  Free shipping on orders above ₹999",
    "⚡  Flash Sale: Buy 2 Get 1 Free on all supplements",
  ];
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const advanceSlide = useCallback(() => {
    if (!api || !isTabActive) return;
    api.scrollNext();
  }, [api, isTabActive]);

  useEffect(() => {
    if (!isTabActive) return;

    const timer = setInterval(advanceSlide, 4000);
    return () => clearInterval(timer);
  }, [advanceSlide, isTabActive]);

  if (!isVisible) return null;

  return (
    <div className="relative bg-[#1DA827] py-2.5">
      <Carousel
        className="w-full text-center"
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
              className="mx-auto w-full text-xs font-medium text-white md:text-sm"
            >
              {advert}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-white hover:underline"
        aria-label="Close advertisement"
      >
        ✕
      </button>
    </div>
  );
}
