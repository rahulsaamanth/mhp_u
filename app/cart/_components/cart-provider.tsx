// "use client"

// import { useCartStore } from "@/store/cart"
// import { useCurrentUser } from "@/hooks/use-current-user"
// import { getUserCart, mergeLocalCart } from "../_lib/actions"
// import { useEffect, useState } from "react"
// import { toast } from "sonner"

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const { items, isLocalCart, setIsLocalCart, mergeWithServerCart, clearCart } =
//     useCartStore()

//   const { user, isLoading } = useCurrentUser()
//   const [previousLoginState, setPreviousLoginState] = useState<boolean>(false)
//   const [previousUserId, setPreviousUserId] = useState<string | null>(null)
//   const [isMergingCarts, setIsMergingCarts] = useState(false)

//   // Debug the cart state
//   useEffect(() => {
//     console.log("Cart state changed:", {
//       user: user?.id,
//       isLocalCart,
//       itemsCount: items.length,
//       isMergingCarts,
//     })
//   }, [user?.id, isLocalCart, items.length, isMergingCarts])

//   // Handle user logout - clear cart
//   useEffect(() => {
//     // Check if user just logged out
//     const justLoggedOut = !user && previousLoginState

//     if (justLoggedOut) {
//       console.log("User logged out, clearing cart")
//       clearCart()
//       setIsLocalCart(true)
//       toast.info("Cart cleared after logout")
//     }

//     // Update previous login state for next check
//     setPreviousLoginState(!!user)
//     setPreviousUserId(user?.id || null)
//   }, [user, previousLoginState, clearCart, setIsLocalCart])

//   // Handle login and cart synchronization
//   useEffect(() => {
//     if (isLoading) return

//     // Check if user just logged in (wasn't logged in before but is now)
//     const justLoggedIn = user && !previousLoginState

//     // Check if user has switched accounts
//     const userSwitched = user && previousUserId && user.id !== previousUserId

//     if ((justLoggedIn || userSwitched) && !isMergingCarts) {
//       console.log("User login detected:", { justLoggedIn, userSwitched })

//       // User switched accounts - clear previous user's cart
//       if (userSwitched && !isLocalCart) {
//         console.log("User switched accounts, clearing previous user's cart")
//         clearCart()
//         setIsLocalCart(true)
//       } else if (justLoggedIn) {
//         // User just logged in - handle cart sync
//         handleCartSync()
//       }
//     }
//   }, [
//     user,
//     isLoading,
//     previousLoginState,
//     previousUserId,
//     isMergingCarts,
//     clearCart,
//     setIsLocalCart,
//   ])

//   // Handle cart synchronization on login
//   async function handleCartSync() {
//     if (!user || isMergingCarts) return

//     setIsMergingCarts(true)
//     console.log("Syncing cart after login:", {
//       itemsCount: items.length,
//       isLocalCart,
//     })

//     try {
//       if (items.length > 0) {
//         // Show toast for better user feedback
//         toast.loading("Syncing your cart...")

//         // Send local cart items to server - will replace any existing server items
//         const mergeResult = await mergeLocalCart(items)

//         if (mergeResult.success) {
//           // Get the updated server cart
//           const { items: serverItems } = await getUserCart()

//           // Update local state with server cart
//           mergeWithServerCart(serverItems)

//           // Switch to server cart mode
//           setIsLocalCart(false)
//           toast.success("Your cart has been synced with your account")
//         } else {
//           toast.error(
//             "Failed to sync cart: " + (mergeResult.error || "Unknown error")
//           )
//         }
//       } else {
//         // No local items, just fetch any existing server cart
//         const { items: serverItems } = await getUserCart()

//         if (serverItems && serverItems.length > 0) {
//           mergeWithServerCart(serverItems)
//         }

//         // Always switch to server cart mode when logged in
//         setIsLocalCart(false)
//       }
//     } catch (error) {
//       console.error("Failed to sync carts:", error)
//       toast.error("Failed to sync your cart. Please try again later.")
//     } finally {
//       setIsMergingCarts(false)
//     }
//   }

//   return children
// }
