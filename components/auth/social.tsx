"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { signIn } from "next-auth/react"

interface SignInModalProps {
  callbackUrl?: string
}

export function Social({ callbackUrl }: SignInModalProps) {
  return (
    <Button
      size={"lg"}
      className="w-full cursor-pointer"
      variant={"outline"}
      onClick={() => signIn("google", { redirectTo: callbackUrl })}
    >
      <Icon icon="flat-color-icons:google" width="24" height="24" />
      Continue with Google
    </Button>
  )
}
