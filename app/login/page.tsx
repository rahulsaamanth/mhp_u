"use client"

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const urlCallbackUrl = searchParams.get("callbackUrl")

  // Prevent login page from redirecting back to itself after login
  const callbackUrl =
    urlCallbackUrl && !urlCallbackUrl.includes("/login") ? urlCallbackUrl : "/"

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md mx-auto sm:my-8 sm:border-t">
      <div className="text-center space-y-2 mb-6">
        <div className="mx-auto w-32 h-20 relative mb-2">
          <Image
            src="/the_logo.png"
            alt="Homeo South Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="text-sm text-muted-foreground italic">
          Healing, as nature intended
        </p>
        <p className="text-sm md:text-base font-medium pt-1">
          - - - NO REGISTRATION REQUIRED - - -
        </p>
      </div>

      <div className="space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold">Welcome</h2>
        <p className="text-muted-foreground">
          Please sign in to continue to Homeo South
        </p>
      </div>

      <LoginForm callbackUrl={callbackUrl} />

      {/* Terms and conditions note */}
      <p className="text-xs text-muted-foreground text-center mt-8">
        By logging in, you agree to our{" "}
        <Link href="/terms" className="text-brand hover:underline">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-brand hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
