"use server"

import { db } from "@/db/db"
import { CartItem } from "@/store/cart"
import { currentUser } from "@/lib/auth"
import { eq, isNull } from "drizzle-orm"
import { cart, product, productVariant } from "@rahulsaamanth/mhp-schema"
import { generateId } from "@/lib/generate-id"

export type ServerCartItem = {
  id: string
  userId: string
  productId: string
  variantId: string
  quantity: number
  potency: string | null
  packSize: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getUserCart() {
  const user = await currentUser()
  if (!user?.id) return { items: [] }

  try {
    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        variantId: cart.variantId,
        quantity: cart.quantity,
        potency: cart.potency,
        packSize: cart.packSize,
      })
      .from(cart)
      .where(eq(cart.userId, user.id))

    // Fetch product details for each cart item
    const items = await Promise.all(
      cartItems.map(async (item) => {
        const productData = await db.query.product.findFirst({
          where: eq(product.id, item.productId),
          columns: {
            name: true,
          },
        })

        const variantData = await db.query.productVariant.findFirst({
          where: eq(productVariant.id, item.variantId),
          columns: {
            variantImage: true,
            sellingPrice: true,
          },
        })

        return {
          id: item.id,
          productId: item.productId,
          variantId: item.variantId,
          name: productData?.name || "Unknown Product",
          image: variantData?.variantImage?.[0] || "",
          price: variantData?.sellingPrice || 0,
          quantity: item.quantity,
          potency: item.potency || undefined,
          packSize: item.packSize || undefined,
        } as CartItem
      })
    )

    return { items }
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    return { items: [] }
  }
}

export async function addToCart(item: Omit<CartItem, "id">) {
  const user = await currentUser()
  if (!user?.id) return { success: false }

  try {
    const existingItem = await db.query.cart.findFirst({
      where: (fields) => {
        return (
          eq(fields.userId, user.id!) &&
          eq(fields.variantId, item.variantId) &&
          (item.potency ? eq(fields.potency, item.potency) : undefined) &&
          (item.packSize ? eq(fields.packSize, item.packSize) : undefined)
        )
      },
    })

    if (existingItem) {
      await db
        .update(cart)
        .set({
          quantity: existingItem.quantity + item.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cart.id, existingItem.id))
    } else {
      await db.insert(cart).values({
        id: generateId(),
        userId: user.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        potency: item.potency || null,
        packSize: item.packSize || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to add to cart:", error)
    return { success: false }
  }
}

export async function mergeLocalCart(localItems: CartItem[]) {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  console.log(
    "Server: Merging local cart for user",
    user.id,
    "with items:",
    localItems
  )

  try {
    // Process each local item
    for (const item of localItems) {
      console.log("Server: Processing item:", item)

      // Check if this item already exists in the user's cart
      const existingItem = await db.query.cart.findFirst({
        where: (fields) => {
          return (
            eq(fields.userId, user.id!) &&
            eq(fields.variantId, item.variantId) &&
            (item.potency
              ? eq(fields.potency, item.potency)
              : isNull(fields.potency)) &&
            (item.packSize
              ? eq(fields.packSize, item.packSize)
              : isNull(fields.packSize))
          )
        },
      })

      console.log(
        "Server: Existing item check:",
        existingItem ? "found" : "not found"
      )

      if (existingItem) {
        // If item exists, update the quantity
        await db
          .update(cart)
          .set({
            quantity: existingItem.quantity + item.quantity,
            updatedAt: new Date(),
          })
          .where(eq(cart.id, existingItem.id))

        console.log("Server: Updated existing item quantity")
      } else {
        // If item doesn't exist, insert it
        const generatedId = generateId()
        console.log("Server: Generated ID:", generatedId)

        await db.insert(cart).values({
          id: generatedId,
          userId: user.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          potency: item.potency || null,
          packSize: item.packSize || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        console.log("Server: Added new item to cart")
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Server: Failed to merge cart:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function removeCartItem(itemId: string) {
  const user = await currentUser()
  if (!user?.id) return { success: false }

  try {
    await db.delete(cart).where(eq(cart.id, itemId))

    return { success: true }
  } catch (error) {
    console.error("Failed to remove cart item:", error)
    return { success: false }
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const user = await currentUser()
  if (!user?.id) return { success: false }

  try {
    // Check if this cart item belongs to the current user
    const existingItem = await db.query.cart.findFirst({
      where: (fields) => {
        return eq(fields.id, itemId)
      },
    })

    if (!existingItem || existingItem.userId !== user.id) {
      return { success: false, error: "Item not found or not authorized" }
    }

    await db
      .update(cart)
      .set({
        quantity: quantity,
        updatedAt: new Date(),
      })
      .where(eq(cart.id, itemId))

    return { success: true }
  } catch (error) {
    console.error("Failed to update cart item quantity:", error)
    return { success: false }
  }
}
