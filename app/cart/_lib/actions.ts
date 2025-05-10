"use server"

import { db } from "@/db/db"
import { CartItem, AddToCartInput } from "@/store/cart"
import { currentUser } from "@/lib/auth"
import { eq, isNull } from "drizzle-orm"
import {
  cart,
  product,
  productVariant,
  productInventory,
} from "@rahulsaamanth/mhp-schema"
import { generateId } from "@/lib/generate-id"

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

        const inventoryData = await db
          .select({
            stock: productInventory.stock,
          })
          .from(productInventory)
          .where(eq(productInventory.productVariantId, item.variantId))

        const totalStock = inventoryData.reduce(
          (acc, inv) => acc + inv.stock,
          0
        )

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
          totalStock: totalStock || 0,
        } as CartItem
      })
    )

    return { items }
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    return { items: [] }
  }
}

export async function addToCart(item: AddToCartInput) {
  const user = await currentUser()

  if (!user?.id) {
    return { success: true }
  }

  try {
    const inventoryData = await db
      .select({
        stock: productInventory.stock,
      })
      .from(productInventory)
      .where(eq(productInventory.productVariantId, item.variantId))

    const totalStock = inventoryData.reduce((acc, inv) => acc + inv.stock, 0)

    if (item.quantity > totalStock) {
      return {
        success: false,
        error: `Cannot add ${item.quantity} items. Only ${totalStock} available in stock.`,
      }
    }

    let existingItem = null

    const existingItemQuery = db.query.cart.findFirst({
      where: (fields, { and, eq, isNull }) => {
        const conditions = [
          eq(fields.userId, user.id as string),
          eq(fields.productId, item.productId),
          eq(fields.variantId, item.variantId),
        ]

        if (item.potency) {
          conditions.push(eq(fields.potency, item.potency))
        } else {
          conditions.push(isNull(fields.potency))
        }

        if (item.packSize) {
          conditions.push(eq(fields.packSize, item.packSize))
        } else {
          conditions.push(isNull(fields.packSize))
        }

        return and(...conditions)
      },
    })

    existingItem = await existingItemQuery

    console.log(
      "Existing item check:",
      existingItem ? "Found existing item" : "No existing item found"
    )

    const newQuantity = (existingItem?.quantity || 0) + item.quantity

    if (newQuantity > totalStock) {
      return {
        success: false,
        error: `Cannot add more items. Only ${totalStock} available in stock.`,
      }
    }

    if (existingItem) {
      console.log("Updating quantity for existing item:", existingItem.id)
      await db
        .update(cart)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cart.id, existingItem.id))
    } else {
      console.log("Adding new item to cart")
      const newItemId = generateId()
      await db.insert(cart).values({
        id: newItemId,
        userId: user.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        potency: item.potency || null,
        packSize: item.packSize || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("Added new item with ID:", newItemId)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to add to cart:", error)
    return { success: false, error: "Failed to add item to cart" }
  }
}

export async function removeCartItem(itemId: string) {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  try {
    const existingItem = await db.query.cart.findFirst({
      where: (fields) => eq(fields.id, itemId),
    })

    if (!existingItem || existingItem.userId !== user.id) {
      return { success: false, error: "Item not found or unauthorized" }
    }

    await db.delete(cart).where(eq(cart.id, itemId))
    return { success: true }
  } catch (error) {
    console.error("Failed to remove cart item:", error)
    return { success: false, error: "Failed to remove item" }
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  try {
    const existingItem = await db.query.cart.findFirst({
      where: (fields) => eq(fields.id, itemId),
    })

    if (!existingItem || existingItem.userId !== user.id) {
      return { success: false, error: "Item not found or unauthorized" }
    }

    const inventoryData = await db
      .select({
        stock: productInventory.stock,
      })
      .from(productInventory)
      .where(eq(productInventory.productVariantId, existingItem.variantId))

    const totalStock = inventoryData.reduce((acc, inv) => acc + inv.stock, 0)

    if (quantity > totalStock) {
      return {
        success: false,
        error: `Cannot update quantity. Only ${totalStock} available in stock.`,
      }
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
    return { success: false, error: "Failed to update quantity" }
  }
}

export async function clearUserCart() {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  try {
    await db.delete(cart).where(eq(cart.userId, user.id))
    return { success: true }
  } catch (error) {
    console.error("Failed to clear cart:", error)
    return { success: false, error: "Failed to clear cart" }
  }
}
