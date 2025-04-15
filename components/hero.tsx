"use client"

import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  const copyToClipboard = () => {
    navigator.clipboard.writeText("WELCOME20")
  }

  return (
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
        <div className="h-[60vh] flex items-center justify-start">
          {/* Text content */}
          <div className="max-w-xl space-y-2 sm:space-y-6 z-10">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Natural Healing For Modern Living
            </h1>

            <p
              className="text-base sm:text-xl text-white/90 max-w-lg animate-fade-in animation-delay-200 italic"
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
            >
              Discover premium homeopathic remedies that harness the power of
              nature for your wellbeing. <br />
            </p>

            <div className="bg-white/30 backdrop-blur-lg px-4 py-3 rounded-lg inline-block animate-fade-in animation-delay-300 text-xs sm:text-base border border-white/40 shadow-md">
              <span
                className="font-bold sm:font-semibold text-white"
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
              >
                🚚 Free delivery on all orders above ₹1000
              </span>
            </div>

            <div className="bg-white/30 backdrop-blur-lg px-4 py-3 rounded-lg inline-block animate-fade-in animation-delay-300 text-xs sm:text-base border border-white/40 shadow-md">
              <span
                className="font-bold sm:font-semibold text-white"
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
              >
                Use code:{" "}
              </span>
              <span
                onClick={copyToClipboard}
                className="bg-white text-brand p-1 sm:p-2 rounded font-bold cursor-copy hover:bg-gray-100 active:bg-gray-200 shadow-sm"
                aria-label="Copy coupon code WELCOME20"
              >
                WELCOME20
              </span>
              <span
                className="ml-2 text-white font-bold sm:font-semibold"
                style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
              >
                for 20% off on orders above ₹300
              </span>
            </div>

            <div className="inline-block relative z-30 animate-fade-in animation-delay-400 sm:mt-4">
              <Link
                href="/products/all"
                className="inline-flex items-center justify-center cursor-pointer px-8 py-3 bg-white text-brand  font-medium hover:shadow-lg transition-all duration-300 hover:rounded-none"
              >
                Shop Now & Save
              </Link>
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
