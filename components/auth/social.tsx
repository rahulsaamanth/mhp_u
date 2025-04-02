"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"

interface SignInModalProps {
  callbackUrl?: string
}

export function Social({ callbackUrl = "/" }: SignInModalProps) {
  const router = useRouter()

  const onClick = async (provider: string) => {
    await signIn(provider, {
      callbackUrl: callbackUrl,
    })
  }

  return (
    <Button
      size={"lg"}
      className="w-full cursor-pointer"
      variant={"outline"}
      onClick={() => onClick("google")}
    >
      <Icon icon="flat-color-icons:google" width="24" height="24" />
      Continue with Google
    </Button>
  )
}
