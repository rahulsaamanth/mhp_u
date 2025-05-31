"use client"

import { LoginForm } from "@/components/auth/login-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginModal() {
  const router = useRouter()

  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[500px] p-8 rounded-lg">
        <div className="text-center space-y-2 mb-4">
          <div className="mx-auto w-32 h-20 relative mb-2">
            <Image
              src="/the_logo1.png"
              alt="Homeo South Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm text-muted-foreground italic">
            Healing, as nature intended
          </p>
          <p className="text-sm md:text-base">
            - - - NO REGISTRATION REQUIRED - - -
          </p>
        </div>

        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-2xl font-semibold">Welcome</DialogTitle>
          <DialogDescription>
            Please sign in to continue to Homeo South
          </DialogDescription>
        </DialogHeader>

        <LoginForm callbackUrl={callbackUrl} />

        <p className="text-xs text-muted-foreground text-center mt-6">
          By logging in, you agree to our{" "}
          <Link
            href="/terms"
            className="text-brand hover:underline"
            onClick={(e) => {
              e.preventDefault()
              // First go back to close the modal, then navigate to terms
              router.back()
              setTimeout(() => {
                router.push("/terms-conditions")
              }, 100)
            }}
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-brand hover:underline"
            onClick={(e) => {
              e.preventDefault()
              // First go back to close the modal, then navigate to privacy
              router.back()
              setTimeout(() => {
                router.push("/privacy")
              }, 100)
            }}
          >
            Privacy Policy
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}
