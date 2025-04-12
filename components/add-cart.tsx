"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useCartStore } from "@/store/cart"
import { useCurrentUser } from "@/hooks/use-current-user"
import { addToCart } from "@/app/cart/_lib/actions"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "sonner"

interface AddToCartButtonProps {
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  potency?: string
  packSize?: string
  disabled?: boolean
}

export function AddToCartButton({
  productId,
  variantId,
  name,
  image,
  price,
  potency,
  packSize,
  disabled = false,
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem, isLocalCart } = useCartStore()
  const { user } = useCurrentUser()

  const handleAddToCart = async () => {
    setAdding(true)
    try {
      const item = {
        productId,
        variantId,
        name,
        image,
        price,
        quantity: 1,
        potency,
        packSize,
      }

      console.log("Adding item to cart:", {
        item,
        isUserLoggedIn: !!user,
        isLocalCart,
      })

      // Always add to local state for immediate feedback
      addItem(item)

      // If user is logged in and we're using server cart, also add to server
      if (user && !isLocalCart) {
        console.log("Adding to server cart")
        const result = await addToCart(item)
        console.log("Server cart add result:", result)
      }

      setAdded(true)
      toast.success("Added to cart!")

      // Reset added state after 1.5 seconds
      setTimeout(() => {
        setAdded(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add to cart. Please try again.")
    } finally {
      setAdding(false)
    }
  }

  return (
    <Button
      variant="default"
      onClick={handleAddToCart}
      disabled={adding || disabled}
      className={`rounded-none py-5 px-4 md:px-3 xl:px-4 cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-black flex items-center justify-center gap-1 sm:gap-2 ${
        disabled
          ? "bg-zinc-100 text-gray-400"
          : "bg-zinc-200 hover:bg-zinc-300 text-black"
      }`}
    >
      {adding ? (
        "Adding..."
      ) : added ? (
        <>
          <Check className="size-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
