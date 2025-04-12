import { generateId } from "@/lib/generate-id"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  quantity: number
  potency?: string
  packSize?: string
}

type CartStore = {
  items: CartItem[]
  isLocalCart: boolean
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  mergeWithServerCart: (serverItems: CartItem[]) => void
  setIsLocalCart: (isLocal: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLocalCart: true,

      addItem: (item) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (i) =>
            i.variantId === item.variantId &&
            i.potency === item.potency &&
            i.packSize === item.packSize
        )

        if (existingItemIndex > -1) {
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += item.quantity
          set({ items: updatedItems })
        } else {
          set({ items: [...items, { ...item, id: generateId() }] })
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get()
        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [] })
      },

      mergeWithServerCart: (serverItems) => {
        set({
          items: serverItems,
          isLocalCart: false,
        })
      },

      setIsLocalCart: (isLocal) => {
        set({ isLocalCart: isLocal })
      },
    }),
    {
      name: "cart",
    }
  )
)
