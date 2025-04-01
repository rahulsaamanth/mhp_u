"use client"

import Link from "next/link"
import { Button } from "./ui/button"

export default function UserButton() {
  return (
    <Link href="/login">
      <Button
        variant="link"
        className="cursor-pointer font-medium hover:text-brand"
      >
        <span className="text-sm md:text-base">Login</span>
      </Button>
    </Link>
  )
}
