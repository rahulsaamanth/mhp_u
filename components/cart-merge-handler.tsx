"use client"

import { useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { mergeCartAfterLogin } from "@/lib/client-cart-merger"
import { cartEvents } from "@/lib/cart-events"

/**
 * This component handles cart merging after successful login
 * It runs on every page load and checks if cart merging is needed
 */
export function CartMergeHandler() {
  const { user, isLoading, isAuthenticated } = useCurrentUser()
  const [hasMerged, setHasMerged] = useState(false)

  useEffect(() => {
    // Skip if still loading or no user
    if (isLoading || !isAuthenticated || !user || hasMerged) {
      return
    }

    // Check if cart merging is needed
    const needsMerge = sessionStorage.getItem('needs_cart_merge') === 'true'
    
    if (needsMerge) {
      console.log('Cart merge needed after login, executing...')
      
      // Execute cart merging
      mergeCartAfterLogin()
        .then(success => {
          if (success) {
            console.log('Cart merged successfully after login')
            // Clear the flag
            sessionStorage.removeItem('needs_cart_merge')
            // Notify components that cart has changed
            cartEvents.notifyCartChanged()
            // Set merged flag to prevent multiple merges
            setHasMerged(true)
          }
        })
        .catch(error => {
          console.error('Error merging cart after login:', error)
        })
    }
  }, [user, isLoading, isAuthenticated, hasMerged])

  // This component doesn't render anything
  return null
}
