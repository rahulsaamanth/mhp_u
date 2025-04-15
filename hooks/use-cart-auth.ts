import { useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCartStore, MergeCartResponse } from "@/store/cart"
import { toast } from "sonner"
import { cartEvents } from "@/lib/cart-events"

/**
 * Hook to manage cart synchronization with authentication state
 * - When user logs in: Keep local cart items separate and let user manually add them to server cart
 * - When user logs out: Clears only local cart, preserves server cart
 */
export function useCartAuth() {
  const { user, isLoading, isAuthenticated } = useCurrentUser()
  const { clearCartOnLogout, items } = useCartStore()
  const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(
    null
  )

  // This useEffect specifically handles the auth state changes
  useEffect(() => {
    // Skip if still loading or not initialized yet
    if (isLoading || previousAuthState === null) {
      setPreviousAuthState(isAuthenticated)
      return
    }

    // Handle user login
    if (isAuthenticated && !previousAuthState) {
      console.log(
        "User logged in, keeping local cart items separate for manual selection"
      )

      // Notify components that authentication state has changed
      cartEvents.notifyCartChanged()
    }

    // Handle user logout
    if (!isAuthenticated && previousAuthState) {
      console.log("User logged out, clearing local cart only...")
      clearCartOnLogout() // This only clears the local cart, server cart remains intact
      cartEvents.notifyCartChanged()
    }

    setPreviousAuthState(isAuthenticated)
  }, [
    isAuthenticated,
    previousAuthState,
    clearCartOnLogout,
    items.length,
    isLoading,
  ])

  return {
    isAuthenticated,
    isLoading,
  }
}
