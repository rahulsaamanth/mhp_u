"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useCartStore } from "@/store/cart"
import { Badge } from "./ui/badge"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function Cart() {
  const { items } = useCartStore()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link href="/cart" className="cursor-pointer relative">
      <Button variant="link" className="cursor-pointer hover:text-brand">
        <ShoppingCart className={`hover:text-brand size-5 md:size-6`} />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
