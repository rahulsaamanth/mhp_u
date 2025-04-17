"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText("WELCOME20")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative min-w-full w-full overflow-hidden bg-brand text-white">
      <div className="absolute top-0 right-0 bottom-0 w-full md:w-1/2 lg:w-3/5 z-0">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="h-[60vh] flex items-center justify-start">
          <div className="max-w-xl space-y-8 xl:space-y-20 z-10">
            {/* Title and intro group */}
            <div className="space-y-3 sm:space-y-4">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white"
                style={{
                  textShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                Natural Healing For Modern Living
              </h1>

              <p className="text-base sm:text-xl text-white/90 max-w-lg italic inline opacity-0 sm:opacity-100">
                Discover premium homeopathic remedies that harness the power of
                nature for your wellbeing.
              </p>
            </div>

            {/* Offers group */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white/30 backdrop-blur-lg p-3 rounded-lg md:inline-block text-xs sm:text-base border border-white/40 shadow-md hidden">
                <span
                  className="font-bold sm:font-semibold text-white"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
                >
                  🚚 Free delivery on all orders above ₹1000
                </span>
              </div>

              <div className="bg-white/30 backdrop-blur-lg p-3 rounded-lg inline-block text-sm sm:text-base border border-white/40 shadow-md transition-all duration-300 hover:bg-white/40 leading-relaxed">
                <span
                  className="font-bold sm:font-semibold text-white"
                  style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.4)" }}
                >
                  Use code:{" "}
                </span>
                <span
                  onClick={copyToClipboard}
                  className="relative bg-white text-brand p-1 sm:px-3.5 sm:py-2 rounded font-bold cursor-copy hover:bg-gray-100 active:bg-gray-200 shadow-sm transition-all duration-300 group"
                  aria-label="Copy coupon code WELCOME20"
                >
                  WELCOME20
                  {copied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap animate-fade-in">
                      Copied!
                    </span>
                  )}
                  <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/40 rounded pointer-events-none"></span>
                </span>
                <span
                  className="ml-2 text-white font-bold sm:font-semibold"
                  style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.4)" }}
                >
                  for 20% off on orders above ₹300
                </span>
              </div>
              <div className="pt-2 animate-fade-in animation-delay-400">
                <Link
                  href="/products/all"
                  className="inline-flex items-center justify-center cursor-pointer px-8 py-3.5 bg-white text-brand font-medium hover:bg-white/95 hover:shadow-lg transition-all duration-300 tracking-wide"
                >
                  Shop Now & Save
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave shape */}
      {/* <div className="absolute bottom-0 w-full z-20 overflow-hidden pointer-events-none">
        <div className="bg-white h-1 w-full absolute bottom-0 left-0 right-0 z-10"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 160"
          className="w-[103%] h-auto translate-x-[-1.5%]"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,48L48,56C96,64,192,80,288,90.7C384,101,480,107,576,101.3C672,96,768,80,864,82.7C960,85,1056,107,1152,104C1248,101,1344,75,1392,61.3L1440,48L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
          ></path>
        </svg>
      </div> */}
    </section>
  )
}
