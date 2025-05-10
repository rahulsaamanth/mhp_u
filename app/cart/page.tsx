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

interface CartItemComponentProps {
  item: CartItem
  isServerItem: boolean
  user: any
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
    const [isPending, startTransition] = useTransition()

    const handleQuantityChange = (newQuantity: number) => {
      startTransition(() => {
        onQuantityChange(item.id, newQuantity)
      })
    }

    return (
      <div className="flex border-b py-4">
        <div className="w-24 h-24 relative flex-shrink-0">
          <Image
            src={"/placeholder.png"}
            alt={item.name}
            fill
            className="object-contain"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "/placeholder.png"
            }}
          />
        </div>
        <div className="ml-4 flex-grow">
          <Link
            href={`/product/${item.productId}`}
            className="hover:text-brand transition-colors"
          >
            <h3 className="font-medium">{item.name}</h3>
          </Link>
          {item.potency && (
            <p className="text-sm text-gray-500">Potency: {item.potency}</p>
          )}
          {item.packSize && (
            <p className="text-sm text-gray-500">Pack Size: {item.packSize}</p>
          )}

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

CartItemComponent.displayName = "CartItemComponent"

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useCurrentUser()
  const { isLocalCart } = useCartContext()

  const isUpdatingRef = useRef(false)
  const wasDocumentHiddenRef = useRef<boolean | undefined>(undefined)
  const ignoreNextCartEventRef = useRef(false)
  const isBrowserRef = useRef(false)
  const isMountedRef = useRef(false)

  useEffect(() => {
    isBrowserRef.current = true
    isMountedRef.current = true
    wasDocumentHiddenRef.current =
      typeof document !== "undefined" ? document.hidden : false

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const localCartItems = useCartStore((state) => state.items)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const loadCartItems = useCallback(async () => {
    if (!isMountedRef.current) return

    if (isUpdatingRef.current) return
    isUpdatingRef.current = true

    try {
      if (user) {
        const { items: serverItems } = await getUserCart()
        if (isMountedRef.current) {
          setCartItems(serverItems)
        }
      } else {
        if (isMountedRef.current) {
          setCartItems((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(localCartItems)) {
              return localCartItems
            }
            return prev
          })
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
      if (isMountedRef.current) {
        if (user) {
          setCartItems([])
        } else {
          setCartItems(localCartItems)
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
        setIsInitialized(true)
      }
      if (isBrowserRef.current && isMountedRef.current) {
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 100)
      } else {
        isUpdatingRef.current = false
      }
    }
  }, [user, localCartItems])

  useEffect(() => {
    if (!isInitialized) {
      loadCartItems()
    }
  }, [loadCartItems, isInitialized])

  useEffect(() => {
    if (!user && isInitialized) {
      setCartItems(localCartItems)
    }
  }, [localCartItems, user, isInitialized])

  useEffect(() => {
    if (!isBrowserRef.current) return

    const handleVisibilityChange = () => {
      const isHidden = document.hidden

      if (
        !isHidden &&
        wasDocumentHiddenRef.current === true &&
        !isUpdatingRef.current
      ) {
        console.log(
          "Tab visibility changed (focus), updating cart with debounce"
        )
        const timer = setTimeout(() => {
          if (!ignoreNextCartEventRef.current) {
            loadCartItems()
          }
        }, 1000)

        return () => clearTimeout(timer)
      }

      wasDocumentHiddenRef.current = isHidden
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [loadCartItems])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const handleCartChange = () => {
      if (ignoreNextCartEventRef.current) {
        ignoreNextCartEventRef.current = false
        return
      }

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      if (isUpdatingRef.current) return

      if (!user) {
        setCartItems((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(localCartItems)) {
            return [...localCartItems]
          }
          return prev
        })
      } else {
        timeoutId = setTimeout(() => {
          if (!isUpdatingRef.current) {
            loadCartItems()
          }
        }, 1000)
      }
    }

    const unsubscribe = cartEvents.subscribe(handleCartChange)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      unsubscribe()
    }
  }, [user, localCartItems, loadCartItems])

  const handleQuantityChangeServerItem = useCallback(
    async (id: string, newQuantity: number) => {
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        )

        ignoreNextCartEventRef.current = true

        await updateCartItemQuantity(id, newQuantity)
      } catch (error) {
        console.error("Failed to update quantity:", error)
        toast.error("Failed to update quantity")

        loadCartItems()
      } finally {
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

  const handleQuantityChangeLocalItem = useCallback(
    (id: string, newQuantity: number) => {
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        )

        ignoreNextCartEventRef.current = true

        updateQuantity(id, newQuantity)
      } finally {
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

  const handleRemoveServerItem = useCallback(
    async (id: string) => {
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

        ignoreNextCartEventRef.current = true

        await removeCartItem(id)

        cartEvents.notifyCartChanged(50)

        toast.success("Item removed from cart")
      } catch (error) {
        console.error("Failed to remove item:", error)
        toast.error("Failed to remove item")

        loadCartItems()
      } finally {
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

  const handleRemoveLocalItem = useCallback(
    (id: string) => {
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      try {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

        ignoreNextCartEventRef.current = true

        removeFromCart(id)

        cartEvents.notifyCartChanged(50)

        toast.success("Item removed from cart")
      } finally {
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

  const isAtMaxStock = useCallback((item: CartItem) => {
    return item.totalStock !== undefined && item.quantity >= item.totalStock
  }, [])

  const renderCartItem = useCallback(
    (item: CartItem) => {
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

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

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
    <div className="container px-4 md:px-8 py-8 mx-auto min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {!isInitialized || isLoading ? (
        <div className="py-8 text-center">Loading your cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="py-8 text-center">
          <p className="mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/products/all">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div>{cartItems.map((item) => renderCartItem(item))}</div>
          </div>

          {OrderSummary}
        </div>
      )}
    </div>
  )
}

export default memo(CartPage)
