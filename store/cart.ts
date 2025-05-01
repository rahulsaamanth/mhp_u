import { create } from "zustand"
import { persist } from "zustand/middleware"

// Interface for items in the cart
export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string // Changed from productName for compatibility
  image: string // Changed from image array to single string
  price: number
  quantity: number
  potency?: string // Made optional
  packSize?: string // Made optional
  totalStock?: number

  // These fields might be present in the full cart item but not required for addToCart
  mrp?: number
  discount?: number
  discountType?: string
  unit?: string
  variantName?: string
  productName?: string // Added for backward compatibility
}

// Simpler interface specifically for adding items to cart
export interface AddToCartInput {
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  quantity: number
  potency?: string
  packSize?: string
}

// Define response type for merge cart
export interface MergeCartResponse {
  success: boolean
  message: string
  stats?: {
    created: number
    updated: number
    total: number
  }
  error?: string
}

interface CartState {
  items: CartItem[]
  addToCart: (item: AddToCartInput) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void // Add function to update quantity
  getItemCount: () => number
  getTotalPrice: () => number
  syncCartToServer: () => Promise<void> // New function to sync local cart to server after login
  mergeCartWithServer: () => Promise<MergeCartResponse> // Add local cart items to server cart
  clearCartOnLogout: () => void // New function to clear cart on logout
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item: AddToCartInput) => {
        set((state) => {
          // Check if item already exists with same variantId, potency and packSize
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.variantId === item.variantId &&
              i.potency === item.potency &&
              i.packSize === item.packSize
          )

          // If item exists, update quantity
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += item.quantity
            return { items: updatedItems }
          }

          // Otherwise add new item
          // Generate ID based on all unique fields in the schema
          const potencyPart = item.potency || "default"
          const packSizePart = item.packSize || "default"
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${item.variantId}-${potencyPart}-${packSizePart}`,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeFromCart: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: quantity } : item
          ),
        }))
      },

      getItemCount: () => {
        // Return number of unique items (not sum of quantities)
        return get().items.length
      },

      getTotalPrice: () => {
        // Calculate total price (price * quantity for each item)
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      // New function to sync local cart to server after login
      syncCartToServer: async () => {
        try {
          const localCart = get().items

          // Make a server request to replace the user's cart with the local cart
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: localCart }),
          })

          if (!response.ok) {
            throw new Error("Failed to sync cart with server")
          }

          return await response.json()
        } catch (error) {
          console.error("Error syncing cart to server:", error)
          throw error
        }
      },

      // Function to merge local cart with server cart
      mergeCartWithServer: async () => {
        try {
          const localCart = get().items

          // If there are no items in local cart, no need to call the API
          if (localCart.length === 0) {
            console.log('No local cart items to merge')
            return {
              success: true,
              message: "No items to merge",
              stats: { created: 0, updated: 0, total: 0 },
            }
          }

          console.log(
            `Sending ${localCart.length} items to server for merge...`
          )

          // Make a server request to merge the local cart with the server cart
          const response = await fetch("/api/cart/merge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: localCart }),
            // Add credentials to ensure cookies are sent
            credentials: "include",
          })

          // Parse the response
          const result: MergeCartResponse = await response.json()

          if (!response.ok) {
            throw new Error(result.error || "Failed to merge cart with server")
          }

          // Only clear the local cart if the merge was successful
          if (result.success) {
            console.log("Cart merge successful, clearing local cart")
            // Clear local cart after successful merge
            set({ items: [] })
            
            // Force localStorage update
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem('cart-storage', JSON.stringify({ state: { items: [] }, version: 0 }))
              }
            } catch (e) {
              console.error('Failed to clear localStorage cart after merge:', e)
            }
          }

          return result
        } catch (error) {
          console.error("Error merging cart with server:", error)
          // Re-throw the error so it can be handled by the caller
          throw error instanceof Error
            ? error
            : new Error("Unknown error merging cart")
        }
      },

      // Function to clear cart when user logs out
      clearCartOnLogout: () => {
        console.log('Clearing local cart on logout')
        // Clear cart items and ensure it's persisted
        set({ items: [] })
        // Force localStorage update
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart-storage', JSON.stringify({ state: { items: [] }, version: 0 }))
          }
        } catch (e) {
          console.error('Failed to clear localStorage cart:', e)
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
