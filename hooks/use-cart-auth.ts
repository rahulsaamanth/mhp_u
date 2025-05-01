"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCartStore, MergeCartResponse } from "@/store/cart"
import { toast } from "sonner"
import { cartEvents } from "@/lib/cart-events"

/**
 * Hook to manage cart synchronization with authentication state
 * - When user logs in: Automatically merge local cart items with server cart
 * - When user logs out: Clears only local cart, preserves server cart
 */
export function useCartAuth() {
  const { user, isLoading, isAuthenticated } = useCurrentUser()
  const { clearCartOnLogout, items, mergeCartWithServer } = useCartStore()
  const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(
    null
  )
  const [isMerging, setIsMerging] = useState(false)
  const ignoreNextEventRef = useRef(false)
  const isBrowserRef = useRef(false)

  // Set browser ref once the component mounts (client-side only)
  useEffect(() => {
    isBrowserRef.current = true
  }, [])

  // Function to handle cart merging on login
  const handleCartMerge = useCallback(async () => {
    if (!items.length || isMerging) return

    try {
      setIsMerging(true)
      console.log("Executing cart merge with server...")

      const result = await mergeCartWithServer()

      if (result.success) {
        // Show success message if items were merged
        if (
          result.stats &&
          (result.stats.created > 0 || result.stats.updated > 0)
        ) {
          toast.success(
            `Cart items synced: ${result.stats.created} added, ${result.stats.updated} updated`
          )
        }
        // Prevent duplicate notifications
        ignoreNextEventRef.current = true

        // Notify components that cart has changed
        cartEvents.notifyCartChanged(300) // Higher debounce for login merges
      }
    } catch (error) {
      console.error("Failed to merge cart:", error)
      toast.error("Failed to sync your cart. Please try again later.")
    } finally {
      setIsMerging(false)
      // Reset ignore flag after a delay
      if (isBrowserRef.current) {
        setTimeout(() => {
          ignoreNextEventRef.current = false
        }, 500)
      }
    }
  }, [items.length, isMerging, mergeCartWithServer])

  // Detect visibility changes (tab focus/blur) - client-side only
  useEffect(() => {
    // Skip during server-side rendering
    if (!isBrowserRef.current) return

    const handleVisibilityChange = () => {
      // Only respond to visibility events if we're authenticated
      // and not already processing something
      if (isAuthenticated && !isLoading && !isMerging && !document.hidden) {
        // Skip for 3 seconds after login or merge to prevent immediate re-fetching
        if (ignoreNextEventRef.current) return
        console.log("Visibility changed, notifying cart system")
        // Use longer debounce period for visibility events
        cartEvents.notifyCartChanged(500)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isAuthenticated, isLoading, isMerging])

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
        "User logged in, automatically merging local cart with server cart"
      )

      // Use setTimeout to ensure this runs after auth state is fully updated
      if (isBrowserRef.current) {
        setTimeout(() => {
          handleCartMerge()
        }, 500)
      }

      // Skip redundant notification since handleCartMerge will fire one anyway
    }

    // Handle user logout
    if (!isAuthenticated && previousAuthState) {
      console.log("User logged out, clearing local cart...")
      clearCartOnLogout() // Clear the local cart, server cart remains intact
      cartEvents.notifyCartChanged()
    }

    setPreviousAuthState(isAuthenticated)
  }, [
    isAuthenticated,
    previousAuthState,
    clearCartOnLogout,
    isLoading,
    handleCartMerge,
  ])

  return {
    isAuthenticated,
    isLoading,
  }
}
