/**
 * Client-side utility to merge cart items after authentication
 * This is used in the login page to merge cart items after successful login
 */

import { CartItem } from "@/store/cart"
import { toast } from "sonner"

export async function mergeCartAfterLogin(): Promise<boolean> {
  try {
    // Skip if running on server with no window object
    if (typeof window === "undefined") {
      return false
    }

    // First, clear any merging flags that might be lingering
    sessionStorage.removeItem("needs_cart_merge")

    // Get local cart items from localStorage
    const cartStorageKey = "cart-storage"
    const cartStorageData = localStorage.getItem(cartStorageKey)

    if (!cartStorageData) {
      return false
    }

    // Parse the cart data
    const cartData = JSON.parse(cartStorageData)
    const localItems: CartItem[] = cartData?.state?.items || []

    // If no items in local cart, no need to proceed
    if (!localItems.length) {
      return false
    }

    console.log(
      `Merging ${localItems.length} items from local cart to server after login...`
    )

    // IMPORTANT: Clear local cart BEFORE making the API call to prevent double-counting
    // This ensures that when the cart count updates during the API call, it won't include local items
    localStorage.setItem(
      cartStorageKey,
      JSON.stringify({
        state: { items: [] },
        version: 0,
      })
    )

    // Call the API to merge cart items
    const response = await fetch("/api/cart/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: localItems }),
      credentials: "include",
    })

    if (!response.ok) {
      // If the API call fails, restore the local cart
      localStorage.setItem(cartStorageKey, JSON.stringify(cartData))
      throw new Error(`Failed to merge cart: ${response.statusText}`)
    }

    const result = await response.json()

    // Handle successful merge
    if (result.success) {
      if (
        result.stats &&
        (result.stats.created > 0 || result.stats.updated > 0)
      ) {
        console.log(
          `Cart items synced: ${result.stats.created} added, ${result.stats.updated} updated`
        )
      }

      console.log("Successfully merged cart after login and cleared local cart")
      return true
    }

    return false
  } catch (error) {
    console.error("Error merging cart after login:", error)
    toast.error("Failed to sync your cart. Your items are still saved locally.")
    return false
  }
}
