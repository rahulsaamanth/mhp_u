"use client"

import { useCurrentUser } from "@/hooks/use-current-user"
import { LogOut, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { LogoutButton } from "./auth/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export default function UserButton() {
  const { user } = useCurrentUser()
  const pathname = usePathname()
  const router = useRouter()

  const callbackUrl = encodeURIComponent(pathname)
  if (!user)
    return (
      <Button
        // href={`/login?callbackUrl=${callbackUrl}`}
        variant="link"
        onClick={() => router.push(`/login?callbackUrl=${callbackUrl}`)}
        className="text-nowrap text-brand-foreground cursor-pointer text-xs transition-all duration-150 active:scale-98 p-1 md:px-2 md:py-1 font-semibold ml-2 hover:text-brand"
      >
        <User className="size-6" />
        Login/Register
      </Button>
    )

  return (
    <span>
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
                <User className="text-brand-foreground size-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="end">
          <DropdownMenuItem className="cursor-default pb-2 hover:bg-none">
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
    </span>
  )
}
