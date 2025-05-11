"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrderConfirmationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto py-10 text-center space-y-4 min-h-[60vh]">
      <h2 className="text-2xl font-semibold">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">Failed to load order details.</p>
      <div className="flex justify-center gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
