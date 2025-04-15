"use client"

import { useCartAuth } from "@/hooks/use-cart-auth"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCartStore } from "@/store/cart"
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react"

// Create context types
type CartContextType = {
  isLocalCart: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isLocalCart, setIsLocalCart] = useState(true)
  const { user, isLoading } = useCurrentUser()

  // Only get the item count instead of the full items array to prevent unnecessary re-renders
  const itemCount = useCartStore((state) => state.items.length)

  // Use our cart authentication hook to handle sync/clear operations
  useCartAuth()

  // Update local cart status when user authentication changes
  useEffect(() => {
    if (!isLoading) {
      setIsLocalCart(!user)
    }
  }, [user, isLoading])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({ isLocalCart }), [isLocalCart])

  // For debugging only - using itemCount instead of full items array
  useEffect(() => {
    if (!isLoading && process.env.NODE_ENV !== "production") {
      console.log(
        `Cart provider: ${
          user ? "User authenticated" : "Guest user"
        }, ${itemCount} items in local store`
      )
    }
  }, [user, itemCount, isLoading])

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}
