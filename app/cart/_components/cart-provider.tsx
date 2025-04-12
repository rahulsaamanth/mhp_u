"use client"

import { useCartStore } from "@/store/cart"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getUserCart, mergeLocalCart } from "../_lib/actions"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, isLocalCart, setIsLocalCart, mergeWithServerCart, clearCart } =
    useCartStore()

  const { user } = useCurrentUser()
  const [previousLoginState, setPreviousLoginState] = useState<boolean>(false)
  const [previousUserId, setPreviousUserId] = useState<string | null>(null)
  const [isMergingCarts, setIsMergingCarts] = useState(false)

  // Debug the cart state
  useEffect(() => {
    console.log("Cart state changed:", {
      user: user?.id,
      isLocalCart,
      itemsCount: items.length,
      isMergingCarts,
    })
  }, [user?.id, isLocalCart, items.length, isMergingCarts])

  // Handle cart synchronization when user logs in or changes
  useEffect(() => {
    // Check if user just logged in (wasn't logged in before but is now)
    const justLoggedIn = user && !previousLoginState

    // Check if user has switched accounts
    const userSwitched = user && previousUserId && user.id !== previousUserId

    // Update previous state
    setPreviousLoginState(!!user)
    setPreviousUserId(user?.id || null)

    console.log("Auth state check:", {
      justLoggedIn,
      userSwitched,
      previousLoginState,
      previousUserId,
      currentUserId: user?.id,
    })

    // If user just logged in or switched accounts, and there are items in cart
    async function syncCartsOnLogin() {
      if ((justLoggedIn || userSwitched) && !isMergingCarts) {
        console.log("Attempting to sync carts:", {
          justLoggedIn,
          userSwitched,
          itemsCount: items.length,
          isLocalCart,
        })

        // If switching users, we need to clear the previous user's cart first
        if (userSwitched && !isLocalCart) {
          // Reset to local cart mode first to prevent merging old user's server items
          setIsLocalCart(true)

          // Clear cart to remove previous user's items
          clearCart()

          console.log("🔄 Cleared previous user's cart due to account switch")
        }

        // Only attempt to merge if we have local items after potential clearing
        if (items.length > 0 && isLocalCart) {
          setIsMergingCarts(true)
          toast.loading(
            userSwitched
              ? "Updating cart for new account..."
              : "Syncing your cart..."
          )

          try {
            console.log("Starting merge process with items:", items)

            // 1. Sync local items to the server
            const mergeResult = await mergeLocalCart(items)
            console.log("Merge result:", mergeResult)

            if (mergeResult.success) {
              // 2. Fetch the updated server cart
              const { items: serverItems } = await getUserCart()
              console.log("Got server items:", serverItems)

              // 3. Update local state with server cart
              mergeWithServerCart(serverItems)

              // 4. Switch to server cart mode
              setIsLocalCart(false)
              toast.success("Your cart has been synced with your account")
            } else {
              toast.error(
                "Failed to sync cart: " +
                  (!mergeResult.success || "Unknown error")
              )
            }
          } catch (error) {
            console.error("Failed to merge carts on login:", error)
            toast.error("Failed to sync your cart. Please try again later.")
          } finally {
            setIsMergingCarts(false)
          }
        } else {
          console.log("No local items to merge or not in local cart mode", {
            itemsCount: items.length,
            isLocalCart,
          })
        }
      }
    }

    syncCartsOnLogin()
  }, [user?.id, isLocalCart, items])

  // Fetch user's cart from server when they log in
  useEffect(() => {
    async function fetchUserCart() {
      // Only fetch if user is logged in and we're not currently merging carts
      if (user && !isMergingCarts) {
        console.log("Fetching user cart from server")
        try {
          const { items: serverItems } = await getUserCart()
          console.log("Server items:", serverItems)

          // If server has items and we're not in the middle of merging,
          // replace local state with server cart
          if (serverItems && serverItems.length > 0 && !isMergingCarts) {
            console.log("Replacing local cart with server cart")
            mergeWithServerCart(serverItems)
          } else if (!items.length) {
            // If server cart is empty and local cart is also empty,
            // just switch to server cart mode
            console.log("Switching to server cart mode (empty cart)")
            setIsLocalCart(false)
          } else {
            console.log("Keeping local cart items")
          }
        } catch (error) {
          console.error("Failed to fetch user cart:", error)
        }
      } else if (!user) {
        // Reset to local cart mode when user logs out
        console.log("User logged out, switching to local cart mode")
        setIsLocalCart(true)
      }
    }

    fetchUserCart()
  }, [user?.id])

  return children
}
