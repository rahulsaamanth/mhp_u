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

  const itemCount = useCartStore((state) => state.items.length)

  useCartAuth()

  useEffect(() => {
    if (!isLoading) {
      setIsLocalCart(!user)
    }
  }, [user, isLoading])

  const contextValue = React.useMemo(() => ({ isLocalCart }), [isLocalCart])

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
