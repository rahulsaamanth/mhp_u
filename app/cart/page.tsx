"use client"

import { Button } from "@/components/ui/button"
import {
  removeCartItem,
  updateCartItemQuantity,
  getUserCart,
  addToCart,
} from "./_lib/actions"
import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Trash, PlusCircle } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import Link from "next/link"
import { CartItem, useCartStore, AddToCartInput } from "@/store/cart"
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
  onAddToAccount: (item: CartItem) => void
  isAtMaxStock: (item: CartItem) => boolean
}

const CartItemComponent = memo(
  ({
    item,
    isServerItem,
    user,
    onQuantityChange,
    onRemove,
    onAddToAccount,
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
                    ? "bg-green-500"
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
            {user && !isServerItem ? (
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-evenly gap-1 text-nowrap px-2 flex-1 sm:flex-auto cursor-pointer"
                  onClick={() => onAddToAccount(item)}
                  disabled={isPending}
                >
                  <PlusCircle className="h-3 w-3" />
                  <span className="text-xs">Add to Account</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="flex items-center justify-evenly gap-1 px-2 flex-1 sm:flex-auto cursor-pointer"
                  disabled={isPending}
                >
                  <Trash className="h-3 w-3" />
                  <span className="text-xs">Remove</span>
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    )
  }
)

// Add display name to help with debugging
CartItemComponent.displayName = "CartItemComponent"

export default function CartPage() {
  const [serverItems, setServerItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useCurrentUser()
  const { isLocalCart } = useCartContext()

  // Fix the infinite loop warning by using separate selectors
  const cartItems = useCartStore((state) => state.items)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const [localItems, setLocalItems] = useState<CartItem[]>([])

  // Load cart items from the server or local storage
  const loadCartItems = useCallback(async () => {
    setIsLoading(true)
    try {
      if (user) {
        // Logged in user - get cart from server
        const { items: cartItems } = await getUserCart()
        setServerItems(cartItems)
        // Keep local items separate when user is logged in
        setLocalItems((prevItems) => {
          // Only update if there's a change
          return JSON.stringify(prevItems) !== JSON.stringify(cartItems)
            ? cartItems
            : prevItems
        })
      } else {
        // Anonymous user - get cart from local storage
        setLocalItems(cartItems)
        setServerItems([])
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user, cartItems])

  // Initial load of cart items
  useEffect(() => {
    loadCartItems()
  }, [loadCartItems])

  // Subscribe to cart item changes in local storage
  useEffect(() => {
    // Only update local items when they've actually changed
    if (JSON.stringify(localItems) !== JSON.stringify(cartItems)) {
      setLocalItems(cartItems)
    }

    // Subscribe to cart events (useful for server cart updates)
    const unsubscribe = cartEvents.subscribe(() => {
      if (user) {
        // Reload server cart when cart events are triggered
        getUserCart().then(({ items }) => {
          // Only update if there are actual changes
          if (JSON.stringify(items) !== JSON.stringify(serverItems)) {
            setServerItems(items)
          }
        })
      }
    })

    return () => unsubscribe()
  }, [user, cartItems, localItems, serverItems])

  // Calculate cart totals - memoize to prevent recalculation on every render
  const serverSubtotal = useMemo(
    () =>
      serverItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [serverItems]
  )

  const localSubtotal = useMemo(
    () =>
      localItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [localItems]
  )

  const totalAmount = useMemo(
    () => serverSubtotal + (user ? 0 : localSubtotal),
    [serverSubtotal, localSubtotal, user]
  )

  // Calculate total unique items for display
  const serverUniqueItemCount = serverItems.length
  const localUniqueItemCount = localItems.length
  const totalUniqueItemCount =
    (user ? serverUniqueItemCount : 0) + localUniqueItemCount

  // Calculate total quantities (for reference - we won't display this)
  const serverTotalQuantity = serverItems.reduce(
    (total, item) => total + item.quantity,
    0
  )
  const localTotalQuantity = localItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Memoize handlers to prevent recreation on every render
  const handleRemoveServerItem = useCallback(async (itemId: string) => {
    try {
      const result = await removeCartItem(itemId)
      if (result.success) {
        setServerItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        )
        // Notify that cart has changed
        cartEvents.notifyCartChanged()
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }, [])

  const handleRemoveLocalItem = useCallback(
    (itemId: string) => {
      removeFromCart(itemId)
      setLocalItems(cartItems.filter((item) => item.id !== itemId))
      cartEvents.notifyCartChanged()
    },
    [cartItems, removeFromCart]
  )

  const handleQuantityChangeServerItem = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (newQuantity < 1) return

      // Find the item to check against stock
      const currentItem = serverItems.find((item) => item.id === itemId)
      if (!currentItem) return

      // Check if requesting more than available stock
      if (
        currentItem.totalStock !== undefined &&
        newQuantity > currentItem.totalStock
      ) {
        toast.error(
          `Cannot add more items. Only ${currentItem.totalStock} available in stock.`
        )
        return
      }

      try {
        // Update locally for immediate feedback
        setServerItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        )

        // Update on server
        await updateCartItemQuantity(itemId, newQuantity)

        // Notify that cart has changed
        cartEvents.notifyCartChanged()
      } catch (error) {
        console.error("Failed to update quantity:", error)
        // Revert on error
        loadCartItems()
      }
    },
    [serverItems, loadCartItems]
  )

  const handleQuantityChangeLocalItem = useCallback(
    (itemId: string, newQuantity: number) => {
      if (newQuantity < 1) return

      // Find the item to check against stock
      const currentItem = localItems.find((item) => item.id === itemId)
      if (!currentItem) return

      // Check if requesting more than available stock
      if (
        currentItem.totalStock !== undefined &&
        newQuantity > currentItem.totalStock
      ) {
        toast.error(
          `Cannot add more items. Only ${currentItem.totalStock} available in stock.`
        )
        return
      }

      // Update in local storage
      updateQuantity(itemId, newQuantity)

      // Update local state with modified item
      const updatedItems = localItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      setLocalItems(updatedItems)

      cartEvents.notifyCartChanged()
    },
    [localItems, updateQuantity]
  )

  // Function to add a local cart item to server cart
  const addLocalItemToServerCart = useCallback(
    async (item: CartItem) => {
      try {
        // Create input object for server
        const input: AddToCartInput = {
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          potency: item.potency,
          packSize: item.packSize,
        }

        // Add to server cart
        const result = await addToCart(input)

        if (result.success) {
          // First remove from local store directly
          removeFromCart(item.id)

          // Then update our local state to reflect the change
          setLocalItems((prevItems) =>
            prevItems.filter((localItem) => localItem.id !== item.id)
          )

          // Immediately fetch updated server cart
          const { items: updatedServerItems } = await getUserCart()
          setServerItems(updatedServerItems)

          // Notify all other components about the change
          cartEvents.notifyCartChanged()

          toast.success("Item added to your account cart")
        } else {
          toast.error(result.error || "Failed to add to cart")
        }
      } catch (error) {
        console.error("Failed to add item to server cart:", error)
        toast.error("Failed to add item to your account cart")
      }
    },
    [removeFromCart]
  )

  // Function to add all local cart items to server cart
  const addAllToAccountCart = useCallback(async () => {
    try {
      // Show loading message
      toast.loading("Adding items to your account cart...")

      // Process each local item
      let successCount = 0
      let failCount = 0

      // Use Promise.all to process all items in parallel
      const results = await Promise.all(
        localItems.map(async (item) => {
          try {
            // Create input object for server
            const input: AddToCartInput = {
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              potency: item.potency,
              packSize: item.packSize,
            }

            // Add to server cart
            const result = await addToCart(input)

            if (result.success) {
              successCount++
              return { success: true, itemId: item.id }
            } else {
              failCount++
              return { success: false, itemId: item.id, error: result.error }
            }
          } catch (error) {
            failCount++
            return { success: false, itemId: item.id, error: "Request failed" }
          }
        })
      )

      // Remove all successfully added items from local cart
      results.forEach((result) => {
        if (result.success) {
          removeFromCart(result.itemId)
        }
      })

      // Update local cart state with remaining items
      setLocalItems(cartItems)

      // Fetch updated server cart
      const { items: updatedServerItems } = await getUserCart()
      setServerItems(updatedServerItems)

      // Notify all components about the change
      cartEvents.notifyCartChanged()

      // Show result message
      toast.dismiss()
      if (successCount > 0 && failCount === 0) {
        toast.success(`All item(s) added to your account cart`)
      } else if (successCount > 0 && failCount > 0) {
        toast.info(
          `${successCount} items added to your account cart. ${failCount} items failed.`
        )
      } else if (successCount === 0 && failCount > 0) {
        toast.error(`Failed to add items to your account cart`)
      }
    } catch (error) {
      console.error("Failed to add items to server cart:", error)
      toast.error("Failed to add items to your account cart")
    }
  }, [localItems, cartItems, removeFromCart])

  // Check if item quantity is at max stock - memoize this function
  const isAtMaxStock = useCallback((item: CartItem) => {
    return item.totalStock !== undefined && item.quantity >= item.totalStock
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center min-h-[50vh]">
        <p>Loading your cart...</p>
      </div>
    )
  }

  // Helper function to render a cart item (replace with the memoized component)
  const renderCartItem = (item: CartItem, isServerItem: boolean) => (
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
      onRemove={isServerItem ? handleRemoveServerItem : handleRemoveLocalItem}
      onAddToAccount={addLocalItemToServerCart}
      isAtMaxStock={isAtMaxStock}
    />
  )

  const noItemsMessage = (
    <div className="text-center py-10">
      <p className="text-lg mb-4">Your cart is empty</p>
      <Button asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  )

  const bothCartsEmpty = serverItems.length === 0 && localItems.length === 0

  return (
    <div className="container mx-auto min-h-[50vh] py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm text-blue-800">
            Shopping as guest.{" "}
            <Link href="/login" className="underline font-medium">
              Sign in
            </Link>{" "}
            to save your cart.
          </p>
        </div>
      )}

      {bothCartsEmpty ? (
        noItemsMessage
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Account Cart Items (Server Cart) */}
            {user && serverItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                  Your Account Cart
                </h2>
                {serverItems.map((item) => renderCartItem(item, true))}
              </div>
            )}

            {/* Local (Guest) Cart Items */}
            {localItems.length > 0 && (
              <div>
                {user ? (
                  <div className="py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <h2 className="text-xl font-semibold">
                      Guest Cart Items
                      <span className="text-sm font-normal ml-2 text-gray-500 block sm:inline-block">
                        (Not yet added to your account)
                      </span>
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addAllToAccountCart}
                      className="cursor-pointer"
                    >
                      <PlusCircle className="size-4 mr-2" />
                      Add All to Account
                    </Button>
                  </div>
                ) : null}

                {localItems.map((item) => renderCartItem(item, false))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="space-y-2">
                {user && serverItems.length > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Account Items Subtotal ({serverUniqueItemCount}{" "}
                      {serverUniqueItemCount === 1 ? "item" : "items"})
                    </span>
                    <span>{formatCurrency(serverSubtotal)}</span>
                  </div>
                )}

                {localItems.length > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Guest Items Subtotal ({localUniqueItemCount}{" "}
                      {localUniqueItemCount === 1 ? "item" : "items"})
                    </span>
                    <span>{formatCurrency(localSubtotal)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>
                    Total ({totalUniqueItemCount}{" "}
                    {totalUniqueItemCount === 1 ? "item" : "items"})
                  </span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              {user && localItems.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                  <p className="text-amber-800">
                    Please add guest cart items to your account before checkout.
                    Or remove them from your cart.
                  </p>
                </div>
              )}
              <Button
                className="w-full mt-4 bg-brand hover:bg-brand-hover text-brand-foreground"
                asChild
                disabled={user && localItems.length > 0}
                title={
                  user && localItems.length > 0
                    ? "Please add guest items to your account first"
                    : ""
                }
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
