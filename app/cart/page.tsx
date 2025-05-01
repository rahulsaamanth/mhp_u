"use client"

import { Button } from "@/components/ui/button"
import {
  removeCartItem,
  updateCartItemQuantity,
  getUserCart,
} from "./_lib/actions"
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react"
import { Trash } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import Link from "next/link"
import { CartItem, useCartStore } from "@/store/cart"
import { cartEvents } from "@/lib/cart-events"
import { toast } from "sonner"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCartContext } from "./_components/cart-provider"
import { useTransition } from "react"
import { QuantitySelector } from "@/components/ui/quantity-selector"

// Add proper type for CartItemComponent props
interface CartItemComponentProps {
  item: CartItem
  isServerItem: boolean
  user: any // Replace with proper user type if available
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  isAtMaxStock: (item: CartItem) => boolean
}

const CartItemComponent = memo(
  ({
    item,
    isServerItem,
    user,
    onQuantityChange,
    onRemove,
    isAtMaxStock,
  }: CartItemComponentProps) => {
    // Use useTransition to avoid freezing the UI during state updates
    const [isPending, startTransition] = useTransition()

    // Handle quantity change with transition
    const handleQuantityChange = (newQuantity: number) => {
      startTransition(() => {
        onQuantityChange(item.id, newQuantity)
      })
    }

    return (
      <div className="flex border-b py-4">
        <div className="w-24 h-24 relative flex-shrink-0">
          <Image
            src={item.image || "/assets/hero1.webp"}
            alt={item.name}
            fill
            className="object-contain"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "/placeholder.png"
            }}
          />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-medium">{item.name}</h3>
          {item.potency && (
            <p className="text-sm text-gray-500">Potency: {item.potency}</p>
          )}
          {item.packSize && (
            <p className="text-sm text-gray-500">Pack Size: {item.packSize}</p>
          )}

          {/* Stock availability indicator */}
          {item.totalStock !== undefined && (
            <div className="flex items-center mt-1 mb-2">
              <div
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  item.totalStock > 10
                    ? "bg-brand"
                    : item.totalStock > 0
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              />
              <p className="text-xs">
                {item.totalStock > 10
                  ? "In stock"
                  : item.totalStock > 0
                  ? `Only ${item.totalStock} left`
                  : "Out of stock"}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2">
            <div className="flex items-center justify-between sm:justify-center gap-6">
              <QuantitySelector
                initialQuantity={item.quantity}
                min={1}
                max={item.totalStock ? Math.min(10, item.totalStock) : 10}
                onChange={handleQuantityChange}
              />
              <div className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1 self-end sm:self-auto cursor-pointer"
              disabled={isPending}
            >
              <Trash className="h-4 w-4" />
              <span className="text-xs">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

// Add display name to help with debugging
CartItemComponent.displayName = "CartItemComponent"

// Create a pure functional component for better rendering performance
const CartPage = () => {
  // Use memo to prevent unnecessary re-renders
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useCurrentUser()
  const { isLocalCart } = useCartContext()

  // Use a ref to track if we're currently updating to prevent duplicate updates
  const isUpdatingRef = useRef(false)
  // Add a ref to track visibility state - initialize undefined to avoid SSR issues
  const wasDocumentHiddenRef = useRef<boolean | undefined>(undefined)
  // Add a ref to track if we should ignore the next cart event
  const ignoreNextCartEventRef = useRef(false)
  // Add a ref to track if we're in browser environment
  const isBrowserRef = useRef(false)

  // Initialize browser detection once after component mounts
  useEffect(() => {
    isBrowserRef.current = true
    // Now safely set the initial document hidden state
    wasDocumentHiddenRef.current =
      typeof document !== "undefined" ? document.hidden : false
  }, [])

  // Fix the infinite loop warning by using separate selectors with stable references
  const localCartItems = useCartStore((state) => state.items)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  // Load cart items from the server or local storage
  const loadCartItems = useCallback(async () => {
    // Prevent multiple simultaneous updates
    if (isUpdatingRef.current) return
    isUpdatingRef.current = true

    setIsLoading(true)
    try {
      if (user) {
        // Logged in user - get cart from server
        const { items: serverItems } = await getUserCart()
        // Use functional updates to prevent stale state issues
        setCartItems(serverItems)
      } else {
        // Anonymous user - get cart from local storage
        // Use object equality check to prevent unnecessary updates
        setCartItems((prev) => {
          // Only update if the items have actually changed
          if (JSON.stringify(prev) !== JSON.stringify(localCartItems)) {
            return localCartItems
          }
          return prev
        })
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
      // If server fetch fails, use local cart for logged-in users
      if (user) {
        setCartItems([])
      } else {
        setCartItems(localCartItems)
      }
    } finally {
      setIsLoading(false)
      // Reset the updating flag after a short delay to prevent rapid consecutive updates
      if (isBrowserRef.current) {
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 100)
      } else {
        isUpdatingRef.current = false
      }
    }
  }, [user, localCartItems])

  // Initial load of cart items
  useEffect(() => {
    loadCartItems()
  }, [loadCartItems])

  // Handle visibility changes (tab focus/blur) - client-side only
  useEffect(() => {
    // Skip during server-side rendering
    if (!isBrowserRef.current) return

    const handleVisibilityChange = () => {
      const isHidden = document.hidden

      // Only reload cart when tab becomes visible again (not when hidden)
      // and only if the previous state was hidden (to avoid unnecessary loads on initial visibility)
      if (
        !isHidden &&
        wasDocumentHiddenRef.current === true &&
        !isUpdatingRef.current
      ) {
        console.log(
          "Tab visibility changed (focus), updating cart with debounce"
        )
        // Reload cart with debounce
        const timer = setTimeout(() => {
          if (!ignoreNextCartEventRef.current) {
            loadCartItems()
          }
        }, 1000) // Significant delay to avoid rapid reloads

        return () => clearTimeout(timer)
      }

      // Update the ref with current hidden state
      wasDocumentHiddenRef.current = isHidden
    }

    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [loadCartItems])

  // Subscribe to cart item changes - use a more efficient approach with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    // Handler for cart events with debouncing
    const handleCartChange = () => {
      // Skip if explicitly ignored for this event
      if (ignoreNextCartEventRef.current) {
        ignoreNextCartEventRef.current = false
        return
      }

      // Cancel any pending updates
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Skip if we're already updating
      if (isUpdatingRef.current) return

      // For guest users, we can optimize by directly using the local cart items
      // without making server requests
      if (!user) {
        // Only update if the items have actually changed to prevent unnecessary re-renders
        setCartItems((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(localCartItems)) {
            return [...localCartItems] // Create a new array to ensure React detects the change
          }
          return prev
        })
      } else {
        // For logged-in users, we need to fetch from server but with debounce
        timeoutId = setTimeout(() => {
          if (!isUpdatingRef.current) {
            loadCartItems()
          }
        }, 1000) // Longer delay to prevent rapid re-renders
      }
    }

    // Subscribe to cart events
    const unsubscribe = cartEvents.subscribe(handleCartChange)

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      unsubscribe()
    }
  }, [user, localCartItems, loadCartItems])

  // Handle quantity change for server cart items
  const handleQuantityChangeServerItem = useCallback(
    async (id: string, newQuantity: number) => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        // Update local state immediately for better UX
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        )

        // Set flag to ignore next cart event to avoid redundant updates
        ignoreNextCartEventRef.current = true

        // Then update the server (optimistic update pattern)
        await updateCartItemQuantity(id, newQuantity)

        // No need to notify cart changed here as the server update will trigger a refresh
        // This prevents double-rendering
      } catch (error) {
        console.error("Failed to update quantity:", error)
        toast.error("Failed to update quantity")

        // Revert the optimistic update on error
        loadCartItems()
      } finally {
        // Reset the updating flag after a short delay
        if (isBrowserRef.current) {
          setTimeout(() => {
            isUpdatingRef.current = false
          }, 100)
        } else {
          isUpdatingRef.current = false
        }
      }
    },
    [loadCartItems]
  )

  // Handle quantity change for local cart items
  const handleQuantityChangeLocalItem = useCallback(
    (id: string, newQuantity: number) => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        // Update local state immediately for better UX
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        )

        // Set flag to ignore next cart event
        ignoreNextCartEventRef.current = true

        // Then update the store
        updateQuantity(id, newQuantity)

        // No need to notify cart changed here as the store update will trigger a refresh
        // This prevents double-rendering
      } finally {
        // Reset the updating flag after a short delay
        if (isBrowserRef.current) {
          setTimeout(() => {
            isUpdatingRef.current = false
          }, 100)
        } else {
          isUpdatingRef.current = false
        }
      }
    },
    [updateQuantity]
  )

  // Handle remove for server cart items
  const handleRemoveServerItem = useCallback(
    async (id: string) => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        // Update local state immediately for better UX (optimistic update)
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

        // Set flag to ignore next cart event
        ignoreNextCartEventRef.current = true

        // Then update the server
        await removeCartItem(id)

        toast.success("Item removed from cart")
        // No need to notify cart changed here as the server update will trigger a refresh
      } catch (error) {
        console.error("Failed to remove item:", error)
        toast.error("Failed to remove item")

        // Revert the optimistic update on error
        loadCartItems()
      } finally {
        // Reset the updating flag after a short delay
        if (isBrowserRef.current) {
          setTimeout(() => {
            isUpdatingRef.current = false
          }, 100)
        } else {
          isUpdatingRef.current = false
        }
      }
    },
    [loadCartItems]
  )

  // Handle remove for local cart items
  const handleRemoveLocalItem = useCallback(
    (id: string) => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        // Update local state immediately for better UX
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

        // Set flag to ignore next cart event
        ignoreNextCartEventRef.current = true

        // Then update the store
        removeFromCart(id)

        toast.success("Item removed from cart")
        // No need to notify cart changed here as the store update will trigger a refresh
      } finally {
        // Reset the updating flag after a short delay
        if (isBrowserRef.current) {
          setTimeout(() => {
            isUpdatingRef.current = false
          }, 100)
        } else {
          isUpdatingRef.current = false
        }
      }
    },
    [removeFromCart]
  )

  // Check if item quantity is at max stock - memoize this function
  const isAtMaxStock = useCallback((item: CartItem) => {
    return item.totalStock !== undefined && item.quantity >= item.totalStock
  }, [])

  // Render a cart item - memoize this function
  const renderCartItem = useCallback(
    (item: CartItem) => {
      // Determine if this is a server item (for logged-in users) or local item
      const isServerItem = user !== null && !item.id.includes("-")

      return (
        <CartItemComponent
          key={item.id}
          item={item}
          isServerItem={isServerItem}
          user={user}
          onQuantityChange={
            isServerItem
              ? handleQuantityChangeServerItem
              : handleQuantityChangeLocalItem
          }
          onRemove={
            isServerItem ? handleRemoveServerItem : handleRemoveLocalItem
          }
          isAtMaxStock={isAtMaxStock}
        />
      )
    },
    [
      user,
      handleQuantityChangeServerItem,
      handleQuantityChangeLocalItem,
      handleRemoveServerItem,
      handleRemoveLocalItem,
      isAtMaxStock,
    ]
  )

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  // Memoize the order summary to prevent unnecessary re-renders
  const OrderSummary = useMemo(
    () => (
      <div className="lg:col-span-1">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-brand hover:bg-brand/80 text-white"
            asChild
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    ),
    [totalAmount]
  )

  return (
    <div className="px-4 md:px-8 py-8 mx-auto min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {isLoading ? (
        <div className="py-8 text-center">Loading your cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="py-8 text-center">
          <p className="mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <div>{cartItems.map((item) => renderCartItem(item))}</div>
          </div>

          {/* Order Summary - Now memoized */}
          {OrderSummary}
        </div>
      )}
    </div>
  )
}

export default memo(CartPage)
