"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function Cart() {
  return (
    <Link href="/cart" className="cursor-pointer">
      <ShoppingCart className={`hover:text-brand size-5 md:size-6`} />
    </Link>
  )
}
