"use client"

import Script from "next/script"
import { createContext, useContext, useEffect } from "react"
import { useRazorpayStore } from "./razorpay-store"

interface RazorpayContextType {
  isRazorpayLoaded: boolean
}

const RazorpayContext = createContext<RazorpayContextType>({
  isRazorpayLoaded: false,
})

export const useRazorpay = () => useContext(RazorpayContext)

export function RazorpayProvider({ children }: { children: React.ReactNode }) {
  const { isRazorpayLoaded, setIsRazorpayLoaded } = useRazorpayStore()

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setIsRazorpayLoaded(true)
    }
  }, [setIsRazorpayLoaded])

  return (
    <RazorpayContext.Provider value={{ isRazorpayLoaded }}>
      {!isRazorpayLoaded && (
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          onLoad={() => {
            console.log("Razorpay script loaded")
            setIsRazorpayLoaded(true)
          }}
          onError={(e) => {
            console.error("Razorpay script failed to load:", e)
            setIsRazorpayLoaded(false)
          }}
        />
      )}
      {children}
    </RazorpayContext.Provider>
  )
}
