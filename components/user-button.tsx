"use client"

import { useCurrentUser } from "@/hooks/use-current-user"
import { LogOut, MapPin, ShoppingBag, User } from "lucide-react"
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
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem className="cursor-default pb-2 hover:bg-none">
            <div className="flex flex-col">
              <span className="font-semibold">{user?.name || "User"}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </DropdownMenuItem>

          <hr className="my-1" />

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => router.push("/profile/my-addresses")}
          >
            <MapPin className="size-4" />
            <span>My Addresses</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => router.push("/profile/my-orders")}
          >
            <ShoppingBag className="size-4" />
            <span>My Orders</span>
          </DropdownMenuItem>

          <hr className="my-1" />

          <LogoutButton>
            <DropdownMenuItem className="cursor-pointer gap-2 text-red-500">
              <LogOut className="size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}
