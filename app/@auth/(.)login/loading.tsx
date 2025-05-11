"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function LoginModalLoading() {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[500px] p-8 rounded-lg">
        {/* Logo Loading */}
        <DialogTitle></DialogTitle>
        <div className="text-center space-y-2 mb-4">
          <div className="mx-auto w-32 h-20 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
        </div>

        {/* Header Loading */}
        <DialogHeader className="space-y-2 text-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        </DialogHeader>

        {/* Form Loading */}
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-6" />
        </div>

        {/* Footer Text Loading */}
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mx-auto mt-6" />
      </DialogContent>
    </Dialog>
  )
}
