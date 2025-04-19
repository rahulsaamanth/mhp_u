"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { addToCart } from "@/app/cart/_lib/actions"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cartEvents } from "@/lib/cart-events"
import { AddToCartInput, useCartStore } from "@/store/cart"

interface AddToCartButtonProps {
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  potency?: string
  packSize?: string
  quantity?: number
  disabled?: boolean
  buyNow?: boolean
}

export function AddToCartButton({
  productId,
  variantId,
  name,
  image,
  price,
  potency,
  packSize,
  quantity = 1,
  disabled = false,
  buyNow = false,
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const { user } = useCurrentUser()
  const router = useRouter()
  const { addToCart: addToLocalCart } = useCartStore()

  const handleAddToCart = async () => {
    setAdding(true)
    try {
      // Create item object
      const item: AddToCartInput = {
        productId,
        variantId,
        name,
        image,
        price,
        quantity,
        potency,
        packSize,
      }

      if (user) {
        // If logged in, add to server cart
        const result = await addToCart(item)

        if (result.success) {
          setAdded(true)
          toast.success("Added to cart!")
          cartEvents.notifyCartChanged()

          // Redirect to cart if buyNow is true
          if (buyNow) {
            router.push("/cart")
          }
        } else {
          toast.error(
            result.error || "Failed to add to cart. Please try again."
          )
        }
      } else {
        // If not logged in, add to local cart
        addToLocalCart(item)
        setAdded(true)
        toast.success("Added to cart!")
        cartEvents.notifyCartChanged()

        // Redirect to cart if buyNow is true
        if (buyNow) {
          router.push("/cart")
        }
      }

      // Reset added state after 1.5 seconds (only if not redirecting)
      if (!buyNow) {
        setTimeout(() => {
          setAdded(false)
        }, 1500)
      }
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
      className={`rounded-none py-5 px-4 md:px-3 xl:px-4 cursor-pointer 
      ${
        buyNow
          ? "bg-brand hover:bg-brand/90 text-white"
          : disabled
          ? "bg-zinc-100 text-gray-400"
          : "bg-zinc-200 hover:bg-zinc-300 text-black"
      }
      active:bg-zinc-400 active:scale-95 
      focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1
      transition-all duration-150
      flex items-center justify-center`}
    >
      {adding ? (
        buyNow ? (
          "Processing..."
        ) : (
          "Adding..."
        )
      ) : added ? (
        <>
          <Check className="size-4" />
          {buyNow ? "Proceeding..." : "Added"}
        </>
      ) : (
        <span>{buyNow ? "Buy Now" : "Add to Cart"}</span>
      )}
    </Button>
  )
}
