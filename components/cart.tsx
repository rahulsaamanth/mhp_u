"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useEffect, useState, useCallback, useRef } from "react"
import { getUserCart } from "@/app/cart/_lib/actions"
import { cartEvents } from "@/lib/cart-events"
import { useCartStore } from "@/store/cart"
import { useCartContext } from "@/app/cart/_components/cart-provider"

export default function Cart() {
  const { user } = useCurrentUser()
  const { isLocalCart } = useCartContext()

  // Use a more specific selector to avoid unnecessary re-renders
  const localItemCount = useCartStore((state) => state.items.length)

  const [serverItemCount, setServerItemCount] = useState(0)
  const [displayCount, setDisplayCount] = useState(0)
  const isFetchingRef = useRef(false)

  // Function to fetch cart count - memoized to prevent unnecessary re-renders
  const fetchCartItemsCount = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return

    isFetchingRef.current = true

    try {
      // For authenticated users, fetch server cart items
      if (user) {
        try {
          const { items } = await getUserCart()
          const count = items.length
          setServerItemCount(count)
          setDisplayCount(count) // For authenticated users, only show server cart items

          // Force clear the merging flag if it exists
          if (
            typeof window !== "undefined" &&
            sessionStorage.getItem("needs_cart_merge")
          ) {
            sessionStorage.removeItem("needs_cart_merge")
          }
        } catch (error) {
          console.error("Failed to fetch cart items count:", error)
          setServerItemCount(0)
          setDisplayCount(0)
        }
      } else {
        // Anonymous user - only use local cart count
        setServerItemCount(0)
        setDisplayCount(localItemCount)
      }
    } finally {
      isFetchingRef.current = false
    }
  }, [user, localItemCount])

  // Update the display count when local cart changes (for guest users)
  useEffect(() => {
    if (!user) {
      setDisplayCount(localItemCount)
    }
  }, [localItemCount, user])

  // Fetch cart items count when user is logged in or cart changes
  useEffect(() => {
    // Initial fetch
    fetchCartItemsCount()

    // Subscribe to cart events
    const unsubscribe = cartEvents.subscribe(() => {
      // Use a small delay before fetching to ensure any server operations complete
      setTimeout(fetchCartItemsCount, 50)
    })

    // Cleanup
    return () => {
      unsubscribe()
    }
  }, [user, fetchCartItemsCount])

  return (
    <Link href="/cart" className="cursor-pointer relative mr-2">
      <Button
        variant="link"
        className={`cursor-pointer text-brand transition-all duration-150 active:scale-95 hover:text-brand ${
          user ? "text-brand" : "text-brand-foreground"
        }`}
      >
        <ShoppingCart className="size-5 md:size-6" />
        {displayCount > 0 && (
          <Badge
            variant="default"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs bg-brand text-white"
          >
            {displayCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
