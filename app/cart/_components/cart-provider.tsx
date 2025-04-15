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
  const { items } = useCartStore()

  // Use our cart authentication hook to handle sync/clear operations
  useCartAuth()

  // Update local cart status when user authentication changes
  useEffect(() => {
    if (!isLoading) {
      setIsLocalCart(!user)
    }
  }, [user, isLoading])

  // Log cart state for debugging
  useEffect(() => {
    if (!isLoading) {
      console.log(
        `Cart provider: ${user ? "User authenticated" : "Guest user"}, ${
          items.length
        } items in local store`
      )
    }
  }, [user, items.length, isLoading])

  return (
    <CartContext.Provider value={{ isLocalCart }}>
      {children}
    </CartContext.Provider>
  )
}
