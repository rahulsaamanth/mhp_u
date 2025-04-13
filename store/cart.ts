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

interface CartState {
  items: CartItem[]
  addToCart: (item: AddToCartInput) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void // Add function to update quantity
  getItemCount: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item: AddToCartInput) => {
        set((state) => {
          // Check if item already exists
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId && i.variantId === item.variantId
          )

          // If item exists, update quantity
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += item.quantity
            return { items: updatedItems }
          }

          // Otherwise add new item
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${item.variantId}`,
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
        // Return total number of items (sum of quantities)
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        // Calculate total price (price * quantity for each item)
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
