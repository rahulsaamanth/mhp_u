"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon } from "lucide-react"

interface QuantitySelectorProps {
  initialQuantity?: number
  min?: number
  max?: number
  onChange: (quantity: number) => void
}

export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 10,
  onChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  useEffect(() => {
    // Update internal state if initialQuantity changes externally
    setQuantity(initialQuantity)
  }, [initialQuantity])

  const increment = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onChange(newQuantity)
    }
  }

  const decrement = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onChange(newQuantity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      const newQuantity = Math.max(min, Math.min(max, value))
      setQuantity(newQuantity)
      onChange(newQuantity)
    }
  }

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={decrement}
        disabled={quantity <= min}
        type="button"
      >
        <MinusIcon className="h-3 w-3" />
      </Button>
      <input
        type="text"
        inputMode="numeric"
        value={quantity}
        onChange={handleInputChange}
        className="h-8 w-12 mx-1 text-center border rounded-md"
        aria-label="Quantity"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={increment}
        disabled={quantity >= max}
        type="button"
      >
        <PlusIcon className="h-3 w-3" />
      </Button>
    </div>
  )
}
