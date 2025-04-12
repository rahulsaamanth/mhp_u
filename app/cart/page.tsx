"use client"

import { useCartStore } from "@/store/cart"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { removeCartItem, updateCartItemQuantity } from "./_lib/actions"
import { useState } from "react"
import { Trash } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import Link from "next/link"

export default function CartPage() {
  const { items, isLocalCart, updateQuantity, removeItem } = useCartStore()

  const { user } = useCurrentUser()

  // Calculate cart totals
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const handleRemoveItem = async (itemId: string) => {
    if (!isLocalCart) {
      // If online cart, remove from server too
      await removeCartItem(itemId)
    }
    // Always remove from local state
    removeItem(itemId)
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    // Update local state immediately for responsive UI
    updateQuantity(itemId, newQuantity)

    // If using server cart, also update on the server
    if (!isLocalCart) {
      await updateCartItemQuantity(itemId, newQuantity)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex border-b py-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={item.image}
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
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        className="px-2 py-1"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        className="px-2 py-1"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
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
              <Button className="w-full mt-4">Proceed to Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
