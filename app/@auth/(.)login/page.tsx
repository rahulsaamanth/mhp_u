"use client"

import { LoginForm } from "@/components/auth/login-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginModal() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[500px] p-8 rounded-lg">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-brand uppercase">
            Homeo South
          </h1>
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

        {/* Terms and conditions note */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By logging in, you agree to our{" "}
          <Link href="/terms" className="text-brand hover:underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}
