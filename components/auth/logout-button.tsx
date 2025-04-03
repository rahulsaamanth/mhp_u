"use client"
import { signOut } from "next-auth/react"

interface LogoutButtonProps {
  children?: React.ReactNode
}

export function LogoutButton({ children }: LogoutButtonProps) {
  return <span onClick={() => signOut()}>{children}</span>
}
