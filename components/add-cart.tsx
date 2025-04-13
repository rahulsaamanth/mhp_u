"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { addToCart } from "@/app/cart/_lib/actions"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cartEvents } from "@/lib/cart-events"
import { AddToCartInput } from "@/store/cart"

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
  const { user } = useCurrentUser()
  const router = useRouter()

  const handleAddToCart = async () => {
    // If user is not logged in, redirect to login page
    if (!user) {
      const currentPath = window.location.pathname
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
      return
    }

    setAdding(true)
    try {
      // Create an object that matches the AddToCartInput interface
      const item: AddToCartInput = {
        productId,
        variantId,
        name,
        image,
        price,
        quantity: 1,
        potency,
        packSize,
      }

      // Add to database cart
      const result = await addToCart(item)

      if (result.success) {
        setAdded(true)
        toast.success("Added to cart!")

        // Notify cart components that an item was added
        cartEvents.notifyCartChanged()

        // Reset added state after 1.5 seconds
        setTimeout(() => {
          setAdded(false)
        }, 1500)
      } else {
        // Display the specific error message from the server
        toast.error(result.error || "Failed to add to cart. Please try again.")
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
      className={`rounded-none py-5 px-4 md:px-3 xl:px-4 cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-black flex items-center justify-center ${
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
        <span>Add to Cart</span>
      )}
    </Button>
  )
}
