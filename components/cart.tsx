"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useEffect, useState, useCallback } from "react"
import { getUserCart } from "@/app/cart/_lib/actions"
import { cartEvents } from "@/lib/cart-events"

export default function Cart() {
  const { user } = useCurrentUser()
  const [itemCount, setItemCount] = useState(0)

  // Function to fetch cart count
  const fetchCartItemsCount = useCallback(async () => {
    if (!user) {
      setItemCount(0)
      return
    }

    try {
      const { items } = await getUserCart()
      const count = items.reduce((total, item) => total + item.quantity, 0)
      setItemCount(count)
    } catch (error) {
      console.error("Failed to fetch cart items count:", error)
      setItemCount(0)
    }
  }, [user])

  // Fetch cart items count when user is logged in or cart changes
  useEffect(() => {
    // Initial fetch
    fetchCartItemsCount()

    // Subscribe to cart events
    const unsubscribe = cartEvents.subscribe(fetchCartItemsCount)

    // Set up a polling interval as a backup
    // const interval = setInterval(fetchCartItemsCount, 30000) // Update every 30 seconds

    // Cleanup
    return () => {
      // clearInterval(interval)
      unsubscribe()
    }
  }, [user, fetchCartItemsCount])

  return (
    <Link href="/cart" className="cursor-pointer relative">
      <Button
        variant="link"
        className={`cursor-pointer ${user && "text-brand"}`}
      >
        <ShoppingCart className={`size-5 md:size-6`} />
        {itemCount > 0 && (
          <Badge
            variant="default"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs bg-brand text-white"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
