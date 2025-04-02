"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function UserButton() {
  const { user } = useCurrentUser()

  if (!user)
    return (
      <Link href="/login">
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer text-xs bg-brand rounded-none hover:bg-brand/80"
        >
          Login/Register
        </Button>
      </Link>
    )

  return <p>{user.name}</p>
}
