"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useEffect, useState, useCallback } from "react"
import { getUserCart } from "@/app/cart/_lib/actions"
import { cartEvents } from "@/lib/cart-events"
import { useCartStore } from "@/store/cart"
import { useCartContext } from "@/app/cart/_components/cart-provider"

export default function Cart() {
  const { user } = useCurrentUser()
  const { isLocalCart } = useCartContext()
  const localCart = useCartStore()
  const [serverItemCount, setServerItemCount] = useState(0)
  const [totalItemCount, setTotalItemCount] = useState(0)

  // Function to fetch cart count
  const fetchCartItemsCount = useCallback(async () => {
    // Get local cart count
    const localCount = localCart.items.reduce(
      (total, item) => total + item.quantity,
      0
    )

    if (user) {
      // Logged-in user - get count from server and combine with local
      try {
        const { items } = await getUserCart()
        const serverCount = items.reduce(
          (total, item) => total + item.quantity,
          0
        )
        setServerItemCount(serverCount)

        // Set total count (server + local)
        setTotalItemCount(serverCount + localCount)
      } catch (error) {
        console.error("Failed to fetch cart items count:", error)
        setServerItemCount(0)
        setTotalItemCount(localCount) // Still show local items if server fetch fails
      }
    } else {
      // Anonymous user - only use local cart count
      setServerItemCount(0)
      setTotalItemCount(localCount)
    }
  }, [user, localCart.items])

  // Fetch cart items count when user is logged in or cart changes
  useEffect(() => {
    // Initial fetch
    fetchCartItemsCount()

    // Subscribe to cart events
    const unsubscribe = cartEvents.subscribe(fetchCartItemsCount)

    // Cleanup
    return () => {
      unsubscribe()
    }
  }, [user, fetchCartItemsCount])

  return (
    <Link href="/cart" className="cursor-pointer relative">
      <Button variant="link" className="cursor-pointer text-brand">
        <ShoppingCart className="size-5 md:size-6" />
        {totalItemCount > 0 && (
          <Badge
            variant="default"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs bg-brand text-white"
          >
            {totalItemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
