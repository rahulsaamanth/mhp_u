"use client"

import { Button } from "@/components/ui/button"
import {
  removeCartItem,
  updateCartItemQuantity,
  getUserCart,
} from "./_lib/actions"
import { useState, useEffect } from "react"
import { Trash } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import Link from "next/link"
import { CartItem } from "@/store/cart"
import { cartEvents } from "@/lib/cart-events"
import { toast } from "sonner"

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart items from the database
  const loadCartItems = async () => {
    setIsLoading(true)
    try {
      const { items: cartItems } = await getUserCart()
      setItems(cartItems)
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCartItems()
  }, [])

  // Calculate cart totals
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const handleRemoveItem = async (itemId: string) => {
    try {
      const result = await removeCartItem(itemId)
      if (result.success) {
        setItems(items.filter((item) => item.id !== itemId))
        // Notify that cart has changed
        cartEvents.notifyCartChanged()
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    // Find the item to check against stock
    const currentItem = items.find((item) => item.id === itemId)
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
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      setItems(updatedItems)

      // Update on server
      await updateCartItemQuantity(itemId, newQuantity)

      // Notify that cart has changed
      cartEvents.notifyCartChanged()
    } catch (error) {
      console.error("Failed to update quantity:", error)
      // Revert on error
      loadCartItems()
    }
  }

  // Check if item quantity is at max stock
  const isAtMaxStock = (item: CartItem) => {
    return item.totalStock !== undefined && item.quantity >= item.totalStock
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading your cart...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-[50vh] py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex border-b py-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.potency && (
                    <p className="text-sm text-gray-500">
                      Potency: {item.potency}
                    </p>
                  )}
                  {item.packSize && (
                    <p className="text-sm text-gray-500">
                      Pack Size: {item.packSize}
                    </p>
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

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        className="px-2 py-1"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        className={`px-2 py-1 ${
                          isAtMaxStock(item)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={isAtMaxStock(item)}
                        title={
                          isAtMaxStock(item) ? "Maximum stock reached" : ""
                        }
                      >
                        +
                      </button>
                    </div>
                    <div>{formatCurrency(item.price * item.quantity)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
