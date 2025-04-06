"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogOut, User } from "lucide-react"
import { LogoutButton } from "./auth/logout-button"
import { usePathname } from "next/navigation"

export default function UserButton() {
  const { user } = useCurrentUser()
  const pathname = usePathname()

  const callbackUrl = encodeURIComponent(pathname)
  if (!user)
    return (
      <Link href={`/login?callbackUrl=${callbackUrl}`}>
        <Button
          variant="default"
          size="sm"
          className="cursor-pointer text-xs bg-brand rounded-none hover:bg-brand/80"
        >
          Login/Register
        </Button>
      </Link>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full border-2 focus-visible:outline-none cursor-pointer">
        <Avatar>
          <AvatarImage
            src={user.image || ""}
            alt={user.name || "Profile"}
            className="object-cover"
          />
          <AvatarFallback>
            {user.name?.[0]?.toUpperCase() || (
              <User className="text-black size-4" />
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="end">
        <DropdownMenuItem className="flex items-center justify-center gap-3 pb-2">
          <Avatar className="size-8">
            <AvatarImage src={user.image || ""} alt={user.name || "Profile"} />

            <AvatarFallback>
              {user.name?.[0]?.toUpperCase() || (
                <User className="text-black size-4" />
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">{user?.name || "User"}</span>
        </DropdownMenuItem>
        <hr />
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer space-x-2">
            <LogOut className="size-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
